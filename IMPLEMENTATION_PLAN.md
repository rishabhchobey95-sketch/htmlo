# IMPLEMENTATION_PLAN.md: GEMINI ARGON ARCHITECTURAL OVERHAUL FOR "htmlo"

> **Autonomous Execution Document**  
> System: Gemini Argon Deep-Reasoning Mode  
> Target: `htmlo` Desktop-Class Visual Email Builder & RFC 5322/Outlook MSO Compiler  
> Verification Harness: `oxlint`, `tsc -b && vite build`, `compilerSelfTest.ts`

---

## 1. Deep Diagnostic Matrix

| Area | Current Defect / Limitation | Architectural Impact | Argon Deep-Reasoning Resolution |
|---|---|---|---|
| **MSO Email Compiler** | `EmailCompiler.ts` missing VML `<v:roundrect>` arcsize precision and border stroke calculations for buttons; missing Outlook VML `<v:rect><v:fill>` background image support for stripes; shape, timer, and video blocks lack bulletproof fallback table structures. | Outlook 2013/2016/2019/365 drops button border-radius and background images, breaking email layout. | Implement exact VML `<v:roundrect>` arcsize computation, `<v:rect><v:fill>` wrappers, zero-width preheader hack (`60x &zwnj;&nbsp;`), and nested XHTML table structures for timer, video, and vector shapes. |
| **Compiler Verification** | No automated compiler validation test suite exists to verify generated XHTML against Outlook rules, broken tags, or NaN values. | Regressions in compilation output can slip unnoticed into production exports. | Build `src/compiler/compilerSelfTest.ts` that runs comprehensive stress AST documents through `EmailCompiler.compile()` and validates doctype, VML balancing, MSO conditionals, and exact pixel geometry. |
| **State & Undo/Redo** | Rapid scrubbing (e.g. padding/font size) directly mutates `history` in `App.tsx` on every frame, polluting undo/redo with hundreds of micro-steps. | `Cmd+Z` undoes 1 pixel at a time instead of meaningful user edits; excessive memory allocation in history stack. | Separate transient preview state from committed history snapshots; introduce debounced pointerUp history commit pattern. |
| **Multi-Selection** | `selectedBlockIds` state exists partially in `App.tsx` and `Canvas.tsx`, but batch operations in `InspectorPanel.tsx` and on canvas (batch delete, batch align, batch duplicate) are unhandled. | Users cannot modify or align multiple selected blocks simultaneously. | Implement batch multi-selection bar, batch alignment, batch spacing, and batch mutation routines in `Canvas.tsx` and `InspectorPanel.tsx`. |
| **Windowing & Docking** | During splitter resize or window dragging, iframe pointer events intercept cursor events, causing dragging stalls. Floating windows lack viewport clamping. | Jarring drag experience; floating panels can be dragged off-screen and permanently lost. | Implement global pointer capture shield (`z-index: 99999`) during dragging/resizing, viewport bounds clamping, and magnetic dock snap zones. |
| **Design System & UI** | Missing ReactBits visual primitives; styles rely on ad-hoc CSS; lacking tactile 120fps feedback. | Interface feels like a generic web form instead of a Linear/Raycast/Figma tier desktop tool. | Build complete `src/components/reactbits/` library (`SpotlightCard`, `StarBorder`, `AnimatedBeam`, `Magnetic`, `FluidTabs`, `ShinyText`, `DecryptedText`, `InteractiveGridPattern`, `ElasticSlider`, `ScrubInput`, `ClickSpark`) and upgrade design tokens in `index.css`/`App.css`. |
| **AI Floating Cursors** | `AiFloatingCursors.tsx` simulated cursor movement without true physical flight splines, LeftDock pickup gestures, copy streaming, or Inspector telekinesis beams. | AI operations appear disconnected from the canvas workspace. | Re-engineer multi-agent spatial swarm (`Architect`, `Copywriter`, `Art Director`, `MSO Guardian`) with Catmull-Rom spline flight, velocity banking tilt, LeftDock ghost component dragging, character streaming, and `AnimatedBeam` tethering. |
| **Enterprise Features** | Lacks Command Palette (`Cmd+K`), real-time deliverability / 102KB Gmail clipping auditor, merge tag persona switcher, and dark mode inversion simulator. | Users lack professional email marketing tools to verify deliverability and customize dynamic campaigns. | Engineer `CommandPalette.tsx`, `AuditPanel.tsx`, merge tag interpolator with persona preview switcher, and client dark mode inversion toggle. |

