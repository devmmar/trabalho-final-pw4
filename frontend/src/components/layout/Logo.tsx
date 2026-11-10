export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="text-[0.95rem] font-normal uppercase tracking-[0.32em]">
        Ventana
      </span>
    </span>
  );
}
