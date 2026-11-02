import { useState } from "react";
import { Link } from "react-router-dom";
import { CharacterAnimation } from "@/components/strike/CharacterAnimation";
import { KeyedArtwork } from "@/components/strike/KeyedArtwork";
import { galleryArt, heroArt, moveArt } from "@/data/characterAssets";
import { specialMoves, techniqueSteps } from "@/data/techniques";
import "@/styles/cinematic.css";

const particles = [
  { left: "8%", top: "18%", delay: "0s" },
  { left: "22%", top: "70%", delay: "1.2s" },
  { left: "70%", top: "16%", delay: "0.4s" },
  { left: "84%", top: "62%", delay: "2s" },
  { left: "48%", top: "30%", delay: "1.6s" },
];

const Strike = () => {
  const [step, setStep] = useState(techniqueSteps[0].id);
  const [preview, setPreview] = useState<string | null>(null);
  const active = techniqueSteps.find((item) => item.id === step) ?? techniqueSteps[0];
  const galleryItem = galleryArt.find((item) => item.src === preview);

  return (
    <div className="strike-page min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-sm font-black tracking-[0.35em]">STRIKE</p>
        <nav className="flex gap-5 text-sm text-slate-300">
          <a href="#kick" className="hover:text-white">Move</a>
          <a href="#technique" className="hover:text-white">Technique</a>
          <a href="#gallery" className="hover:text-white">Gallery</a>
          <Link to="/board" className="hover:text-white">Scoreboard</Link>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center gap-8 px-6 pb-16 lg:grid-cols-2">
        {particles.map((dot) => (
          <span key={dot.left} className="particle" style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }} />
        ))}
        <div className="hero-rise relative z-10">
          <p className="text-xs tracking-[0.5em] text-sky-300">ANIME COMBAT</p>
          <h1 className="mt-4 text-5xl font-black italic leading-[0.95] md:text-7xl">
            MASTER THE PERFECT STRIKE.
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-300">
            Precision. Power. Motion. Experience the art of the roundhouse kick.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#kick" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-sky-400">
              WATCH THE MOVE
            </a>
            <a href="#technique" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold hover:bg-white/10">
              EXPLORE TECHNIQUE
            </a>
          </div>
        </div>
        <div className="hero-rise relative">
          <div className="energy-arc right-[8%] top-[8%] h-64 w-64 opacity-80 md:h-96 md:w-96" />
          <KeyedArtwork
            src={heroArt.src}
            alt={heroArt.alt}
            className="relative z-10 mx-auto max-h-[78vh] w-full object-contain"
          />
        </div>
      </section>

      <CharacterAnimation />

      <section id="technique" className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs tracking-[0.45em] text-sky-300">BREAKDOWN</p>
        <h2 className="mt-2 text-4xl font-black italic">Six beats</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techniqueSteps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                item.id === active.id ? "border-sky-400 bg-sky-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <KeyedArtwork src={item.src} alt={item.alt} className="h-64 w-full object-contain" />
              <p className="mt-3 text-xs tracking-[0.3em] text-sky-300">{item.number}</p>
              <p className="text-lg font-bold">{item.title}</p>
            </button>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-slate-300">{active.copy}</p>
      </section>

      <section id="gallery" className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs tracking-[0.45em] text-sky-300">GALLERY</p>
        <h2 className="mt-2 text-4xl font-black italic">Same fighter</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryArt.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPreview(item.src)}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-left hover:border-sky-400/50"
            >
              <KeyedArtwork src={item.src} alt={item.alt} className="h-80 w-full object-contain" />
              <p className="px-4 py-3 font-semibold">{item.title}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs tracking-[0.45em] text-sky-300">SIGNATURE</p>
        <h2 className="mt-2 text-4xl font-black italic">Special moves</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {specialMoves.map((move) => (
            <article key={move.id} className="rounded-3xl border border-white/10 bg-gradient-to-b from-sky-500/10 to-transparent p-4">
              <KeyedArtwork src={move.src} alt={move.alt} className="h-80 w-full object-contain" />
              <h3 className="mt-3 text-2xl font-black italic">{move.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{move.copy}</p>
              {move.sequenced ? (
                <a href="#kick" className="mt-4 inline-block text-sm font-bold text-sky-300">Replay sequence</a>
              ) : (
                <p className="mt-4 text-xs tracking-[0.2em] text-slate-500">STILL PREVIEW</p>
              )}
            </article>
          ))}
        </div>
        <img src={moveArt.roundhouse} alt="" className="hidden" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 pb-24">
        <p className="text-xs tracking-[0.45em] text-sky-300">ENGINE</p>
        <h2 className="mt-2 text-4xl font-black italic">How it is built</h2>
        <ul className="mt-6 grid gap-3 text-slate-300 md:grid-cols-2">
          <li className="rounded-2xl border border-white/10 p-4">Frame-by-frame art, timed with requestAnimationFrame so the loop does not drift.</li>
          <li className="rounded-2xl border border-white/10 p-4">Energy arcs and the impact flash sit on their own layer, not inside the character frames.</li>
          <li className="rounded-2xl border border-white/10 p-4">Near-black backgrounds are removed so each figure composites on the page.</li>
          <li className="rounded-2xl border border-white/10 p-4">Playback pauses off-screen and when reduced motion is requested.</li>
        </ul>
        <p className="mt-6 text-sm text-slate-500">
          Dev: npm run dev. Production: npm run build, then npm run preview. Replace files in public/images/character using the names in src/data/characterAssets.ts. Spinning back kick and flying kick still need their own frame sets.
        </p>
      </section>

      {galleryItem && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setPreview(null)}
        >
          <KeyedArtwork src={galleryItem.src} alt={galleryItem.alt} className="max-h-[88vh] max-w-full object-contain" />
        </button>
      )}
    </div>
  );
};

export default Strike;
