import Link from "next/link";
import Header from "../components/header";

export default function ListaNota() {
  return (
    <>
      <Header />
      <main className="page-shell compact-shell">
        <section className="content-panel">
          <h2>Lista de Notas</h2>
          <p>
            Nesta área será possível visualizar o histórico de notas por aluno, calcular
            médias e acompanhar a evolução do rendimento escolar em todas as turmas.
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
