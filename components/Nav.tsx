import Image from "next/image";

const LINKS = ["Work", "Studio", "Services", "Contact"];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 py-4 md:px-6 md:py-6">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-fg/10 bg-bg/70 px-5 py-3 backdrop-blur-md md:px-7">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/assets/brand/logo.png"
            alt="Brick & Blooms"
            width={189}
            height={107}
            className="h-9 w-auto md:h-11"
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
      </div>
    </nav>
  );
}
