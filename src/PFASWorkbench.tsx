import { useState } from 'react';
import { Activity, Download, ExternalLink, Info, Upload } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { calculateImpedance, parseImpedanceCsv, type ImpedanceRow } from './pfas';

const template = 'frequency_hz,baseline_ohm,baseline_phase_deg,sample_ohm,sample_phase_deg\n';
function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PFASWorkbench() {
  const [id, setId] = useState('');
  const [frequency, setFrequency] = useState('');
  const [baseline, setBaseline] = useState('');
  const [baselinePhase, setBaselinePhase] = useState('');
  const [sample, setSample] = useState('');
  const [samplePhase, setSamplePhase] = useState('');
  const [rows, setRows] = useState<ImpedanceRow[]>([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const result = rows.length ? calculateImpedance(rows) : null;

  function calculateManual() {
    try {
      if (!id.trim() || [frequency, baseline, baselinePhase, sample, samplePhase].some(value => !value.trim())) throw new Error('Enter a sample ID and all five readings.');
      const next = parseImpedanceCsv(template + [frequency, baseline, baselinePhase, sample, samplePhase].join(','));
      calculateImpedance(next);
      setRows(next); setFileName('Manual reading'); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not calculate the reading.'); setRows([]); }
  }
  async function loadCsv(file?: File) {
    if (!file) return;
    try {
      if (file.size > 300_000) throw new Error('Choose a CSV smaller than 300 KB.');
      const next = parseImpedanceCsv(await file.text()); calculateImpedance(next);
      setRows(next); setFileName(file.name); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not read the CSV.'); setRows([]); }
  }

  return <section className="pfas-workbench">
    <div className="page-heading"><div><div className="eyebrow">01 / PFAS SIGNAL WORKBENCH</div><h2>Impedance response, made inspectable</h2><p>Enter a baseline and exposed-electrode reading, or upload a frequency sweep. The calculation runs locally in your browser.</p></div><span className="status-tag"><span className="status-dot"/> Runnable signal processor</span></div>
    <div className="scope-note"><Info size={18}/><span><strong>Measurement boundary:</strong> this processor accepts operator-supplied electrode data. It measures relative impedance change, not PFAS concentration, chemical identity or drinking-water safety. A real cartridge, calibration curve, controls and LC-MS/MS comparison remain necessary.</span></div>
    <div className="pfas-grid">
      <section className="panel input-panel"><div className="panel-title"><div><span className="section-number">A</span><h3>Electrode readings</h3></div><Activity size={18}/></div>
        <label>Sample ID<input value={id} onChange={e => setId(e.target.value)} placeholder="e.g. PFAS-001"/></label>
        <div className="field-grid"><label>Frequency <span>Hz</span><input type="number" min="20" max="45" step="any" value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="20–45"/></label><label>Baseline phase <span>degrees</span><input type="number" min="-180" max="180" step="any" value={baselinePhase} onChange={e => setBaselinePhase(e.target.value)} placeholder="near −45"/></label></div>
        <div className="field-grid"><label>Stabilized baseline <span>Ω</span><input type="number" min="0" step="any" value={baseline} onChange={e => setBaseline(e.target.value)} placeholder="measured |Z|"/></label><label>After sample exposure <span>Ω</span><input type="number" min="0" step="any" value={sample} onChange={e => setSample(e.target.value)} placeholder="measured |Z|"/></label></div>
        <label>Sample phase <span>degrees</span><input type="number" min="-180" max="180" step="any" value={samplePhase} onChange={e => setSamplePhase(e.target.value)} placeholder="measured phase"/></label>
        <button className="run-button" onClick={calculateManual}>Calculate impedance shift</button>
        <div className="separator pfas-separator"/><div className="field-label">Or inspect an instrument sweep</div>
        <div className="file-row"><Upload size={18}/><span>{fileName || 'No sweep uploaded'}</span><label className="upload-button">Choose CSV<input type="file" accept=".csv,text/csv" onChange={e => loadCsv(e.target.files?.[0])}/></label></div>
        <button className="text-button pfas-template" onClick={() => download('pfas-impedance-template.csv', template)}><Download size={15}/> Download five-column CSV template</button>
        <p className="help">Sweep columns: frequency (Hz), baseline magnitude (Ω), baseline phase (°), sample magnitude (Ω), sample phase (°). The processor chooses the 20–45 Hz point nearest −45° baseline phase.</p>
        {error && <div className="error" role="alert">{error}</div>}
      </section>
      <div className="right-stack">
        <section className="panel pfas-evidence"><div className="panel-title"><div><span className="section-number">B</span><h3>Signal evidence</h3></div><span className="panel-kicker">{rows.length ? `${rows.length} frequency ${rows.length === 1 ? 'point' : 'points'}` : 'Awaiting electrode data'}</span></div>
          {result ? <><div className="pfas-metrics"><div><span>Selected frequency</span><strong>{result.chosen.frequency} <small>Hz</small></strong></div><div><span>Relative impedance change</span><strong>{result.delta >= 0 ? '+' : ''}{result.delta.toFixed(2)}<small>%</small></strong></div><div><span>Baseline phase</span><strong>{result.chosen.baselinePhase.toFixed(1)}<small>°</small></strong></div></div><div className="formula">ΔZ = (|Z|<sub>sample</sub> − |Z|<sub>baseline</sub>) / |Z|<sub>baseline</sub> × 100</div>
            {rows.length > 1 && <div className="pfas-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows} margin={{ top: 12, right: 15, left: 6, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e9ec"/><XAxis dataKey="frequency" type="number" domain={['dataMin','dataMax']} tickLine={false} fontSize={10} unit=" Hz"/><YAxis tickLine={false} fontSize={10} unit=" Ω"/><Tooltip formatter={(value) => [`${Number(value).toFixed(1)} Ω`, '']}/><Legend/><Line type="linear" dataKey="baseline" name="Stabilized baseline" stroke="#0b787d" strokeWidth={2} dot={false}/><Line type="linear" dataKey="sample" name="After exposure" stroke="#d08b44" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>}
            <div className="pfas-review"><strong>Review flags</strong><span>{result.phaseOffset > 10 ? `Baseline phase is ${result.phaseOffset.toFixed(1)}° from −45°; repeat near the method target.` : `Baseline phase is ${result.phaseOffset.toFixed(1)}° from −45°.`}</span><span>{rows.length === 1 ? 'Single point only; no frequency-sweep shape or drift can be inspected.' : 'Compare curve shape and replicate electrodes before interpretation.'}</span><span>Signal magnitude alone cannot establish PFOA or total PFAS.</span></div>
            <button className="outline-button" onClick={() => download(`${id.trim() || 'pfas'}-signal-draft.csv`, `sample_id,frequency_hz,baseline_ohm,baseline_phase_deg,sample_ohm,sample_phase_deg,delta_z_percent,status\n"${id.replaceAll('"','""')}",${result.chosen.frequency},${result.chosen.baseline},${result.chosen.baselinePhase},${result.chosen.sample},${result.chosen.samplePhase},${result.delta.toFixed(4)},"signal only; uncalibrated"\n`)}><Download size={15}/> Export signal record</button>
          </> : <div className="pfas-empty"><Activity size={34}/><strong>Your EIS measurement appears here</strong><span>Enter instrument readings or upload a sweep to see the calculation, selected frequency and review flags.</span></div>}
        </section>
        <section className="panel pfas-method-card"><div className="panel-title"><div><span className="section-number">C</span><h3>Proposed cartridge path</h3></div></div><div className="pfas-flow"><span>Enrich water sample</span><b>→</b><span>MIP-coated electrode</span><b>→</b><span>EIS sweep</span><b>→</b><span>Lab confirmation</span></div><p>The SIH deck proposes enrichment and an imprinted-polymer sensor. The linked study demonstrates PFOA-focused MIP electrodes and selects |Z| near −45° phase, typically at 20–45 Hz. Its research performance does not validate this team's cartridge.</p><a href="https://doi.org/10.1021/acsomega.4c10473" target="_blank" rel="noreferrer">Read the published method <ExternalLink size={14}/></a></section>
      </div>
    </div>
  </section>;
}
