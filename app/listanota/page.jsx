'use client';

import { useCallback, useEffect, useState } from "react";
import Header from "../components/header";

const CAMPOS_NOTA = [
  { id: "t1", label: "Trabalho 1 (T1)" },
  { id: "t2", label: "Trabalho 2 (T2)" },
  { id: "t3", label: "Trabalho 3 (T3)" },
  { id: "n1", label: "Nota 1 (N1)" },
  { id: "n2", label: "Nota 2 (N2)" },
  { id: "n3", label: "Nota 3 (N3)" },
];

const NOTA_VAZIA = { id_aluno: "", t1: "", t2: "", t3: "", n1: "", n2: "", n3: "" };

export default function NotaAluno() {
  const [alunos, setAlunos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [rascunho, setRascunho] = useState(NOTA_VAZIA);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const [respostaAlunos, respostaNotas] = await Promise.all([
        fetch("/api/cadaaluno"),
        fetch("/api/alunos"),
      ]);
      const [dadosAlunos, dadosNotas] = await Promise.all([
        respostaAlunos.json(),
        respostaNotas.json(),
      ]);

      if (!respostaAlunos.ok) {
        throw new Error(dadosAlunos.error || "Não foi possível carregar os alunos.");
      }
      if (!respostaNotas.ok) {
        throw new Error(dadosNotas.error || "Não foi possível carregar as notas.");
      }

      setAlunos(dadosAlunos.alunos);
      setNotas(dadosNotas.notas);
      setErro("");
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      try {
        const [respostaAlunos, respostaNotas] = await Promise.all([
          fetch("/api/cadaaluno"),
          fetch("/api/alunos"),
        ]);
        const [dadosAlunos, dadosNotas] = await Promise.all([
          respostaAlunos.json(),
          respostaNotas.json(),
        ]);

        if (!respostaAlunos.ok) {
          throw new Error(dadosAlunos.error || "Não foi possível carregar os alunos.");
        }
        if (!respostaNotas.ok) {
          throw new Error(dadosNotas.error || "Não foi possível carregar as notas.");
        }

        if (ativo) {
          setAlunos(dadosAlunos.alunos);
          setNotas(dadosNotas.notas);
          setErro("");
        }
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar os dados.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarInicial();
    return () => {
      ativo = false;
    };
  }, []);

  function atualizarCampo(campo, valor) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");

    const dados = {
      id_aluno: Number(rascunho.id_aluno),
      t1: Number(rascunho.t1),
      t2: Number(rascunho.t2),
      t3: Number(rascunho.t3),
      n1: Number(rascunho.n1),
      n2: Number(rascunho.n2),
      n3: Number(rascunho.n3),
    };

    try {
      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.error || "Não foi possível salvar a nota.");
      }

      setRascunho(NOTA_VAZIA);
      setMensagem("Nota salva com sucesso.");
      await carregarDados();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar a nota.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />
      <h2>Lançamento de Notas</h2>

      {erro && <p role="alert">{erro}</p>}
      {mensagem && <p role="status">{mensagem}</p>}

      {alunos.length === 0 && !carregando && !erro && (
        <p role="status">Cadastre um aluno antes de lançar notas.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id_aluno">Aluno</label>
          <select
            id="id_aluno"
            name="id_aluno"
            value={rascunho.id_aluno}
            onChange={(event) => atualizarCampo("id_aluno", event.target.value)}
            required
            disabled={carregando || alunos.length === 0 || salvando}
          >
            <option value="" disabled>Selecione um aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.id_aluno} value={aluno.id_aluno}>
                {aluno.nome} — RA {aluno.ra}
              </option>
            ))}
          </select>
        </div>

        {CAMPOS_NOTA.map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              name={id}
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={rascunho[id]}
              onChange={(event) => atualizarCampo(id, event.target.value)}
              placeholder={id.toUpperCase()}
              required
              disabled={salvando}
            />
          </div>
        ))}

        <button type="submit" disabled={salvando || carregando || alunos.length === 0}>
          {salvando ? "Salvando…" : "Salvar Nota"}
        </button>
      </form>

      <h2>Notas Lançadas</h2>
      {carregando ? (
        <p role="status">Carregando dados…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">T1</th>
              <th scope="col">T2</th>
              <th scope="col">T3</th>
              <th scope="col">N1</th>
              <th scope="col">N2</th>
              <th scope="col">N3</th>
            </tr>
          </thead>
          <tbody>
            {notas.length > 0 ? notas.map((nota) => (
              <tr key={nota.id}>
                <td>{nota.id}</td>
                <td>{nota.nome}</td>
                <td>{nota.t1}</td>
                <td>{nota.t2}</td>
                <td>{nota.t3}</td>
                <td>{nota.n1}</td>
                <td>{nota.n2}</td>
                <td>{nota.n3}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8}>
                  {erro ? "Não foi possível carregar as notas." : "Nenhuma nota lançada."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
