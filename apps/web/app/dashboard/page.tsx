import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="page" style={{ padding: "80px 32px", display: "flex", flex: 1, flexDirection: "column", gap: "24px" }}>
      <nav className="navbar" style={{ padding: "0 0 40px 0", borderBottom: "none" }}>
        <Link href="/" className="nav-brand">BHARAT<br />LENS</Link>
      </nav>
      <h1 className="section-title"><span>Dashboard</span></h1>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>This page is currently under construction. Check back later.</p>
      <Link href="/" className="btn-outline" style={{ width: "fit-content" }}>Back to Home</Link>
    </div>
  );
}