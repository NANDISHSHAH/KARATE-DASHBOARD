# Karate Dashboard

Match scoreboard for kumite, used by Advanced Taefudo Martial Arts. Aka (red) and Ao (blue) sit on one screen with a shared clock, scoring, penalties, Senshu, and a victory takeover when a fighter wins.

## Run it

Node.js and npm are required.

```sh
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

```sh
npm run build
npm run preview
```

`npm run build` writes a static site to `dist`. `npm run preview` serves that build locally.

## Match controls

The clock starts at **1:30**. Under the timer:

| Control | What it does |
| --- | --- |
| Settings | Set match length in minutes (steps of 0.5) and the point lead that ends the bout. Defaults are 1.5 minutes and a 6-point lead. |
| Reset clock | Returns the clock to the current match length and pauses it. |
| Play / Pause | Starts or stops the clock. At 00:00 the clock stops on its own. |
| Reset | Clears both scores, penalties, Senshu, the victory screen, and the clock. |

Each corner has the same buttons:

| Button | Effect |
| --- | --- |
| Yuko | +1 |
| Wazari | +2 |
| Ippon | +3 |
| Cancel | −1 from that corner’s score, and never below 0 |
| C1, C2, C3, HC, H | Toggle that penalty on or off. Penalties are markers only; they do not change the score. |
| SENSHU | Give Senshu to that corner. Only one corner can hold it. |

## How a bout is won

- A corner wins as soon as its lead reaches the configured point gap (6 by default). The leading score flickers and shows a trophy.
- If the clock reaches 00:00 with the scores level and only one corner has Senshu, that corner wins. The takeover reads **SENSHU**.
- Either win opens a full-screen takeover with the final score. Tap anywhere to return to the board. Scores stay as they were.

## Stack

Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.
