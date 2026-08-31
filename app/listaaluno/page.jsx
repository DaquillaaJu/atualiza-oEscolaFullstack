import Link from "next/link";
import Header from "../components/header";

export default function ListaAluno() {
  return (
    <>
      <Header />
      <main className="page-shell compact-shell">
        <section className="content-panel">
          <h2>Lista de Alunos</h2>
          <p>
            Aqui será exibida a relação completa dos alunos cadastrados, com acesso a
            informações gerais e filtros por turma, nome ou situação acadêmica.
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
