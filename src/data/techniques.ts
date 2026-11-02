export type TechniqueStep = {
  id: string;
  number: string;
  title: string;
  copy: string;
  src: string;
  alt: string;
};

export const techniqueSteps: TechniqueStep[] = [
  {
    id: "stance",
    number: "01",
    title: "Stance",
    copy: "Weight sits centered. Both fists guard the chin, the lead foot is light, and the eyes stay on the target.",
    src: "/images/character/fighter-idle.jpg",
    alt: "Fighting stance",
  },
  {
    id: "pivot",
    number: "02",
    title: "Pivot",
    copy: "The supporting foot turns out, about halfway around, so the hip is free to open toward the kick.",
    src: "/images/character/fighter-pivot.jpg",
    alt: "Pivot on the supporting foot",
  },
  {
    id: "rotation",
    number: "03",
    title: "Rotation",
    copy: "The hip and shoulder turn together. The kick is driven by the body, not by swinging the leg alone.",
    src: "/images/character/fighter-pivot.jpg",
    alt: "Hip rotation into the kick",
  },
  {
    id: "chamber",
    number: "04",
    title: "Chamber",
    copy: "The knee lifts sideways and points at the target. The lower leg stays folded and the toes pull back.",
    src: "/images/character/fighter-chamber.jpg",
    alt: "Knee chambered for a roundhouse",
  },
  {
    id: "strike",
    number: "05",
    title: "Strike",
    copy: "The shin snaps through. The top of the foot meets the target at full extension.",
    src: "/images/character/fighter-extend.jpg",
    alt: "Roundhouse at full extension",
  },
  {
    id: "recovery",
    number: "06",
    title: "Recovery",
    copy: "The leg folds back down the same path and the guard returns before the opponent can catch the kick.",
    src: "/images/character/fighter-recovery.jpg",
    alt: "Recovering the kicking leg",
  },
];

export const specialMoves = [
  {
    id: "roundhouse",
    name: "Roundhouse Kick",
    copy: "A full illustrated sequence: stance, pivot, chamber, strike, and recovery.",
    src: "/images/character/fighter-impact.png",
    alt: "Cinematic roundhouse impact",
    sequenced: true,
  },
  {
    id: "spin",
    name: "Spinning Back Kick",
    copy: "A single illustration of the turn and heel strike. This move does not have a frame sequence yet.",
    src: "/images/character/fighter-spin.jpg",
    alt: "Spinning back kick illustration",
    sequenced: false,
  },
  {
    id: "flying",
    name: "Flying Kick",
    copy: "A single airborne illustration. A frame-by-frame jump is not implemented yet.",
    src: "/images/character/fighter-jump.jpg",
    alt: "Jumping kick illustration",
    sequenced: false,
  },
];
