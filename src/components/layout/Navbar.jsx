export default function Navbar() {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="brand-mark">KSJ</span>
        <span className="brand-text">Digital</span>
      </div>

      <div className="nav-links">
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#systems">Systems</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
