import { useEffect, useRef, useState } from "react";
import { kickFrames } from "@/data/characterAssets";
import { keyArtwork, type ArtworkTint } from "@/components/strike/KeyedArtwork";
import "@/styles/cinematic.css";

type Side = "aka" | "ao";

interface VictoryTakeoverProps {
  side: Side;
  akaScore: number;
  aoScore: number;
  onDone: () => void;
}

const impactIndex = kickFrames.findIndex((frame) => frame.src.includes("impact"));
const playFrames = kickFrames.slice(0, impactIndex + 1);
const winHolds = [220, 240, 260, 180, 520];
const total = winHolds.reduce((sum, hold) => sum + hold, 0);

function frameAt(elapsed: number) {
  const time = Math.min(elapsed, total - 1);
  let cursor = 0;
  for (let i = 0; i < winHolds.length; i += 1) {
    cursor += winHolds[i];
    if (time < cursor) return i;
  }
  return winHolds.length - 1;
}

const VictoryTakeover = ({ side, akaScore, aoScore, onDone }: VictoryTakeoverProps) => {
  const [index, setIndex] = useState(0);
  const [top, setTop] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const plates = useRef<string[]>([]);
  const indexRef = useRef(0);
  const elapsed = useRef(0);
  const last = useRef<number | null>(null);
  const isAka = side === "aka";
  const accent = isAka ? "#ef4444" : "#38bdf8";
  const lead = Math.abs(akaScore - aoScore);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(onDone, 4800);
    return () => window.clearTimeout(timer);
  }, [ready, onDone]);

  useEffect(() => {
    let cancel = false;
    const tintFor = (src: string): ArtworkTint => {
      if (!isAka) return "blue-gear";
      return src.includes("impact") ? "red-flash" : "none";
    };
    Promise.all(playFrames.map((frame) => keyArtwork(frame.src, tintFor(frame.src)))).then((keyed) => {
      if (cancel) return;
      plates.current = keyed;
      setTop(keyed[0]);
      setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, [isAka]);

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const tick = (now: number) => {
      if (last.current != null) elapsed.current += now - last.current;
      last.current = now;
      const next = frameAt(elapsed.current);
      if (next !== indexRef.current) {
        setTop(plates.current[next]);
        indexRef.current = next;
        setIndex(next);
      }
      if (elapsed.current < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    if (index !== impactIndex) return;
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 380);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden text-white"
      role="dialog"
      aria-label={`${isAka ? "Aka" : "Ao"} wins`}
      onClick={onDone}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isAka
            ? "radial-gradient(700px 480px at 28% 50%, rgba(220,38,38,0.45), transparent 60%), linear-gradient(100deg, #7f1d1d 0%, #1a0508 42%, #07070b 100%)"
            : "radial-gradient(700px 480px at 72% 50%, rgba(37,99,235,0.5), transparent 60%), linear-gradient(260deg, #1e3a8a 0%, #020617 46%, #07070b 100%)",
        }}
      />

      <div className={`relative flex h-full items-center gap-6 px-6 md:gap-10 md:px-16 ${isAka ? "" : "flex-row-reverse"}`}>
        <div className="relative flex w-[46%] shrink-0 items-center justify-center">
          <div
            className="energy-arc h-64 w-64 transition-opacity duration-200 md:h-[28rem] md:w-[28rem]"
            style={{
              opacity: playFrames[index].energy,
              borderTopColor: accent,
              boxShadow: `0 0 40px ${accent}`,
            }}
          />
          {flash && (
            <div
              className="impact-flash"
              style={{
                background: `radial-gradient(circle at 58% 42%, ${isAka ? "rgba(255,48,32,0.78)" : "rgba(56,189,248,0.7)"}, transparent 48%)`,
              }}
            />
          )}
          <div
            className="relative z-10 h-[62vh] max-h-[620px] w-full"
            style={{ transform: isAka ? undefined : "scaleX(-1)" }}
          >
            {top && (
              <img src={top} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
            )}
          </div>
        </div>

        <div className={`relative z-10 flex-1 ${isAka ? "text-left" : "text-right"}`}>
          <div className="text-sm font-bold tracking-[0.55em] text-white/75">
            {isAka ? "RED" : "BLUE"} CORNER
          </div>
          <div className="mt-2 text-7xl font-black italic leading-none md:text-9xl">
            {isAka ? "AKA" : "AO"}
          </div>
          <div
            className={`mt-3 h-2 w-28 rounded-full md:w-40 ${isAka ? "" : "ml-auto"}`}
            style={{ background: accent }}
          />
          <div className="mt-2 text-5xl font-black italic tracking-[0.18em] text-[#f5c518] md:text-7xl">
            WINS
          </div>
          <div
            className="mt-8 flex items-end gap-6"
            style={{ justifyContent: isAka ? "flex-start" : "flex-end" }}
          >
            <div>
              <div className="text-xs tracking-[0.35em] text-white/70">AKA</div>
              <div className="text-6xl font-black leading-none md:text-7xl">{akaScore}</div>
            </div>
            <div className="pb-2 text-3xl text-white/50">—</div>
            <div>
              <div className="text-xs tracking-[0.35em] text-white/70">AO</div>
              <div className="text-6xl font-black leading-none md:text-7xl">{aoScore}</div>
            </div>
          </div>
          <div className="mt-6 text-lg font-semibold tracking-[0.28em] text-white/85">
            {lead} POINT LEAD
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-xs tracking-[0.35em] text-white/55">
        TAP TO CONTINUE
      </div>
    </div>
  );
};

export default VictoryTakeover;
