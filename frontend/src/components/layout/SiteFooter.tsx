export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 px-6 py-7">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 text-xs text-stone-500">
        <span className="font-semibold text-[#234c3d]">
          morada.{" "}
          <span className="ml-2 font-normal text-stone-500">
            Espaços para novas histórias.
          </span>
        </span>
        <span>Projeto acadêmico · PW IV · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
