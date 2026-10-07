import assert from 'node:assert/strict';
import { calculateImpedance, parseImpedanceCsv } from '../src/pfas.ts';

const csv = 'frequency_hz,baseline_ohm,baseline_phase_deg,sample_ohm,sample_phase_deg\n20,1000,-30,900,-25\n30,1000,-44,800,-40\n45,1000,-52,950,-48';
const result = calculateImpedance(parseImpedanceCsv(csv));
assert.equal(result.chosen.frequency, 30);
assert.equal(result.delta, -20);
assert.equal(result.phaseOffset, 1);
assert.throws(() => parseImpedanceCsv(csv.replace('800', 'bad')), /line 3/);
assert.throws(() => calculateImpedance([{ frequency: 10, baseline: 1000, baselinePhase: -45, sample: 900, samplePhase: -40 }]), /20 and 45/);
