# GangaDrishti SIH 2026 field-screening app

A separate React/Vite/TypeScript app for the team's microplastic image and PFAS impedance workbenches.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. `npm run build` creates a static `dist/` suitable for offline presentation once dependencies are installed.

## Live evaluation flow

1. Open **Analysis workbench** and inspect the synthetic calibration disc.
2. Press **Run analysis**. The app reads pixels, thresholds fluorescence, measures connected regions, calculates candidates per litre and displays evidence.
3. Select a region to inspect size and measured signal. Export a draft CSV if useful.
4. Replace the image with a real fluorescence capture. Enter the measured image scale (µm/pixel), filtered volume, collection details and field blank. The app does not fabricate these values.
5. Use **Method & architecture** to explain the proposed device and where this browser demonstrator differs.
6. Switch to **PFAS impedance**. Enter measured baseline and sample readings at 20–45 Hz, or upload a sweep using the downloadable CSV template. Inspect the selected frequency, relative impedance change, chart and review flags.

The bundled calibration image and manifest are synthetic. The masthead uses a sourced US EPA field photo and labels it as reference imagery. No PFAS or antibiotic sensor is connected; the PFAS workbench processes measurements supplied by the operator and does not output a concentration. Exported CSVs are draft records, **not** an official WQMIS integration. See `SOURCES.md` for evidence and limitations.

## Checks

```bash
npm test
npm run build
```