---

## 2. Granular Task Breakdown

### Phase 1: Autonomous Testing, Self-Healing Loop & Compiler Verifier
- [x] **Task 1.1**: Create `src/compiler/compilerSelfTest.ts` with comprehensive AST stress-test document covering all 4 Stripe types, 1-4 column Structures, and all 11 Block types.
- [x] **Task 1.2**: Implement programmatic validation rules in `compilerSelfTest.ts` (balanced MSO conditionals, VML roundrect and rect/fill presence, zero `NaN`/`undefined`/`null`, exact pixel table widths, hidden preheader snippet).
- [x] **Task 1.3**: Wire compiler self-test into App status bar and export a callable diagnostic function.
- [x] **Task 1.4**: Run `npm run lint` and `npm run build` to verify Phase 1.

### Phase 2: ReactBits UI Primitives & Minimalist Obsidian Design System
- [x] **Task 2.1**: Upgrade `src/index.css` and `src/App.css` with deep obsidian tokens, glassmorphism filters, hairline borders, and fluid typography.
- [x] **Task 2.2**: Build `src/components/reactbits/SpotlightCard.tsx` with RAF mouse coordinate tracking and radial specular highlight.
- [x] **Task 2.3**: Build `src/components/reactbits/StarBorder.tsx` with animated conic border specular beams.
- [x] **Task 2.4**: Build `src/components/reactbits/AnimatedBeam.tsx` with dynamic SVG cubic-bezier laser tether between two coordinate refs.
- [x] **Task 2.5**: Build `src/components/reactbits/Magnetic.tsx` with spring-damper cursor attraction physics.
- [x] **Task 2.6**: Build `src/components/reactbits/FluidTabs.tsx` with spring sliding pill indicator.
- [x] **Task 2.7**: Build `src/components/reactbits/ShinyText.tsx` and `src/components/reactbits/DecryptedText.tsx`.
- [x] **Task 2.8**: Build `src/components/reactbits/InteractiveGridPattern.tsx` for canvas backdrop illumination.
- [x] **Task 2.9**: Build `src/components/reactbits/ElasticSlider.tsx` and `src/components/reactbits/ScrubInput.tsx` for Figma-style numeric scrubbing.
- [x] **Task 2.10**: Build `src/components/reactbits/ClickSpark.tsx` for tactile particle bursts on canvas drop and action clicks.
- [x] **Task 2.11**: Run `npm run lint` and `npm run build` to verify Phase 2.

### Phase 3: Bulletproof Compiler Hardening (`EmailCompiler.ts`)
- [x] **Task 3.1**: Implement exact VML `<v:roundrect>` arcsize computation, stroke, and textbox padding for `button` blocks.
- [x] **Task 3.2**: Implement Outlook VML `<v:rect><v:fill>` background image rendering for `StripeNode`.
- [x] **Task 3.3**: Implement reverse mobile column stacking (`reverseStackMobile`) using RTL table structures with LTR container overrides and media queries.
- [x] **Task 3.4**: Implement Outlook-safe table rendering for `timer`, `video`, `menu`, `social`, and `shape` blocks.
- [x] **Task 3.5**: Add zero-width preheader hack with 60x `&zwnj;&nbsp;` padding and CSS reset table structures.
- [x] **Task 3.6**: Add Dark Mode CSS hooks (`@media (prefers-color-scheme: dark)` and `[data-ogsc]`) in compiled HTML.
- [x] **Task 3.7**: Verify `compilerSelfTest.ts` passes 100% with zero assertion failures.
- [x] **Task 3.8**: Run `npm run lint` and `npm run build` to verify Phase 3.

