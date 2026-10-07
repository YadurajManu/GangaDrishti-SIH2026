export type ImpedanceRow = { frequency: number; baseline: number; baselinePhase: number; sample: number; samplePhase: number };

export function parseImpedanceCsv(text: string): ImpedanceRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2 || lines.length > 5001 || lines[0].trim().toLowerCase() !== 'frequency_hz,baseline_ohm,baseline_phase_deg,sample_ohm,sample_phase_deg') {
    throw new Error('Use the five-column CSV template with 1–5000 data rows.');
  }
  return lines.slice(1).map((line, index) => {
    const raw = line.split(',').map(value => value.trim());
    const cells = raw.map(Number);
    if (cells.length !== 5 || raw.some(value => !value) || cells.some(value => !Number.isFinite(value)) || cells[0] <= 0 || cells[1] <= 0 || cells[3] <= 0 || Math.abs(cells[2]) > 180 || Math.abs(cells[4]) > 180) {
      throw new Error(`Invalid impedance values on CSV line ${index + 2}.`);
    }
    return { frequency: cells[0], baseline: cells[1], baselinePhase: cells[2], sample: cells[3], samplePhase: cells[4] };
  }).sort((a, b) => a.frequency - b.frequency);
}

export function calculateImpedance(rows: ImpedanceRow[]) {
  const candidates = rows.filter(row => row.frequency >= 20 && row.frequency <= 45);
  if (!candidates.length) throw new Error('Include at least one measurement between 20 and 45 Hz.');
  const chosen = candidates.reduce((best, row) => Math.abs(row.baselinePhase + 45) < Math.abs(best.baselinePhase + 45) ? row : best);
  return { chosen, delta: (chosen.sample - chosen.baseline) / chosen.baseline * 100, phaseOffset: Math.abs(chosen.baselinePhase + 45) };
}
