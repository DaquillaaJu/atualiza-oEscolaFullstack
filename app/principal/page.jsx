import Link from "next/link";
import Header from "../components/header";

export default function Principal() {
  return (
    <>
      <Header />

      <main className="page-shell compact-shell">
        <section className="hero-panel">
          <div className="hero-logo">NEXT<span>.js</span></div>

          <div className="hero-copy">
            <h1>Bem-vindo ao Sistema Escolar - SESI Mirandópolis</h1>
            <p>
              Esse painel centraliza as principais funções da escola, com acesso
              rápido aos cadastros e ao acompanhamento das notas dos alunos.
            </p>
          </div>

          <div className="action-row">
            <Link href="/cadaaluno" className="primary-btn">
              Cadastrar Aluno
            </Link>
            <Link href="/notaaluno" className="secondary-btn">
              Lançar Notas
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
