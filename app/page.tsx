import Link from "next/link";
import Header from "./components/header";

const posts = [
  {
    slug: "frequencia",
    date: "setembro 2026",
    title: "frequência escolar",
    description:
      "A frequência dos estudantes está sendo acompanhada com atenção, garantindo presença, pontualidade e participação nas atividades do período letivo.",
    href: "/listaaluno",
  },
  {
    slug: "materias",
    date: "semana letiva",
    title: "matérias em destaque",
    description:
      "As turmas seguem com foco em matemática, português, ciências, história, informática e projetos de formação profissional e cidadania.",
    href: "/notaaluno",
  },
  {
    slug: "desempenho",
    date: "avaliações",
    title: "desempenho e acompanhamento",
    description:
      "Os professores registram resultados, acompanham progresso e orientam estudantes para melhoria contínua de desempenho acadêmico e comportamental.",
    href: "/listanota",
  },
];

const sidebarItems = [
  "faltas: 2% da turma",
  "matérias: 6 disciplinas ativas",
  "presença: média 96%",
  "projeto: robótica e tecnologia",
  "apoio: orientação escolar",
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="journal-page">
        <div className="page-frame">
          <header className="masthead">
            <div className="floral floral-left" aria-hidden="true" />
            <div className="brand-script">SESI</div>
            <div className="floral floral-right" aria-hidden="true" />
          </header>

          <nav className="journal-nav" aria-label="Menu da página inicial">
            <Link href="/">início</Link>
            <Link href="/principal">sobre</Link>
            <Link href="/cadaaluno">alunos</Link>
            <Link href="/listaaluno">frequência</Link>
            <Link href="/notaaluno">matérias</Link>
            <Link href="/listanota">notas</Link>
          </nav>

          <div className="content-grid">
            <section className="posts-column">
              {posts.map((post) => (
                <article key={post.slug} className="post-card">
                  <div className={`post-visual visual-${post.slug}`} aria-hidden="true" />

                  <div className="post-copy">
                    <span className="post-date">{post.date}</span>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <Link href={post.href} className="read-more">
                      saber mais →
                    </Link>
                  </div>
                </article>
              ))}

              <div className="pagination" aria-label="Paginação">
                <span className="page active">1</span>
                <span className="page">2</span>
                <span className="page">3</span>
                <span className="page dots">...</span>
                <span className="page">7</span>
                <span className="page next">próximo</span>
              </div>
            </section>

            <aside className="sidebar">
              <div className="side-card">
                <div className="side-label">sobre</div>
                <div className="mini-portrait" aria-hidden="true" />
                <p>
                  Ambiente escolar acolhedor, organizado e focado no aprendizado,
                  desenvolvimento e bem-estar dos estudantes.
                </p>
              </div>

              <div className="side-card small-card">
                <div className="side-label">painel escolar</div>
                <ul>
                  {sidebarItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="side-card playlist-card">
                <div className="side-label">agenda</div>
                <div className="playlist-box">
                  <span className="track-title">planejamento semanal</span>
                  <span className="track-meta">5 atividades</span>
                </div>
                <div className="player-row">
                  <span>seg</span>
                  <div className="player-controls">
                    <button type="button" aria-label="Voltar" className="control-btn prev" />
                    <button type="button" aria-label="Play" className="control-btn play" />
                    <button type="button" aria-label="Avançar" className="control-btn next" />
                  </div>
                  <span>sex</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
