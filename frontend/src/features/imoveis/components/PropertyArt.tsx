export function PropertyArt({ apartment = false }: { apartment?: boolean }) {
  return (
    <div
      className={`property-art ${apartment ? "apartment" : ""}`}
      aria-label="Ilustração de imóvel; foto não cadastrada"
      role="img"
    >
      <div className="art-sun" />
      <div className="art-ground" />
      <div className="art-building">
        <div className="art-window" />
        <div className="art-window" />
        <div className="art-window" />
        <div className="art-door" />
      </div>
      <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[.16em] text-white/85">
        Imagem ilustrativa · sem foto cadastrada
      </span>
    </div>
  );
}
