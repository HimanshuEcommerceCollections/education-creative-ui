<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Styling architecture (must follow)

`src/app/globals.css` is **framework config only** — keep it to: `@import "tailwindcss"`, `@theme` tokens, the shared `:root` CSS variables, and `@layer base` (reset / body / a11y focus). Nothing feature- or component-specific goes there.

1. **Tailwind first.** Layout, flex/grid, spacing, type, color, borders, radius, shadow, hover/focus, responsive, positioning, overflow, z-index → Tailwind utilities. Do not write CSS for these.
2. **CSS Modules only when Tailwind can't express it cleanly** — keyframes, complex/3D transforms, perspective, `clip-path`, `mask`, advanced gradients, pseudo-elements, stateful compound selectors, or styling injected (`dangerouslySetInnerHTML`) markup (use `:global()` scoped under a module class).
3. **Co-locate** a module as `component-name.module.css` beside its component. Never add component/page CSS to `globals.css`.
4. **Scope animations to their component** (their `@keyframes` live in that component's module) — never global. Reference from React as `className={styles.x}`, and combine with `cn(styles.x, "tailwind classes")`.
5. If a component needs more than ~30–40 lines of custom CSS, it gets its own module.
6. No duplicated colors/radii/shadows/timings — reuse the `:root` variables in `globals.css`.
7. Descriptive, component-scoped class names (`.pianoStage`, `.oriSheet`), never `.box`/`.wrap`/`.left`.
8. Prefer Server Components; add `"use client"` only to the child that needs interactivity, not whole pages.
9. Delete dead selectors/keyframes/variables rather than leaving them.

Reference implementations: `components/music/*` (per-instrument modules + shared shell), `components/arts/origami-fold.module.css` (`:global` for injected SVG), `components/*/…module.css` for scoped keyframes.
