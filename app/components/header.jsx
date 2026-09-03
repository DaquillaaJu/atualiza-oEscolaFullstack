import Link from "next/link";

export default function Header() {
  const links = [
    { href: "/", label: "início" },
    { href: "/principal", label: "sobre" },
    { href: "/cadaaluno", label: "alunos" },
    { href: "/listaaluno", label: "frequência /lista de alunos" },
    { href: "/listanota", label: "notas" },
  ];

  return (
    <header className="site-topbar">
      <div className="brand-wrap">
        <div className="brand-mark">S</div>
        <span className="brand-name">SESI</span>
      </div>

      <nav className="main-nav" aria-label="Navegação principal">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="nav-link">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="user-pill">SESI</div>
    </header>
  );
}

