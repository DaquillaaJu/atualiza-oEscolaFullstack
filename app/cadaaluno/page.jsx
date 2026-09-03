'use client';

import { useState } from "react";
import Header from "../components/header";

const initialStudents = [
  {
    id: 1,
    nome: "Ana Clara Souza",
    idade: "14",
    serie: "9º ano",
    ra: "2026-0148",
  },
  {
    id: 2,
    nome: "Miguel Oliveira",
    idade: "13",
    serie: "8º ano",
    ra: "2026-0182",
  },
  {
    id: 3,
    nome: "Lívia Martins",
    idade: "15",
    serie: "1º EM",
    ra: "2026-0225",
  },
];

const emptyForm = {
  nome: "",
  idade: "",
  serie: "",
  ra: "",
};

export default function CadaAluno() {
  const [formData, setFormData] = useState(emptyForm);
  const [students, setStudents] = useState(initialStudents);
  const [formError, setFormError] = useState("");
  const [formStatus, setFormStatus] = useState("");

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }

    if (formStatus) {
      setFormStatus("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nome = formData.nome.trim();
    const idade = Number(formData.idade);
    const serie = formData.serie.trim();
    const ra = formData.ra.trim();

    if (!nome || !formData.idade || !serie || !ra) {
      setFormStatus("");
      setFormError("Preencha nome, idade, série e RA para cadastrar o aluno.");
      return;
    }

    if (!Number.isInteger(idade) || idade < 3 || idade > 25) {
      setFormStatus("");
      setFormError("Informe uma idade válida entre 3 e 25 anos.");
      return;
    }

    setStudents((current) => [
      {
        id: Date.now(),
        nome,
        idade: String(idade),
        serie,
        ra,
      },
      ...current,
    ]);
    setFormData(emptyForm);
    setFormError("");
    setFormStatus("Aluno cadastrado com sucesso.");
  }

  function handleStudentChange(studentId, field, value) {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, [field]: value } : student,
      ),
    );
  }

  return (
    <>
      <Header />

      <main className="students-page">
        <div className="students-frame">
          <div className="students-corner students-corner-top" aria-hidden="true" />
          <div className="students-corner students-corner-bottom" aria-hidden="true" />

          <header className="students-masthead">
            <span className="students-eyebrow">registro escolar · turma 2026</span>
            <h1>Cadastro de alunos</h1>
            <p>
              Organize os dados da turma com o mesmo cuidado de uma página do nosso
              caderno escolar.
            </p>
          </header>

          <div className="students-content">
            <section className="student-form-panel" aria-labelledby="new-student-title">
              <div className="students-section-kicker">
                <span>01</span>
                <span>novo registro</span>
              </div>
              <h2 id="new-student-title">Adicionar estudante</h2>
              <p className="student-form-intro">
                Preencha os campos abaixo para incluir uma nova pessoa na lista.
              </p>

              <form className="student-form" onSubmit={handleSubmit} noValidate>
                <div className="student-fields">
                  <div className="student-field student-field-wide">
                    <label htmlFor="nome">Nome completo</label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={handleFieldChange}
                      placeholder="Ex.: Helena da Silva"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="idade">Idade</label>
                    <input
                      id="idade"
                      name="idade"
                      type="number"
                      min="3"
                      max="25"
                      value={formData.idade}
                      onChange={handleFieldChange}
                      placeholder="14"
                      required
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="serie">Série</label>
                    <input
                      id="serie"
                      name="serie"
                      type="text"
                      value={formData.serie}
                      onChange={handleFieldChange}
                      placeholder="Ex.: 9º ano"
                      required
                    />
                  </div>

                  <div className="student-field">
                    <label htmlFor="ra">RA</label>
                    <input
                      id="ra"
                      name="ra"
                      type="text"
                      value={formData.ra}
                      onChange={handleFieldChange}
                      placeholder="2026-0000"
                      required
                    />
                  </div>
                </div>

                <div className="student-form-actions">
                  <p className="student-form-note">Todos os campos são obrigatórios.</p>
                  <button type="submit" className="student-submit-button">
                    cadastrar aluno <span aria-hidden="true">→</span>
                  </button>
                </div>

                {formError ? (
                  <p className="form-feedback form-feedback-error" role="alert">
                    {formError}
                  </p>
                ) : null}

                {formStatus ? (
                  <p className="form-feedback form-feedback-success" role="status" aria-live="polite">
                    {formStatus}
                  </p>
                ) : null}
              </form>
            </section>

            <aside className="students-note" aria-label="Nota sobre o cadastro">
              <span className="students-note-mark" aria-hidden="true">✽</span>
              <span className="students-note-label">caderno de chamada</span>
              <p>
                Um registro simples para acompanhar quem faz parte da nossa turma e
                manter cada história no lugar certo.
              </p>
              <div className="students-note-line" aria-hidden="true" />
              <span className="students-note-signature">com cuidado, SESI</span>
            </aside>
          </div>

          <section className="students-list-section" aria-labelledby="students-list-title">
            <div className="students-list-heading">
              <div>
                <div className="students-section-kicker">
                  <span>02</span>
                  <span>arquivo vivo</span>
                </div>
                <h2 id="students-list-title">Alunos cadastrados</h2>
                <p className="students-list-help">
                  Edite os dados diretamente na tabela sempre que precisar atualizar a turma.
                </p>
              </div>
              <span className="student-count" aria-label={`${students.length} alunos cadastrados`}>
                {students.length} {students.length === 1 ? "aluno" : "alunos"}
              </span>
            </div>

            {students.length ? (
              <div className="students-table-wrap">
                <table className="students-table">
                  <caption className="sr-only">Lista editável de alunos</caption>
                  <thead>
                    <tr>
                      <th scope="col">Nome</th>
                      <th scope="col">Idade</th>
                      <th scope="col">Série</th>
                      <th scope="col">RA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td data-label="Nome">
                          <label className="sr-only" htmlFor={`student-${student.id}-nome`}>
                            Nome do aluno
                          </label>
                          <input
                            id={`student-${student.id}-nome`}
                            type="text"
                            value={student.nome}
                            aria-label={`Nome do aluno ${student.nome}`}
                            onChange={(event) =>
                              handleStudentChange(student.id, "nome", event.target.value)
                            }
                          />
                        </td>
                        <td data-label="Idade">
                          <label className="sr-only" htmlFor={`student-${student.id}-idade`}>
                            Idade de {student.nome}
                          </label>
                          <input
                            id={`student-${student.id}-idade`}
                            type="number"
                            min="3"
                            max="25"
                            value={student.idade}
                            aria-label={`Idade de ${student.nome}`}
                            onChange={(event) =>
                              handleStudentChange(student.id, "idade", event.target.value)
                            }
                          />
                        </td>
                        <td data-label="Série">
                          <label className="sr-only" htmlFor={`student-${student.id}-serie`}>
                            Série de {student.nome}
                          </label>
                          <input
                            id={`student-${student.id}-serie`}
                            type="text"
                            value={student.serie}
                            aria-label={`Série de ${student.nome}`}
                            onChange={(event) =>
                              handleStudentChange(student.id, "serie", event.target.value)
                            }
                          />
                        </td>
                        <td data-label="RA">
                          <label className="sr-only" htmlFor={`student-${student.id}-ra`}>
                            RA de {student.nome}
                          </label>
                          <input
                            id={`student-${student.id}-ra`}
                            type="text"
                            value={student.ra}
                            aria-label={`RA de ${student.nome}`}
                            onChange={(event) =>
                              handleStudentChange(student.id, "ra", event.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="students-empty-state">Nenhum aluno cadastrado ainda.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
