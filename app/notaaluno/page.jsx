import Link from "next/link";
import Header from "../components/header";

export default function NotaAluno() {
  return (
    <>
      <Header />
      <main className="page-shell compact-shell">
        <section className="content-panel">
          <h2>Cadastro de Notas</h2>
          <p>
            Nesta tela, o professor poderá registrar avaliações, notas por disciplina e
            acompanhar o desempenho individual de cada aluno ao longo do período.
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
