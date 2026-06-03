# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file React component (`tarifario-presupuesto.jsx`) that works as a budget builder for a graphic design studio (CDCV Rafaela). It lets users compose a quote by selecting services from a rate card, apply client-type and studio surcharge multipliers, and preview a printable budget document.

## Architecture

Everything lives in one exported default component `Tarifario`. No routing, no external state library, no build config — intended to be dropped into an existing React app (e.g. a Vite or CRA project) as a page component.

**Key data structures**

- `TARIFARIO_INICIAL` — static object keyed by category string, values are `{ id, nombre, precio }` arrays. Prices are in ARS, base for client type B.
- `CLIENTE_TIPOS` — three tiers (A/B/C) each with a `factor` multiplier (1.35 / 1.0 / 0.65).
- `preciosOverride` (state) — sparse map of `id → number` for user-edited prices, persisted to `localStorage` under key `tarifario-cdcv-precios`. Merged at render time via `construirTarifario()`.
- `seleccionados` (state) — map of `id → { item, cantidad }` for the current quote.

**Price calculation**

`precioFinal(item) = Math.round(item.precio × factorCliente × factorEstudio)`

where `factorEstudio = 1 + porcEstudio / 100`.

**Three views** toggled via `vista` state:
- `"builder"` — two-panel layout: category/item selector (left) + running summary (right).
- `"preview"` — read-only invoice-style table with IVA 21% breakdown.
- `"editar"` — full rate-card editor; changes are buffered in `editBuffer` and committed with `guardarEdicion()`.

**Styling** — all inline via the `s` object defined inside the component. Dark theme (`#0f1117` background). No CSS files or CSS-in-JS library.

## Adding this component to a React project

```bash
# Vite + React (recommended)
npm create vite@latest my-app -- --template react
cd my-app
npm install
# Copy tarifario-presupuesto.jsx into src/
# Import and render <Tarifario /> in App.jsx
npm run dev
```

## Extending the rate card

To add new services, append entries to the relevant category array in `TARIFARIO_INICIAL` (or add a new category key). Each entry needs a unique `id` string (follow the existing `cat_NN` pattern) and a base `precio` in ARS for client type B.

To persist name edits (not just price edits), `guardarEdicion` and `cargarPrecios` currently only handle price overrides — name edits stored in `editNombreBuffer` are not yet persisted.
