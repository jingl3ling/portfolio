export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-[2px]">
      <nav className="wrap flex items-center justify-between py-5">
        <a href="#top" className="font-display text-xl tracking-tight">
          Jing Huang
        </a>
        <div className="hidden gap-8 text-sm sm:flex">
          <a href="#about" className="transition-colors hover:text-accent">
            About
          </a>
          <a href="#work" className="transition-colors hover:text-accent">
            Work
          </a>
          <a href="#contact" className="transition-colors hover:text-accent">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