### Phase 4: Core State, Coalesced Undo/Redo & Dockable Layout Hardening
- [x] **Task 4.1**: Upgrade state management in `App.tsx` with debounced/coalesced history snapshot commits.
- [x] **Task 4.2**: Implement multi-select batch mutation handlers (batch delete, batch duplicate, batch align, batch padding).
- [x] **Task 4.3**: Add global pointer capture shield in `DockLayoutManager.tsx` and `FloatingWindow.tsx` during drag/resize.
- [x] **Task 4.4**: Implement viewport boundary clamping and magnetic snap zones for floating windows.
- [x] **Task 4.5**: Add 1-click workspace layout presets (Standard Studio, Focus Canvas, Split Code Engineer, Reset Layout) in `TopBar.tsx`.
- [x] **Task 4.6**: Add on-canvas box-model padding scrub handles and bottom-left ancestor breadcrumb navigation bar in `Canvas.tsx`.
- [x] **Task 4.7**: Run `npm run lint` and `npm run build` to verify Phase 4.

### Phase 5: 1000x Multi-Agent AI Spatial Co-Designer (`AiFloatingCursors.tsx` & AI Director)
- [x] **Task 5.1**: Implement 4 specialized agent roles (`Architect`, `Copywriter`, `Art Director`, `MSO Guardian`) with custom colors, badges, and status pills.
- [x] **Task 5.2**: Implement Catmull-Rom spline flight physics, velocity banking tilt, and trailing specular ribbon particles.
- [x] **Task 5.3**: Build visible spatial actions: LeftDock ghost component pickup and flight to canvas drop target.
- [x] **Task 5.4**: Build live token-by-token copy streaming on the canvas with blinking caret.
- [x] **Task 5.5**: Build `AnimatedBeam` inspector telekinesis connecting canvas cursor to `InspectorPanel` property controls.
- [x] **Task 5.6**: Build bottom-center AI Director Command Bar (`Cmd+J`) with natural language prompt, blueprint chips, and live playback transport controls.
- [x] **Task 5.7**: Add node-scoped "Summon AI Cursor" trigger in on-canvas floating toolbars.
- [x] **Task 5.8**: Run `npm run lint` and `npm run build` to verify Phase 5.

### Phase 6: Enterprise Features
- [x] **Task 6.1**: Build `src/components/CommandPalette.tsx` (`Cmd+K` / `Ctrl+K`) with fuzzy navigation, block insertion, AI trigger, and tool execution.
- [x] **Task 6.2**: Build `src/components/AuditPanel.tsx` with live 0-100 deliverability score, 102KB Gmail clipping meter, VML check, accessibility audit, and 1-click AI auto-fix.
- [x] **Task 6.3**: Implement Dynamic Merge Tags and Persona Switcher in `PreviewModal.tsx` and `InspectorPanel.tsx`.
- [x] **Task 6.4**: Implement Client Dark Mode Inversion Simulator in `Canvas.tsx` and `PreviewModal.tsx`.
- [x] **Task 6.5**: Implement Saved Custom Modules library in `LeftDock.tsx` backed by `localStorage`.
- [x] **Task 6.6**: Run `npm run lint` and `npm run build` to verify Phase 6.

### Phase 7: Final Polish, Oxlint Clean-Up & Zero-Warning Gate
- [x] **Task 7.1**: Clean up all unused variables, unused imports, and fast-refresh export issues flagged by `oxlint`.
- [x] **Task 7.2**: Run `npm run lint` and confirm zero errors and zero warnings.
- [x] **Task 7.3**: Run `npm run build` and confirm production bundle builds with zero errors.
- [x] **Task 7.4**: Execute compiler self-test and verify 100% pass status.
- [x] **Task 7.5**: Mark all tasks complete `[x]` and deliver comprehensive architectural report.
