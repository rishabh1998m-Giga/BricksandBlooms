import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { label: "Work", href: "#" },
  { label: "Studio", href: "#" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 py-3 md:px-6 md:py-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-fg/10 bg-bg/70 px-4 py-2 backdrop-blur-md md:px-5 md:py-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/assets/brand/logo-mark.png"
            alt=""
            width={525}
            height={485}
            className="h-8 w-auto md:h-9"
            priority
          />
          <span className="font-display text-[1rem] font-medium tracking-[0.01em] text-fg md:text-[1.15rem]">
            Brick &amp; Blooms
          </span>
        </Link>
        <ul className="hidden items-center gap-7 font-display text-[0.65rem] tracking-[0.12em] text-fg/80 uppercase md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition-colors duration-200 hover:text-terracotta"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
