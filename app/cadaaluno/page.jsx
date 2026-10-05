"use client";

import { useState } from "react";
import Header from "../components/header";

export default function CadaAluno() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [serie, setSerie] = useState("");
  const [ra, setRa] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem("");
    setErro(false);
    setSalvando(true);

    try {
      const resposta = await fetch("/api/cadaaluno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, idade, serie, ra }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.error || "Não foi possível salvar o aluno.");
      }

      setMensagem(`Aluno ${nome} cadastrado com sucesso!`);
      setNome("");
      setIdade("");
      setEmail("");
      setSerie("");
      setRa("");
    } catch (error) {
      setMensagem(error.message || "Não foi possível salvar o aluno.");
      setErro(true);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />
      <main className="students-page">
        <div className="students-frame">
          <span className="students-corner students-corner-top" aria-hidden="true" />
          <span className="students-corner students-corner-bottom" aria-hidden="true" />

          <header className="students-masthead">
            <span className="students-eyebrow">Secretaria escolar</span>
            <h1>Cadastro de Alunos</h1>
            <p>Preencha os dados abaixo para realizar o cadastro.</p>
          </header>

          <section className="students-content students-content-form-only" aria-labelledby="student-form-title">
            <div className="student-form-panel">
              <div className="students-section-kicker">
                <span aria-hidden="true">01</span>
                Dados do aluno
              </div>
              <h2 id="student-form-title">Novo cadastro</h2>
              <p className="student-form-intro">
                Informe os dados do estudante para adicioná-lo ao registro escolar.
              </p>

              <form onSubmit={handleSubmit} className="student-form" aria-busy={salvando}>
                <div className="student-fields">
                  <div className="student-field student-field-wide">
                    <label htmlFor="nome">Nome completo</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      autoComplete="name"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      placeholder="Nome do aluno"
                      required
                      disabled={salvando}
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="idade">Idade</label>
                    <input
                      type="number"
                      id="idade"
                      name="idade"
                      min="1"
                      max="120"
                      value={idade}
                      onChange={(event) => setIdade(event.target.value)}
                      placeholder="Ex.: 12"
                      required
                      disabled={salvando}
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="aluno@escola.com"
                      required
                      disabled={salvando}
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="serie">Série</label>
                    <input
                      type="text"
                      id="serie"
                      name="serie"
                      value={serie}
                      onChange={(event) => setSerie(event.target.value)}
                      placeholder="Ex.: 3A"
                      required
                      disabled={salvando}
                    />
                  </div>

                  <div className="student-field student-field-wide">
                    <label htmlFor="ra">Registro do aluno (RA)</label>
                    <input
                      type="text"
                      id="ra"
                      name="ra"
                      value={ra}
                      onChange={(event) => setRa(event.target.value)}
                      placeholder="Informe o RA"
                      required
                      disabled={salvando}
                    />
                  </div>
                </div>

                <div className="student-form-actions">
                  <p className="student-form-note">Os campos marcados são obrigatórios.</p>
                  <button type="submit" className="student-submit-button" disabled={salvando}>
                    {salvando ? "Salvando…" : "Salvar dados"}
                  </button>
                </div>

                {mensagem && (
                  <p
                    className={`form-feedback ${erro ? "form-feedback-error" : "form-feedback-success"}`}
                    role={erro ? "alert" : "status"}
                  >
                    {mensagem}
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
