export const scrollState = {
  y: 0,
  vh: 900,
};

export function initScrollState() {
  if (typeof window === "undefined") return;
  scrollState.vh = window.innerHeight;
  scrollState.y = window.scrollY;
}
