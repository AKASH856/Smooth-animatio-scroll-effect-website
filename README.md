# new-studio-nav

Scroll-driven UI effects for React, smoothed by
[Lenis](https://github.com/darkroomengineering/lenis) — cloned from
[new.studio](https://new.studio). Two components:

- **`FloatingNav`** — a floating frosted-glass pill navbar that continuously
  **shrinks** as you scroll (links → hamburger) and expands back.
- **`LiquidHero`** — a WebGL2 shader "liquid mesh gradient" hero background that
  **dissolves into blobs** and vanishes as the page scrolls, revealing the
  content beneath (with a CSS fallback when WebGL2 / motion isn't available).

Widths and dissolve are written frame-by-frame off the scroll position (no CSS
transitions), so they track the scroll exactly.

- Prop-driven: pass your own **brand** and **links**
- Optional **`LenisProvider`** so one Lenis instance is shared across the page
- **Accessible**: Esc / click-outside to close the menu, focus return, active-link highlighting
- **Self-contained CSS** (no Tailwind required in the consuming app), no global reset leakage
- Respects `prefers-reduced-motion`
- Works in Next.js (App Router) and any React 18/19 app

---

## Install

This package is distributed via git. Replace `YOUR-GH-USER/REPO` with your repo:

```bash
npm i github:YOUR-GH-USER/new-studio-nav
# or a specific tag/commit:
npm i github:YOUR-GH-USER/new-studio-nav#v0.1.0
```

`react` and `react-dom` are peer dependencies (you already have them). Installing
from git runs the package's `prepare` script, which builds `dist/` automatically.

## Usage

```tsx
import { FloatingNav, LenisProvider } from "new-studio-nav";
import "new-studio-nav/styles.css"; // once, e.g. in your root layout

export default function App() {
  return (
    <LenisProvider>
      {" "}
      {/* optional — enables shared smooth scroll */}
      <FloatingNav
        brand="Acme"
        links={[
          { label: "Case Studies", href: "#case-studies" },
          { label: "Approach", href: "#approach" },
          { label: "Insights", href: "#insights" },
          { label: "Contact", href: "#contact" },
        ]}
      />
      {/* ...your page... */}
    </LenisProvider>
  );
}
```

- `brand` accepts a string **or** any React node (e.g. an `<img/>` logo).
- Without `<LenisProvider>`, `FloatingNav` still works — it creates its own
  Lenis instance. Use the provider when other components also need smooth scroll.
- In **Next.js**, no `"use client"` is needed on your side — the components
  already declare it.

### Props

| Prop           | Type                  | Default                     | Meaning                                     |
| -------------- | --------------------- | --------------------------- | ------------------------------------------- |
| `brand`        | `ReactNode`           | `NewStudio`                 | Left-side logo / wordmark                   |
| `links`        | `{label, href}[]`     | 4 demo links                | Navigation links                            |
| `brandHref`    | `string`              | `"#top"`                    | Where the brand anchor points               |
| `spanMax`      | `number`              | `18`                        | Grid span at top (widest ~ near full-width) |
| `spanMin`      | `number`              | `6`                         | Grid span fully shrunk (narrowest)          |
| `scrollRange`  | `number`              | `400`                       | Px of scroll over which the shrink happens  |
| `linkFadeEnd`  | `number`              | `130`                       | Px by which inline links finish fading      |
| `collapseAt`   | `number`              | `130`                       | Px at which links swap to the hamburger     |
| `pxPerSpan`    | `number`              | `71.2`                      | Width per span unit                         |
| `className`    | `string`              | `""`                        | Extra classes merged onto the pill          |

The span/px values were measured off new.studio at one viewport — faithful
starting points, not the site's original constants. Tune freely.

### Customizing smoothness

Pass Lenis options through the provider:

```tsx
<LenisProvider options={{ duration: 1.4, wheelMultiplier: 0.9 }}>
```

## Liquid hero background

```tsx
import { LiquidHero, FloatingNav } from "new-studio-nav";
import "new-studio-nav/styles.css";

export default function Home() {
  return (
    <div style={{ position: "relative" }}>
      {/* Pinned WebGL background — dissolves as the hero scrolls away. */}
      <LiquidHero colors={["#1e3aff", "#4f46e5", "#a5b4fc"]} />

      <FloatingNav brand="Acme" links={[/* ... */]} />

      {/* Hero content: transparent so the canvas shows through. */}
      <section style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
        <h1>We exist to make the new possible</h1>
      </section>

      {/* Opaque content below reveals as the blue recedes. */}
      <div style={{ position: "relative", zIndex: 10, background: "#fff" }}>
        {/* ...rest of the page... */}
      </div>
    </div>
  );
}
```

By default the canvas is `position: fixed` (content scrolls over it → parallax)
and fully dissolves over one viewport height of scroll. It renders behind
everything at `z-index: 0`; give your content `position: relative; z-index: 10`
so it sits on top.

### `LiquidHero` props

| Prop               | Type                       | Default              | Meaning                                         |
| ------------------ | -------------------------- | -------------------- | ----------------------------------------------- |
| `colors`           | `[string, string, string]` | blues/purples        | Hex colors the gradient blends between          |
| `dissolveDistance` | `number`                   | `window.innerHeight` | Px of scroll over which the blue fully vanishes |
| `speed`            | `number`                   | `1`                  | Drift-animation speed multiplier                |
| `fixed`            | `boolean`                  | `true`               | Pin to viewport (parallax) vs. absolute in-flow |
| `className`        | `string`                   | `""`                 | Extra classes on the wrapper                    |

Falls back to an animated CSS gradient when WebGL2 is unavailable or the user
prefers reduced motion. The shader's noise/dissolve is a faithful interpretation
of the new.studio effect, not its literal (minified/GPU-compiled) source.

## Local development (this repo)

```bash
npm install
npm run dev        # playground at http://localhost:5200
npm run build      # build the library into dist/
npm run typecheck  # type-check everything
```

`src/App.tsx` + `src/playground.css` are the dev playground and are **not** part
of the published package (only `dist/` is shipped).

## Publish to GitHub

From this folder:

```bash
git add -A
git commit -m "Initial commit"
# create an empty repo on GitHub first, then:
git remote add origin https://github.com/YOUR-GH-USER/new-studio-nav.git
git branch -M main
git push -u origin main
```

Then any project can `npm i github:YOUR-GH-USER/new-studio-nav`.
