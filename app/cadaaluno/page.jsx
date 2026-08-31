import Link from "next/link";
import Header from "../components/header";

export default function CadaAluno() {
  return (
    <>
      <Header />
      <main className="page-shell compact-shell">
        <section className="content-panel">
          <h2>Cadastro de Alunos</h2>
          <p>
            Esta página será usada para registrar os dados dos estudantes, como nome,
            turma, responsável e informações importantes do acompanhamento escolar.
          </p>
          <div className="action-row" style={{ marginTop: "1.5rem" }}>
            <Link href="/" className="primary-btn">
              Voltar para Início
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
