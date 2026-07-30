import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";

/**
 * RotatingAnnouncementsSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Para añadir un nuevo anuncio/cartel: añade un objeto al array `ANNOUNCEMENTS`
 * con los campos `id`, `image`, `alt`, `label` y, opcionalmente, `href`.
 * Las imágenes van en /public/assets/ y se referencian con la ruta /assets/…
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface Announcement {
  id: number;
  image: string;
  alt: string;
  label: string;     // texto de la etiqueta de categoría (Nàutica, Cultura, etc.)
  href?: string;     // enlace opcional al hacer clic en el cartel
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    image: "/assets/anuncio-curs-navegacio.png",
    alt: "Curs de Llicència de Navegació – Port de Portbou, 7 d'Agost",
    label: "Nàutica",
    href: undefined,
  },
  {
    id: 2,
    image: "/assets/anuncio-triangle-portbouenc.png",
    alt: "El Triangle Portbouenc – Activitat cultural, Juliol–Setembre",
    label: "Cultura",
    href: undefined,
  },
];

const AUTO_PLAY_INTERVAL = 5000; // ms

export default function RotatingAnnouncementsSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = ANNOUNCEMENTS.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next, total]);

  if (total === 0) return null;

  const ann = ANNOUNCEMENTS[current];

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Cabecera */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Megaphone className="w-5 h-5 text-indigo-500" />
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest">
            Novedades &amp; Anuncios
          </p>
        </div>

        {/* Carrusel */}
        <div
          className="relative select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tarjeta principal */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">

            {/* Etiqueta de categoría */}
            <span className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {ann.label}
            </span>

            {/* Imagen */}
            {ann.href ? (
              <a href={ann.href} target="_blank" rel="noopener noreferrer">
                <img
                  src={ann.image}
                  alt={ann.alt}
                  className="w-full object-contain max-h-[520px] bg-white"
                  draggable={false}
                />
              </a>
            ) : (
              <img
                src={ann.image}
                alt={ann.alt}
                className="w-full object-contain max-h-[520px] bg-white"
                draggable={false}
              />
            )}
          </div>

          {/* Botón anterior */}
          {total > 1 && (
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Botón siguiente */}
          {total > 1 && (
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 transition-all hover:scale-110 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Puntos de navegación */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir al anuncio ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-indigo-600 w-6 h-2.5"
                    : "bg-indigo-200 hover:bg-indigo-400 w-2.5 h-2.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        <p className="text-center text-gray-400 text-xs mt-3">
          {current + 1} / {total}
        </p>

      </div>
    </section>
  );
}
