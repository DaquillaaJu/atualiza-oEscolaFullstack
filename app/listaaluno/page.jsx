'use client';
import { useEffect, useState } from "react";
import Header from "../components/header";

const EMPTY_DRAFT = { nome: "", idade: "", serie: "", ra: "" };

async function buscarAlunos() {
  const resposta = await fetch("/api/cadaaluno");
  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.error || "Não foi possível carregar os alunos.");
  }

  return resultado.alunos;
}

export default function ListaAluno() {
  const [alunos, setAlunos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [rascunho, setRascunho] = useState(EMPTY_DRAFT);
  const [ocupado, setOcupado] = useState(false);
  const termoBusca = pesquisa.trim();
  const pesquisaAtiva = termoBusca.length >= 3;
  const nomePesquisado = termoBusca
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
  const alunosFiltrados = pesquisaAtiva
    ? alunos.filter((aluno) =>
        aluno.nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("pt-BR")
          .includes(nomePesquisado)
      )
    : alunos;

  useEffect(() => {
    let ativo = true;

    async function carregarAlunos() {
      try {
        const lista = await buscarAlunos();
        if (ativo) {
          setErro("");
          setAlunos(lista);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Não foi possível carregar os alunos.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAlunos();
    return () => {
      ativo = false;
    };
  }, []);

  function iniciarEdicao(aluno) {
    setMensagem("");
    setErro("");
    setEditandoId(aluno.id_aluno);
    setRascunho({
      nome: aluno.nome,
      idade: String(aluno.idade),
      serie: aluno.serie,
      ra: aluno.ra,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setRascunho(EMPTY_DRAFT);
  }

  function atualizarRascunho(campo, valor) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarEdicao(idAluno) {
    setOcupado(true);
    setErro("");
    setMensagem("");

    const dadosAluno = {
      id_aluno: idAluno,
      nome: rascunho.nome.trim(),
      idade: Number(rascunho.idade),
      serie: rascunho.serie.trim(),
      ra: rascunho.ra.trim(),
    };

    try {
      const resposta = await fetch("/api/cadaaluno", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAluno),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.error || "Não foi possível salvar as alterações.");
      }

      setAlunos((atuais) =>
        atuais.map((aluno) =>
          aluno.id_aluno === idAluno ? { ...aluno, ...dadosAluno } : aluno
        )
      );
      setMensagem("Cadastro atualizado com sucesso.");
      cancelarEdicao();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar as alterações.");
    } finally {
      setOcupado(false);
    }
  }

  async function excluirAluno(aluno) {
    const idAluno = aluno.id_aluno;
    console.debug("[lista-alunos] Iniciando exclusão.", { id_aluno: idAluno });
    setOcupado(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(`/api/cadaaluno?id=${idAluno}`, {
        method: "DELETE",
      });
      const resultado = await resposta.json();

      console.debug("[lista-alunos] Resposta da exclusão.", {
        id_aluno: idAluno,
        status: resposta.status,
        ok: resposta.ok,
      });

      if (!resposta.ok) {
        throw new Error(resultado.error || "Não foi possível excluir o aluno.");
      }

      setAlunos((atuais) => atuais.filter((item) => item.id_aluno !== idAluno));
      if (editandoId === idAluno) cancelarEdicao();
      setMensagem(`Cadastro de ${aluno.nome} excluído.`);
      console.info("[lista-alunos] Exclusão concluída.", { id_aluno: idAluno });
    } catch (error) {
      console.error("[lista-alunos] Falha ao excluir aluno.", {
        id_aluno: idAluno,
        erro: error.message,
        error,
      });
      setErro(error.message || "Não foi possível excluir o aluno.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <Header />
      <h2>Lista de alunos</h2>

      {erro && <p className="student-list-feedback" role="alert">{erro}</p>}
      {mensagem && <p className="student-list-feedback" role="status">{mensagem}</p>}

      <div className="student-search-row">
        <div className="student-search-field">
          <label htmlFor="pesquisa-aluno">Pesquisar por nome</label>
          <input
            id="pesquisa-aluno"
            type="search"
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
            placeholder="Digite pelo menos 3 letras"
            aria-describedby="pesquisa-aluno-ajuda"
          />
          <span id="pesquisa-aluno-ajuda" className="student-search-help">
            A busca começa a partir do terceiro caractere.
          </span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col">Série</th>
            <th scope="col">RA</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>

        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={6} className="student-list-state">Carregando alunos…</td>
            </tr>
          ) : alunos.length === 0 ? (
            <tr>
              <td colSpan={6} className="student-list-state">Nenhum aluno cadastrado.</td>
            </tr>
          ) : pesquisaAtiva && alunosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} className="student-list-state">
                Nenhum aluno encontrado para “{termoBusca}”.
              </td>
            </tr>
          ) : (
            alunosFiltrados.map((aluno) => {
              const estaEditando = editandoId === aluno.id_aluno;

              return (
                <tr key={aluno.id_aluno}>
                  <td>{aluno.id_aluno}</td>
                  <td>
                    {estaEditando ? (
                      <input
                        type="text"
                        aria-label={`Nome do aluno ${aluno.nome}`}
                        value={rascunho.nome}
                        onChange={(event) => atualizarRascunho("nome", event.target.value)}
                        required
                      />
                    ) : aluno.nome}
                  </td>
                  <td>
                    {estaEditando ? (
                      <input
                        type="number"
                        aria-label={`Idade de ${aluno.nome}`}
                        min="1"
                        max="120"
                        value={rascunho.idade}
                        onChange={(event) => atualizarRascunho("idade", event.target.value)}
                        required
                      />
                    ) : aluno.idade}
                  </td>
                  <td>
                    {estaEditando ? (
                      <input
                        type="text"
                        aria-label={`Série de ${aluno.nome}`}
                        value={rascunho.serie}
                        onChange={(event) => atualizarRascunho("serie", event.target.value)}
                        required
                      />
                    ) : aluno.serie}
                  </td>
                  <td>
                    {estaEditando ? (
                      <input
                        type="text"
                        aria-label={`RA de ${aluno.nome}`}
                        value={rascunho.ra}
                        onChange={(event) => atualizarRascunho("ra", event.target.value)}
                        required
                      />
                    ) : aluno.ra}
                  </td>
                  <td className="student-actions-cell">
                    <div className="student-action-buttons">
                      {estaEditando ? (
                        <>
                          <button
                            type="button"
                            className="student-action-button student-edit-action"
                            onClick={() => salvarEdicao(aluno.id_aluno)}
                            disabled={ocupado}
                            aria-label={`Salvar alterações de ${aluno.nome}`}
                          >
                            {ocupado ? "Salvando…" : "Salvar"}
                          </button>
                          <button
                            type="button"
                            className="student-action-button student-cancel-action"
                            onClick={cancelarEdicao}
                            disabled={ocupado}
                            aria-label={`Cancelar edição de ${aluno.nome}`}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="student-action-button student-edit-action"
                            onClick={() => iniciarEdicao(aluno)}
                            disabled={ocupado}
                            aria-label={`Alterar ${aluno.nome}`}
                          >
                            Alterar
                          </button>
                          <button
                            type="button"
                            className="student-action-button student-delete-action"
                            onClick={() => excluirAluno(aluno)}
                            disabled={ocupado}
                            aria-label={`Excluir ${aluno.nome}`}
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}
