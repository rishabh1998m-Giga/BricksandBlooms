import Image from "next/image";

const LINKS = ["Work", "Studio", "Services", "Contact"];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
      <a href="#" className="flex items-center gap-3">
        <Image
          src="/assets/brand/logo.png"
          alt="Brick & Blooms"
          width={189}
          height={107}
          className="h-11 w-auto md:h-14"
          priority
        />
      </a>
      <ul className="hidden items-center gap-8 font-display text-[0.7rem] tracking-[0.14em] text-fg/80 uppercase md:flex">
        {LINKS.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-terracotta"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
