/**
 * Character art lives in public/images/character/.
 * Replace a file with the same name to swap a pose. Keep a dark or black
 * background; the site knocks near-black pixels out so the figure composites.
 *
 * Kick loop frames (in order): idle, pivot, chamber, extend, impact, recovery.
 * The impact plate is the supplied cinematic illustration and includes painted
 * blue energy. The other frames are clean full-body poses of the same fighter.
 * Spinning back kick and flying kick are single illustrations, not frame sequences.
 */

export type CharacterAsset = {
  id: string;
  src: string;
  title: string;
  alt: string;
};

export const kickFrames: { src: string; hold: number; energy: number }[] = [
  { src: "/images/character/fighter-idle.jpg", hold: 720, energy: 0 },
  { src: "/images/character/fighter-pivot.jpg", hold: 300, energy: 0.25 },
  { src: "/images/character/fighter-chamber.jpg", hold: 360, energy: 0.45 },
  { src: "/images/character/fighter-extend.jpg", hold: 200, energy: 0.85 },
  { src: "/images/character/fighter-impact.png", hold: 520, energy: 1 },
  { src: "/images/character/fighter-recovery.jpg", hold: 380, energy: 0.2 },
];

export const heroArt: CharacterAsset = {
  id: "impact",
  src: "/images/character/fighter-impact.png",
  title: "Impact",
  alt: "Anime martial artist at the peak of a roundhouse kick, wrapped in blue energy",
};

export const galleryArt: CharacterAsset[] = [
  { id: "idle", src: "/images/character/fighter-idle.jpg", title: "Idle stance", alt: "Fighter standing in a ready guard" },
  { id: "guard", src: "/images/character/fighter-guard.jpg", title: "Defensive guard", alt: "Fighter with both fists raised in a tight guard" },
  { id: "punch", src: "/images/character/fighter-punch.jpg", title: "Straight punch", alt: "Fighter throwing a lead punch" },
  { id: "kick", src: "/images/character/fighter-extend.jpg", title: "Roundhouse kick", alt: "Fighter extending a roundhouse kick" },
  { id: "jump", src: "/images/character/fighter-jump.jpg", title: "Jumping kick", alt: "Fighter airborne in a jumping kick" },
  { id: "finish", src: "/images/character/fighter-finish.jpg", title: "Finishing stance", alt: "Fighter standing after a powered strike" },
];

export const moveArt = {
  roundhouse: "/images/character/fighter-impact.png",
  spin: "/images/character/fighter-spin.jpg",
  flying: "/images/character/fighter-jump.jpg",
};
