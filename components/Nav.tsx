import Image from "next/image";

const LINKS = ["Work", "Studio", "Services", "Contact"];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 py-3 md:px-6 md:py-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-fg/10 bg-bg/70 px-4 py-2 backdrop-blur-md md:px-5 md:py-2.5">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/assets/brand/logo.png"
            alt="Brick & Blooms"
            width={189}
            height={107}
            className="h-6 w-auto md:h-7"
            priority
          />
        </a>
        <ul className="hidden items-center gap-7 font-display text-[0.65rem] tracking-[0.12em] text-fg/80 uppercase md:flex">
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
