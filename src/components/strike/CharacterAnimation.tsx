import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { kickFrames } from "@/data/characterAssets";
import { KeyedArtwork, useKeyedArtwork } from "@/components/strike/KeyedArtwork";

const total = kickFrames.reduce((sum, frame) => sum + frame.hold, 0);

function frameAt(elapsed: number) {
  const time = elapsed % total;
  let cursor = 0;
  for (let i = 0; i < kickFrames.length; i += 1) {
    cursor += kickFrames[i].hold;
    if (time < cursor) return i;
  }
  return 0;
}

export function CharacterAnimation() {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const elapsed = useRef(0);
  const last = useRef<number | null>(null);
  const reduced = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setPlaying(false);
    kickFrames.forEach((frame) => {
      const image = new Image();
      image.src = frame.src;
    });
  }, []);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      if (playing && visible.current && !reduced.current) {
        if (last.current != null) elapsed.current += now - last.current;
        last.current = now;
        const next = frameAt(elapsed.current);
        setIndex((current) => (current === next ? current : next));
      } else {
        last.current = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    if (kickFrames[index].energy < 0.9) return;
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [index]);

  const current = kickFrames[index];
  const art = useKeyedArtwork(current.src);

  const replay = () => {
    elapsed.current = 0;
    last.current = null;
    setIndex(0);
    setPlaying(true);
  };

  return (
    <section id="kick" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.45em] text-sky-300">SEQUENCE</p>
          <h2 className="mt-2 text-4xl font-black italic md:text-5xl">The roundhouse</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/25"
          >
            <RotateCcw className="h-4 w-4" />
            Replay
          </button>
        </div>
      </div>

      <div
        ref={stage}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_60%_40%,rgba(37,99,235,0.35),#070b14_62%)]"
      >
        <div
          className="energy-arc left-[18%] top-[12%] h-72 w-72 md:h-[28rem] md:w-[28rem]"
          style={{ opacity: current.energy }}
        />
        <div
          className="energy-arc left-[28%] top-[22%] h-48 w-48 md:h-80 md:w-80"
          style={{ opacity: current.energy * 0.7, animationDuration: "1.8s" }}
        />
        {flash && <div className="impact-flash" />}
        <img
          src={art}
          alt="Anime fighter performing the current frame of a roundhouse kick"
          className="relative z-10 mx-auto h-[70vh] max-h-[760px] w-full object-contain"
        />
        <p className="absolute bottom-4 left-5 text-xs tracking-[0.35em] text-white/70">
          FRAME {String(index + 1).padStart(2, "0")} / {String(kickFrames.length).padStart(2, "0")}
        </p>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-slate-400">
        Six illustrated frames play in order, then the loop returns to the stance. Blue arcs and the impact flash are drawn on a separate layer. Spinning and flying kicks later on this page are stills only.
      </p>
      <KeyedArtwork src={kickFrames[0].src} alt="" className="hidden" />
    </section>
  );
}
