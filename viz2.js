/* ══════════════════════════════════════════════════════════
   viz2.js — Advanced visualizations Phase 2
   GSEA Volcano • Waterfall • Radar • Bubble • C11→C12 Trigger
   Venn • D3 NER Network • Pathway Stories • ERCC1 Panel
   ══════════════════════════════════════════════════════════ */

/* ─── shared helpers (safe refs to main-script globals) ─── */
function _gwLook() { return typeof deseqLook !== 'undefined' ? deseqLook : {}; }
function _gpwLook() { return typeof pwLook !== 'undefined' ? pwLook : {}; }
const DB_COL = { Hallmark:'#1d4ed8', KEGG:'#d97706', Reactome:'#16a34a', CGP:'#7c3aed' };
const PLOT_FONT = { family: 'Inter, sans-serif', size: 11 };

/* ══════════════════════════════════════════════════════════
   1. GSEA VOLCANO PLOT  (all 3,758 pathways, any comparison)
   ══════════════════════════════════════════════════════════ */
let gsea_volcano_built = false;
function buildGSEAVolcano() {
  const el = document.getElementById('gsea-vol-plot');
  if (!el || !window.GSEA_DATA) return;
  const cid = (document.getElementById('gsea-vol-comp') || {}).value || 'C8';
  const dbF = (document.getElementById('gsea-vol-db') || {}).value || '';
  const ci = CID.indexOf(cid);
  const pw = GSEA_DATA.pathways;

  const KEY_PW = ['KEGG_NUCLEOTIDE_EXCISION_REPAIR','REACTOME_NUCLEOTIDE_EXCISION_REPAIR',
    'HALLMARK_OXIDATIVE_PHOSPHORYLATION','HALLMARK_INFLAMMATORY_RESPONSE',
    'HALLMARK_HEDGEHOG_SIGNALING','HALLMARK_HYPOXIA','KAN_RESPONSE_TO_ARSENIC_TRIOXIDE',
    'HALLMARK_E2F_TARGETS','HALLMARK_TNFA_SIGNALING_VIA_NFKB','REACTOME_BASE_EXCISION_REPAIR'];

  const byDB = {};
  pw.forEach(p => {
    if (dbF && p.db !== dbF) return;
    const nes = p.nes[ci], fdr = p.fdr[ci];
    if (nes == null) return;
    const nlp = (fdr != null && fdr > 0) ? Math.min(-Math.log10(fdr), 4) : 0;
    const sig = Math.abs(nes) > 1.5 && fdr != null && fdr < 0.25;
    const isKey = KEY_PW.includes(p.name);
    if (!byDB[p.db]) byDB[p.db] = { x:[], y:[], txt:[], col:[], sz:[], op:[], name:[] };
    byDB[p.db].x.push(nes);
    byDB[p.db].y.push(nlp);
    byDB[p.db].name.push(p.name);
    byDB[p.db].txt.push(
      `<b>${p.name.replace(/_/g,' ')}</b><br>NES: ${nes.toFixed(3)}<br>FDR: ${fdr!=null?fdr.toFixed(3):'n/a'}<br><i>Click to open</i>`
    );
    byDB[p.db].col.push(isKey ? '#f59e0b' : (sig ? DB_COL[p.db] : DB_COL[p.db]+'55'));
    byDB[p.db].sz.push(isKey ? 11 : (sig ? 7 : 4));
    byDB[p.db].op.push(isKey ? 1 : (sig ? 0.88 : 0.45));
  });

  const traces = Object.entries(byDB).map(([db, d]) => ({
    x: d.x, y: d.y, text: d.txt, customdata: d.name,
    mode: 'markers', name: db, type: 'scattergl',
    marker: { color: d.col, size: d.sz, opacity: d.op,
      line: { color: '#fff', width: 0.5 } },
    hovertemplate: '%{text}<extra></extra>'
  }));

  const sigLine = -Math.log10(0.25);
  Plotly.newPlot(el, traces, {
    xaxis: { title: 'NES', zeroline: true, zerolinecolor: '#94a3b8', gridcolor: '#f1f5f9',
             range: [-4, 4] },
    yaxis: { title: '\u2212log\u2081\u2080(FDR)', gridcolor: '#f1f5f9', range: [0, 4.2] },
    shapes: [
      { type:'line', x0:-1.5,x1:-1.5,y0:0,y1:4.2, line:{color:'#94a3b8',dash:'dot',width:1.5} },
      { type:'line', x0:1.5,x1:1.5,y0:0,y1:4.2, line:{color:'#94a3b8',dash:'dot',width:1.5} },
      { type:'line', x0:-4,x1:4,y0:sigLine,y1:sigLine, line:{color:'#f59e0b',dash:'dot',width:1.5} },
    ],
    annotations: [
      { x:-1.5, y:4.1, text:'|NES|=1.5', showarrow:false, font:{size:9,color:'#94a3b8'}, xanchor:'right' },
      { x:4, y:sigLine, text:'FDR=0.25', showarrow:false, font:{size:9,color:'#f59e0b'}, xanchor:'right', yanchor:'bottom' },
    ],
    legend: { orientation:'h', y:-0.22 },
    margin: { l:55, r:20, t:35, b:80 }, height: 500,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font: PLOT_FONT,
    title: { text: `GSEA Landscape — ${cid}: ${(typeof CLBL!=='undefined'?CLBL[cid]:cid)}`, font:{size:11} }
  }, { responsive:true, displayModeBar:true, modeBarButtonsToRemove:['lasso2d','select2d'] });

  el.on('plotly_click', data => {
    const pt = data.points[0];
    if (pt && pt.customdata && typeof openModal === 'function')
      openModal(pt.customdata, CID.indexOf(cid));
  });
  gsea_volcano_built = true;
}

/* ══════════════════════════════════════════════════════════
   1b. C8 FULL PROFILE — Top Significant Pathways
   ══════════════════════════════════════════════════════════ */
function buildC8Profile() {
  const el = document.getElementById('c8-profile-wrap');
  if (!el || !window.GSEA_DATA) return;
  const ci = CID.indexOf('C8');
  const sig = GSEA_DATA.pathways
    .filter(p => p.sig[ci])
    .sort((a,b) => Math.abs(b.nes[ci]) - Math.abs(a.nes[ci]))
    .slice(0, 12);

  const labels = sig.map(p => p.name.replace(/^(KEGG_|REACTOME_|HALLMARK_|BENPORATH_|PECE_|KAN_)/,'').replace(/_/g,' ').substring(0,50));
  const vals = sig.map(p => p.nes[ci]);
  const cols = vals.map(v => v < 0 ? '#1d4ed8' : '#dc2626');
  const names = sig.map(p => p.name);

  Plotly.newPlot(el, [{
    y: labels, x: vals, type:'bar', orientation:'h',
    marker: { color: cols, opacity: 0.85 },
    text: vals.map(v => (v>0?'+':'')+v.toFixed(2)),
    textposition: 'outside',
    customdata: names,
    hovertemplate: '<b>%{y}</b><br>NES: %{x:.3f}<extra></extra>',
    cliponaxis: false
  }], {
    xaxis: { title:'NES', zeroline:true, zerolinecolor:'#94a3b8', gridcolor:'#f1f5f9',
             range:[Math.min(...vals)-0.3, Math.max(...vals)+0.3] },
    yaxis: { autorange:'reversed', tickfont:{size:9.5} },
    margin: { l:320, r:70, t:30, b:50 }, height: 400,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff',
    font: { family:'Inter,sans-serif', size:11 },
    title: { text:'Top 12 Significant Pathways — C8: AA Stem vs Parental (Arsenic)', font:{size:11} }
  }, { responsive:true, displayModeBar:false });

  el.on('plotly_click', data => {
    const pt = data.points[0];
    if (pt && pt.customdata && typeof openModal==='function') openModal(pt.customdata, ci);
  });
}

/* ══════════════════════════════════════════════════════════
   2. WATERFALL CHART  (top/bottom 20 NES, any comparison)
   ══════════════════════════════════════════════════════════ */
function buildWaterfall() {
  const el = document.getElementById('waterfall-plot');
  if (!el || !window.GSEA_DATA) return;
  const cid = (document.getElementById('wf-comp') || {}).value || 'C8';
  const ci = CID.indexOf(cid);
  const pw = GSEA_DATA.pathways;
  const sig = pw.filter(p => p.sig[ci]).sort((a,b) => (a.nes[ci]||0)-(b.nes[ci]||0));
  const bot = sig.slice(0, 15);
  const top = sig.slice(-15).reverse();
  const combined = [...bot, ...top];

  const labels = combined.map(p => {
    const n = p.name.replace(/^(KEGG_|REACTOME_|HALLMARK_|BENPORATH_|PECE_|KAN_)/,'')
                     .replace(/_/g,' ').substring(0, 44);
    return n;
  });
  const vals = combined.map(p => p.nes[ci]);
  const fdrs = combined.map(p => p.fdr[ci]);
  const cols = vals.map(v => {
    const t = Math.min(Math.abs(v)/3, 1);
    return v < 0
      ? `rgb(${Math.round(29+(255-29)*(1-t))},${Math.round(78+(255-78)*(1-t))},${Math.round(216+(255-216)*(1-t))})`
      : `rgb(${Math.round(220+(255-220)*(1-t))},${Math.round(38+(255-38)*(1-t))},${Math.round(38+(255-38)*(1-t))})`;
  });

  Plotly.newPlot(el, [{
    y: labels, x: vals, type:'bar', orientation:'h',
    marker: { color: cols, opacity: 0.88 },
    text: vals.map((v,i)=>`${v>0?'+':''}${v.toFixed(2)}`),
    textposition: vals.map(v=>v>0?'outside':'outside'),
    customdata: combined.map(p=>p.name),
    hovertemplate: '<b>%{y}</b><br>NES: %{x:.3f}<extra></extra>',
    cliponaxis: false
  }], {
    xaxis: { title:'NES', zeroline:true, zerolinecolor:'#94a3b8',
             gridcolor:'#f1f5f9', range:[Math.min(...vals)-0.4, Math.max(...vals)+0.4] },
    yaxis: { autorange:'reversed', tickfont:{size:9.5} },
    margin: { l:340, r:90, t:35, b:50 }, height: 700,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font: PLOT_FONT,
    title: { text:`Top & Bottom 15 Significant Pathways — ${cid}`, font:{size:11} }
  }, { responsive:true, displayModeBar:false });

  el.on('plotly_click', data => {
    const pt = data.points[0];
    if (pt && pt.customdata && typeof openModal==='function')
      openModal(pt.customdata, ci);
  });
}

/* ══════════════════════════════════════════════════════════
   3. RADAR CHART  (pathway category profile, compare comps)
   ══════════════════════════════════════════════════════════ */
const RADAR_CATS = [
  { label:'NER', pws:['KEGG_NUCLEOTIDE_EXCISION_REPAIR','REACTOME_NUCLEOTIDE_EXCISION_REPAIR'] },
  { label:'BER/MMR/HR', pws:['REACTOME_BASE_EXCISION_REPAIR','REACTOME_MISMATCH_REPAIR','KEGG_HOMOLOGOUS_RECOMBINATION'] },
  { label:'Stemness', pws:['HALLMARK_G2M_CHECKPOINT','HALLMARK_E2F_TARGETS','HALLMARK_MYC_TARGETS_V1'] },
  { label:'Self-Renewal', pws:['HALLMARK_HEDGEHOG_SIGNALING','HALLMARK_NOTCH_SIGNALING','HALLMARK_WNT_BETA_CATENIN_SIGNALING'] },
  { label:'Hypoxia/HIF', pws:['HALLMARK_HYPOXIA'] },
  { label:'OxPhos/ROS', pws:['HALLMARK_OXIDATIVE_PHOSPHORYLATION'] },
  { label:'Inflammation', pws:['HALLMARK_INFLAMMATORY_RESPONSE','HALLMARK_TNFA_SIGNALING_VIA_NFKB','HALLMARK_INTERFERON_GAMMA_RESPONSE'] },
  { label:'Arsenic', pws:['KAN_RESPONSE_TO_ARSENIC_TRIOXIDE','HALLMARK_XENOBIOTIC_METABOLISM'] },
  { label:'EMT', pws:['HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION'] },
  { label:'Apoptosis', pws:['HALLMARK_APOPTOSIS','HALLMARK_DNA_REPAIR'] },
];

function getCatNES(cat, ci) {
  if (!window.GSEA_DATA) return 0;
  const vals = cat.pws.map(pn => {
    const p = (typeof pwLook!=='undefined' ? pwLook[pn] : null) || GSEA_DATA.pathways.find(x=>x.name===pn);
    return p ? (p.nes[ci] || 0) : 0;
  }).filter(v => v !== 0);
  if (!vals.length) return 0;
  const absMx = vals.reduce((a,v)=>Math.abs(v)>Math.abs(a)?v:a, 0);
  return absMx;
}

function buildRadar() {
  const el = document.getElementById('radar-plot');
  if (!el || !window.GSEA_DATA) return;

  const sel = document.querySelectorAll('.radar-comp-cb:checked');
  const compIds = sel.length ? Array.from(sel).map(cb=>cb.value) : ['C7','C8'];

  const cats = RADAR_CATS.map(c=>c.label);
  const traces = compIds.map(cid => {
    const ci = CID.indexOf(cid);
    const vals = RADAR_CATS.map(cat => getCatNES(cat, ci));
    return {
      type:'scatterpolar', mode:'lines+markers', name: cid,
      r: [...vals, vals[0]], // close the polygon
      theta: [...cats, cats[0]],
      fill:'toself', fillcolor: (CCOL[cid]||'#1d4ed8')+'22',
      line:{ color: CCOL[cid]||'#1d4ed8', width:2.5 },
      marker:{ size:6, color: CCOL[cid]||'#1d4ed8' },
      hovertemplate:'<b>%{theta}</b><br>NES: %{r:.2f}<extra>'+cid+'</extra>'
    };
  });

  // Add invisible reference ring traces at 1.0, 1.5, 2.0, 2.5 NES
  const ringVals = [1.0, 1.5, 2.0, 2.5];
  const ringColors = {'1.0':'#cbd5e1','1.5':'#f59e0b','2.0':'#cbd5e1','2.5':'#94a3b8'};
  const ringDash   = {'1.0':'dot','1.5':'dash','2.0':'dot','2.5':'dot'};
  const cats = RADAR_CATS.map(c=>c.label);
  ringVals.forEach(rv => {
    const ringR = Array(cats.length + 1).fill(rv);
    traces.push({
      type: 'scatterpolar', mode: 'lines',
      r: ringR, theta: [...cats, cats[0]],
      line: { color: ringColors[rv], width: rv===1.5?1.8:1, dash: ringDash[rv] },
      fill: 'none', showlegend: false, hoverinfo: 'skip',
      name: `NES ${rv} ring`
    });
  });

  Plotly.newPlot(el, traces, {
    polar: {
      radialaxis:{
        visible: true, range: [0, 3.2],
        tickfont: {size: 9, color: '#64748b'},
        tickvals: [1.0, 1.5, 2.0, 2.5, 3.0],
        ticktext: ['1.0', '★1.5', '2.0', '2.5', '3.0'],
        gridcolor: '#e8ecf0', linecolor: '#cbd5e1',
        showticklabels: true, angle: 45
      },
      angularaxis:{ tickfont:{size:9.5}, gridcolor:'#e2e8f0' }
    },
    legend:{ orientation:'h', y:-0.18 },
    margin:{ l:60,r:60,t:50,b:80 }, height:480,
    paper_bgcolor:'#fff', font: PLOT_FONT,
    title:{ text:'Pathway Category Profile (Mean Peak |NES|)  ·  ★ gold ring = significance threshold (1.5)', font:{size:10,color:'#475569'} }
  }, { responsive:true, displayModeBar:false });
}

/* ══════════════════════════════════════════════════════════
   4. BUBBLE CHART  (NES × FDR × leading edge coverage)
   ══════════════════════════════════════════════════════════ */
function buildBubble() {
  const el = document.getElementById('bubble-plot');
  if (!el || !window.GSEA_DATA) return;
  const cid = (document.getElementById('bubble-comp')||{}).value || 'C8';
  const ci = CID.indexOf(cid);
  const pw = GSEA_DATA.pathways;

  const byDB = {};
  pw.forEach(p => {
    const nes = p.nes[ci], fdr = p.fdr[ci], le = p.le[ci] || '';
    if (nes == null || fdr == null) return;
    if (!p.sig[ci]) return;
    const tagMatch = le.match(/tags=(\d+)%/);
    const tagPct = tagMatch ? parseInt(tagMatch[1]) : 20;
    const nlp = fdr > 0 ? Math.min(-Math.log10(fdr), 4) : 0;
    if (!byDB[p.db]) byDB[p.db] = { x:[],y:[],sz:[],txt:[],name:[] };
    byDB[p.db].x.push(nes);
    byDB[p.db].y.push(nlp);
    byDB[p.db].sz.push(Math.max(8, tagPct * 0.55));
    byDB[p.db].txt.push(
      `<b>${p.name.replace(/_/g,' ')}</b><br>NES: ${nes.toFixed(3)}<br>FDR: ${fdr.toFixed(3)}<br>Leading edge: ${tagPct}%`
    );
    byDB[p.db].name.push(p.name);
  });

  const traces = Object.entries(byDB).map(([db, d]) => ({
    x:d.x, y:d.y, text:d.txt, customdata:d.name,
    mode:'markers', name:db, type:'scatter',
    marker:{ color:DB_COL[db], size:d.sz, opacity:0.75, line:{color:'#fff',width:0.8} },
    hovertemplate:'%{text}<br><i>Bubble size = leading edge fraction</i><extra></extra>'
  }));

  Plotly.newPlot(el, traces, {
    xaxis:{ title:'NES', zeroline:true,zerolinecolor:'#94a3b8',gridcolor:'#f1f5f9' },
    yaxis:{ title:'\u2212log\u2081\u2080(FDR)', gridcolor:'#f1f5f9' },
    shapes:[
      {type:'line',x0:-1.5,x1:-1.5,y0:0,y1:4.2,line:{color:'#94a3b8',dash:'dot',width:1.2}},
      {type:'line',x0:1.5,x1:1.5,y0:0,y1:4.2,line:{color:'#94a3b8',dash:'dot',width:1.2}},
    ],
    legend:{orientation:'h',y:-0.2}, margin:{l:55,r:20,t:35,b:80}, height:460,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:`Significant Pathways Bubble Chart — ${cid} (bubble size = leading edge %)`,font:{size:11}}
  },{ responsive:true, displayModeBar:false });

  el.on('plotly_click', data=>{
    const pt=data.points[0];
    if(pt&&pt.customdata&&typeof openModal==='function') openModal(pt.customdata,ci);
  });
}

/* ══════════════════════════════════════════════════════════
   5. C11 → C12 NER TRIGGER PANEL  (arsenic as the switch)
   ══════════════════════════════════════════════════════════ */
function buildNERTrigger() {
  const el = document.getElementById('ner-trigger-wrap');
  if (!el || !window.GSEA_DATA) return;

  // Get NES values for KEGG NER across key comparisons
  const nerKEGG = GSEA_DATA.pathways.find(p=>p.name==='KEGG_NUCLEOTIDE_EXCISION_REPAIR');
  const nerReac = GSEA_DATA.pathways.find(p=>p.name==='REACTOME_NUCLEOTIDE_EXCISION_REPAIR');
  if (!nerKEGG) return;

  const getData = (p, c) => ({ nes: p.nes[CID.indexOf(c)], fdr: p.fdr[CID.indexOf(c)], sig: p.sig[CID.indexOf(c)] });
  const rows = [
    { comp:'C1', label:'AA vs NHW — Parental Vehicle',       col:'#7c3aed', cond:'No arsenic, parental' },
    { comp:'C2', label:'AA vs NHW — Parental Arsenic',       col:'#7c3aed', cond:'Arsenic, parental' },
    { comp:'C11',label:'AA vs NHW — Stem Vehicle',           col:'#db2777', cond:'No arsenic, stem ← KEY' },
    { comp:'C12',label:'AA vs NHW — Stem Arsenic',           col:'#dc2626', cond:'Arsenic, stem ← KEY' },
    { comp:'C7', label:'NHW: Stem vs Parental (Arsenic)',    col:'#0891b2', cond:'NHW control' },
    { comp:'C8', label:'AA: Stem vs Parental (Arsenic) ★',  col:'#dc2626', cond:'Primary finding' },
  ];

  let html = `<div style="margin-bottom:1rem;font-size:.82rem;color:#64748b;"><span style="color:#f59e0b;font-weight:700;">★</span> Significant (|NES| &gt; 1.5, FDR &lt; 0.25)</div>`;
  html += `<div style="display:grid;grid-template-columns:230px 1fr 80px 80px;gap:.3rem;align-items:center;font-size:.78rem;">`;
  html += `<div style="font-weight:700;color:#64748b;padding:.3rem 0;border-bottom:2px solid #e2e8f0;">Comparison</div>
    <div style="font-weight:700;color:#64748b;padding:.3rem 0;border-bottom:2px solid #e2e8f0;">NES (KEGG NER)</div>
    <div style="font-weight:700;color:#64748b;padding:.3rem 0;border-bottom:2px solid #e2e8f0;text-align:center;">FDR</div>
    <div style="font-weight:700;color:#64748b;padding:.3rem 0;border-bottom:2px solid #e2e8f0;text-align:center;">Sig</div>`;

  rows.forEach((r, ri) => {
    const d = getData(nerKEGG, r.comp);
    const nes = d.nes || 0;
    const fdr = d.fdr;
    const sig = d.sig;
    const isKey = r.comp === 'C11' || r.comp === 'C12' || r.comp === 'C8' || r.comp === 'C7';
    const barW = Math.min(Math.abs(nes)/3*45, 45);
    const barDir = nes >= 0 ? 'left:50%' : 'right:50%';
    const barCol = nes >= 0 ? '#dc2626' : '#1d4ed8';
    const bg = isKey ? (r.comp==='C12'||r.comp==='C8' ? '#fff7ed' : '#f8fafc') : '#fff';

    html += `<div style="padding:.4rem .5rem;background:${bg};border-radius:4px 0 0 4px;font-weight:${isKey?700:400};color:${r.col};">
      ${r.comp}: ${r.label.split('—')[1]||r.label}
    </div>
    <div style="background:${bg};padding:.4rem .3rem;">
      <div style="display:flex;align-items:center;gap:.4rem;">
        <div style="flex:1;height:14px;background:#f1f5f9;border-radius:4px;position:relative;">
          <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#cbd5e1;"></div>
          <div style="position:absolute;top:1px;bottom:1px;width:${barW}%;${barDir};background:${barCol};border-radius:3px;
            ${sig?'box-shadow:0 0 6px '+barCol+'88;':''};transition:width .8s ease ${ri*80}ms;"></div>
        </div>
        <span style="font-family:monospace;font-size:.76rem;color:${nes<0?'#1d4ed8':'#dc2626'};font-weight:${sig?700:400};min-width:40px;">
          ${nes>=0?'+':''}${nes.toFixed(2)}
        </span>
      </div>
    </div>
    <div style="background:${bg};padding:.4rem;text-align:center;font-family:monospace;font-size:.73rem;color:#64748b;">
      ${fdr!=null?(fdr<0.001?'<.001':fdr.toFixed(3)):'n/a'}
    </div>
    <div style="background:${bg};padding:.4rem;text-align:center;border-radius:0 4px 4px 0;">
      ${sig?'<span style="color:#f59e0b;font-size:1rem;">★</span>':'<span style="color:#e2e8f0;">—</span>'}
    </div>`;
  });
  html += `</div>`;

  // Key insight box
  const c11 = getData(nerKEGG,'C11'); const c12 = getData(nerKEGG,'C12');
  html += `<div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
    <div style="background:#eff6ff;border-radius:8px;padding:.9rem;border-left:3px solid #1d4ed8;">
      <div style="font-size:.72rem;font-weight:700;color:#1e40af;margin-bottom:.3rem;">C11: Stem, NO Arsenic</div>
      <div style="font-size:1.2rem;font-weight:800;color:#1d4ed8;">NES = ${(c11.nes||0).toFixed(2)}</div>
      <div style="font-size:.78rem;color:#374151;margin-top:.2rem;">FDR = ${c11.fdr!=null?c11.fdr.toFixed(3):'n/a'} — NOT significant<br>NER intact without arsenic</div>
    </div>
    <div style="background:#fff7ed;border-radius:8px;padding:.9rem;border-left:3px solid #dc2626;">
      <div style="font-size:.72rem;font-weight:700;color:#dc2626;margin-bottom:.3rem;">C12: Stem, WITH Arsenic ★</div>
      <div style="font-size:1.2rem;font-weight:800;color:#dc2626;">NES = ${(c12.nes||0).toFixed(2)}</div>
      <div style="font-size:.78rem;color:#374151;margin-top:.2rem;">FDR = ${c12.fdr!=null?c12.fdr.toFixed(3):'n/a'} — SIGNIFICANT<br>Arsenic is the trigger that reveals NER disparity</div>
    </div>
  </div>
  <div style="margin-top:.8rem;padding:.75rem;background:#fef3c7;border-radius:8px;border:1px solid #f59e0b;">
    <span style="font-size:.8rem;color:#92400e;"><strong>Key finding:</strong> NER is the ONLY major pathway showing a C11→C12 transition (non-significant → significant). Arsenic exposure is the decisive trigger that converts a latent racial biology into a measurable NER repair deficit in AA breast cancer stem cells.</span>
  </div>
  <div style="margin-top:.7rem;background:#fdf4ff;border:1.5px solid #e9d5ff;border-radius:8px;padding:.85rem;border-left:4px solid #7c3aed;">
    <div style="font-size:.78rem;font-weight:700;color:#6d28d9;margin-bottom:.3rem;">&#128300; Uniqueness of NER in C11&rarr;C12 transition</div>
    <div style="font-size:.8rem;color:#7c3aed;line-height:1.55;">NER is the <strong>ONLY major pathway</strong> showing the pattern of non-significant in C11 (NES = +0.63, FDR = 0.59) becoming significant in C12 (NES = &minus;1.87, FDR &lt; 0.25) when arsenic is added. Every other pathway active in C12 is also active in C11. This makes NER uniquely arsenic-dependent in the racial stem cell comparison.</div>
  </div>`;

  // Append proof label before chart
  html += `<div style="margin-top:1.2rem;padding:.6rem .9rem;background:#f8fafc;border-radius:8px;border-left:3px solid #7c3aed;font-size:.8rem;color:#475569;">
    <strong style="color:#6d28d9;">Visual proof below:</strong> Every other major pathway already active in C11 stays active (or inactive) in C12. NER alone crosses the significance threshold — exclusively when arsenic is added.
  </div>`;

  el.innerHTML = html;

  // Build comparative chart — give container explicit min-height so Plotly renders
  const chartDiv = document.createElement('div');
  chartDiv.id = 'ner-trigger-proof-chart';
  chartDiv.style.cssText = 'margin-top:.8rem;width:100%;min-height:400px;';
  el.appendChild(chartDiv);

  // Build data for 10 representative pathways
  const compPWs = [
    'KEGG_NUCLEOTIDE_EXCISION_REPAIR',
    'HALLMARK_G2M_CHECKPOINT',
    'HALLMARK_E2F_TARGETS',
    'HALLMARK_MYC_TARGETS_V1',
    'HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION',
    'HALLMARK_OXIDATIVE_PHOSPHORYLATION',
    'HALLMARK_INFLAMMATORY_RESPONSE',
    'HALLMARK_HEDGEHOG_SIGNALING',
    'KAN_RESPONSE_TO_ARSENIC_TRIOXIDE',
    'REACTOME_BASE_EXCISION_REPAIR'
  ];
  const ci11 = CID.indexOf('C11'), ci12 = CID.indexOf('C12');
  const pwLabels = compPWs.map(n => n.replace(/^(KEGG_|REACTOME_|HALLMARK_|KAN_)/,'').replace(/_/g,' ').substring(0,30));
  const c11vals = compPWs.map(pn => { const p = GSEA_DATA.pathways.find(x=>x.name===pn); return p ? (p.nes[ci11]||0) : 0; });
  const c12vals = compPWs.map(pn => { const p = GSEA_DATA.pathways.find(x=>x.name===pn); return p ? (p.nes[ci12]||0) : 0; });
  const c11sig  = compPWs.map(pn => { const p = GSEA_DATA.pathways.find(x=>x.name===pn); return p ? p.sig[ci11] : false; });
  const c12sig  = compPWs.map(pn => { const p = GSEA_DATA.pathways.find(x=>x.name===pn); return p ? p.sig[ci12] : false; });

  // Bar colors: gold outline for significant cells
  const c11cols = c11vals.map((v,i) => c11sig[i] ? '#7c3aed' : '#c4b5fd');
  const c12cols = c12vals.map((v,i) => c12sig[i] ? '#dc2626' : '#fca5a5');

  Plotly.newPlot(chartDiv, [
    { x: pwLabels, y: c11vals, type:'bar', name:'C11: Stem, No Arsenic (purple=sig)',
      marker:{color:c11cols, opacity:0.85, line:{color:'#7c3aed',width:0.5}},
      hovertemplate:'<b>%{x}</b><br>C11 NES: %{y:.2f}<extra></extra>' },
    { x: pwLabels, y: c12vals, type:'bar', name:'C12: Stem + Arsenic (red=sig)',
      marker:{color:c12cols, opacity:0.85, line:{color:'#dc2626',width:0.5}},
      hovertemplate:'<b>%{x}</b><br>C12 NES: %{y:.2f}<extra></extra>' }
  ], {
    barmode: 'group',
    xaxis: { tickangle: -38, tickfont:{size:8.5}, gridcolor:'#f1f5f9' },
    yaxis: { title:'NES', zeroline:true, zerolinecolor:'#94a3b8', gridcolor:'#f1f5f9', range:[-3.5,3.5] },
    shapes: [
      {type:'line',x0:-0.5,x1:9.5,y0:1.5,y1:1.5,line:{color:'#f59e0b',dash:'dot',width:1.5}},
      {type:'line',x0:-0.5,x1:9.5,y0:-1.5,y1:-1.5,line:{color:'#f59e0b',dash:'dot',width:1.5}},
    ],
    annotations: [{x:0,y:c12vals[0],text:'NER only:<br>C11 NS → C12 ★',
      showarrow:true,arrowhead:2,font:{size:9,color:'#dc2626'},
      ax:55,ay:-35,arrowcolor:'#dc2626',bgcolor:'#fff7ed',bordercolor:'#dc2626',borderwidth:1,borderpad:3}],
    legend:{orientation:'h',y:-0.38,font:{size:10}},
    margin:{l:55,r:20,t:40,b:120}, height:400,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff',
    font:{family:'Inter,sans-serif',size:11},
    title:{text:'10 major pathways: C11 vs C12 — NER is the ONLY one that switches (bright = significant, faded = NS)',font:{size:9.5,color:'#475569'}}
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   6. VENN DIAGRAM  (C8 vs C12 NER leading edge gene overlap)
   ══════════════════════════════════════════════════════════ */
const C8_NER_LE = ['XPC','DDB1','CETN2','RAD23A','ERCC3','GTF2H1','CDK7','POLD2','POLE3','RFC1','RFC2','RPA2','RPA3','ERCC1','CCNH','XPA'];
const C12_NER_LE = ['PCNA','LIG1','POLD1','POLD3','POLE','POLE2','RFC3','RFC4','RFC5','CCNH','ERCC1','RFC2','RPA3','POLD2','RFC1','RPA1','RPA2'];
const SHARED_LE = C8_NER_LE.filter(g => C12_NER_LE.includes(g));
const C8_ONLY = C8_NER_LE.filter(g => !C12_NER_LE.includes(g));
const C12_ONLY = C12_NER_LE.filter(g => !C8_NER_LE.includes(g));

function buildVenn() {
  const el = document.getElementById('venn-wrap');
  if (!el) return;

  function chip(g, bg, tc) {
    return `<span class="le-gene-chip" style="background:${bg};color:${tc};border-color:${tc}33;"
      onclick="showGenePopup('${g}',this)"
      data-tooltip="Click for gene info">${g}</span>`;
  }

  const sharedChips = SHARED_LE.map(g=>chip(g,'#fef3c7','#92400e')).join('');
  const c8Chips = C8_ONLY.map(g=>chip(g,'#dbeafe','#1e40af')).join('');
  const c12Chips = C12_ONLY.map(g=>chip(g,'#dcfce7','#14532d')).join('');

  const cop9Genes = ['COPS3','COPS4','COPS5','COPS6','COPS7A','COPS8'];
  const cop9Chips = cop9Genes.map(g=>chip(g,'#f5f3ff','#7c3aed')).join('');

  el.innerHTML = `
  <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:.5rem;align-items:center;margin-bottom:1rem;">
    <div style="text-align:right;"><span style="font-size:.85rem;font-weight:700;color:#1d4ed8;">C8 Leading Edge</span>
      <br><span style="font-size:.78rem;color:#64748b;">AA Stem vs Parental (Arsenic)</span>
      <br><span style="font-size:.78rem;color:#64748b;">Damage recognition & TFIIH</span></div>
    <div style="width:2px;height:60px;background:#e2e8f0;margin:0 1rem;"></div>
    <div><span style="font-size:.85rem;font-weight:700;color:#16a34a;">C12 Leading Edge</span>
      <br><span style="font-size:.78rem;color:#64748b;">AA vs NHW — Stem Arsenic</span>
      <br><span style="font-size:.78rem;color:#64748b;">Gap-filling & ligation</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:.6rem;">
    <div style="background:#eff6ff;border-radius:10px;padding:.9rem;border:2px solid #bfdbfe;">
      <div style="font-size:.72rem;font-weight:700;color:#1e40af;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em;">C8 Only (${C8_ONLY.length} genes)</div>
      <div style="font-size:.74rem;color:#64748b;margin-bottom:.5rem;font-style:italic;">Damage recognition, TFIIH loading, incision</div>
      ${c8Chips}
    </div>
    <div style="background:#fef3c7;border-radius:10px;padding:.9rem;border:3px solid #f59e0b;text-align:center;">
      <div style="font-size:.72rem;font-weight:700;color:#92400e;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em;">&#9733; Shared &mdash; ${SHARED_LE.length} genes</div>
      <div style="font-size:.74rem;color:#64748b;margin-bottom:.5rem;font-style:italic;">Most reproducible racial NER markers</div>
      ${sharedChips}
      <div style="margin-top:.6rem;font-size:.74rem;color:#92400e;font-weight:600;">Present in both KEGG NER leading edges &rarr; highest confidence targets</div>
    </div>
    <div style="background:#f0fdf4;border-radius:10px;padding:.9rem;border:2px solid #bbf7d0;">
      <div style="font-size:.72rem;font-weight:700;color:#14532d;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em;">C12 Only (${C12_ONLY.length} genes)</div>
      <div style="font-size:.74rem;color:#64748b;margin-bottom:.5rem;font-style:italic;">Gap-filling synthesis & ligation</div>
      ${c12Chips}
    </div>
    <div style="background:#fdf4ff;border-radius:10px;padding:.9rem;border:2px solid #e9d5ff;">
      <div style="font-size:.72rem;font-weight:700;color:#7c3aed;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em;">Reactome C8 Only &mdash; COP9 Signalosome</div>
      <div style="font-size:.74rem;color:#64748b;margin-bottom:.5rem;font-style:italic;">Chromatin remodeling, upstream of damage recognition</div>
      ${cop9Chips}
    </div>
  </div>
  <div style="margin-top:.9rem;padding:.7rem;background:#f8fafc;border-radius:8px;font-size:.8rem;color:#374151;">
    <strong>Interpretation:</strong> C8 leading edge (AA stem vs. <em>parental</em> under arsenic) captures the initiation-stage NER loss relative to parental cells — damage recognition and TFIIH loading. C12 leading edge (AA vs. <em>NHW</em> stem under arsenic) captures the gap-filling stage — the repair synthesis step that is higher in NHW than AA stem cells. Together they show NER is suppressed in AA stem cells across ALL stages from recognition to ligation.
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   7. D3 NER GENE INTERACTION NETWORK
   ══════════════════════════════════════════════════════════ */
const NER_NET_NODES = [
  // GG-NER
  {id:'XPC',grp:'gg'},   {id:'RAD23A',grp:'gg'}, {id:'RAD23B',grp:'gg'},
  {id:'CETN2',grp:'gg'}, {id:'DDB1',grp:'gg'},   {id:'DDB2',grp:'gg'},
  {id:'CUL4A',grp:'csn'},{id:'CUL4B',grp:'csn'},{id:'COPS5',grp:'csn'},
  {id:'COPS3',grp:'csn'},{id:'COPS4',grp:'csn'},{id:'COPS6',grp:'csn'},
  {id:'COPS7A',grp:'csn'},{id:'COPS8',grp:'csn'},
  // TFIIH
  {id:'CDK7',grp:'tfiih'},{id:'CCNH',grp:'tfiih'},{id:'MNAT1',grp:'tfiih'},
  {id:'GTF2H1',grp:'tfiih'},{id:'GTF2H4',grp:'tfiih'},{id:'GTF2H5',grp:'tfiih'},
  {id:'ERCC3',grp:'tfiih'},{id:'ERCC2',grp:'tfiih'},
  // Verify & incise
  {id:'XPA',grp:'verify'},{id:'RPA1',grp:'verify'},{id:'RPA2',grp:'verify'},{id:'RPA3',grp:'verify'},
  {id:'ERCC1',grp:'incise'},{id:'ERCC4',grp:'incise'},{id:'ERCC5',grp:'incise'},
  // TC-NER
  {id:'ERCC6',grp:'tc'},{id:'ERCC8',grp:'tc'},
  // Gap-fill
  {id:'PCNA',grp:'gap'},{id:'RFC1',grp:'gap'},{id:'RFC2',grp:'gap'},{id:'RFC3',grp:'gap'},
  {id:'POLD1',grp:'gap'},{id:'POLD2',grp:'gap'},{id:'POLD3',grp:'gap'},
  {id:'POLE',grp:'gap'},{id:'POLE2',grp:'gap'},{id:'POLE3',grp:'gap'},
  {id:'LIG1',grp:'gap'},{id:'PARP1',grp:'gap'},
];
const NER_NET_EDGES = [
  ['XPC','RAD23A'],['XPC','RAD23B'],['XPC','CETN2'],['XPC','DDB1'],
  ['DDB1','DDB2'],['DDB1','CUL4A'],['DDB1','CUL4B'],['DDB1','ERCC8'],
  ['CUL4A','COPS5'],['CUL4A','COPS3'],['CUL4B','COPS4'],
  ['COPS3','COPS4'],['COPS5','COPS6'],['COPS7A','COPS8'],
  ['XPC','GTF2H1'],['GTF2H1','CDK7'],['GTF2H1','GTF2H4'],['GTF2H1','GTF2H5'],
  ['CDK7','CCNH'],['CDK7','MNAT1'],['CCNH','MNAT1'],
  ['GTF2H4','ERCC3'],['ERCC3','ERCC2'],
  ['XPA','RPA1'],['XPA','RPA2'],
  ['RPA1','RPA2'],['RPA1','RPA3'],['RPA2','RPA3'],
  ['ERCC1','ERCC4'],['ERCC5','XPA'],
  ['ERCC6','ERCC8'],
  ['PCNA','RFC1'],['PCNA','RFC2'],['PCNA','RFC3'],
  ['PCNA','POLD1'],['PCNA','POLE'],['PCNA','LIG1'],
  ['POLD1','POLD2'],['POLD1','POLD3'],
  ['POLE','POLE2'],['POLE','POLE3'],
  ['PARP1','XPA'],['LIG1','PCNA'],
];
const NER_GRP_COL = {
  gg:'#3b82f6', csn:'#7c3aed', tfiih:'#0891b2', verify:'#8b5cf6',
  incise:'#f59e0b', tc:'#db2777', gap:'#16a34a'
};
const NER_GRP_LBL = {
  gg:'GG-NER Recognition', csn:'COP9 Signalosome', tfiih:'TFIIH Complex',
  verify:'Damage Verification', incise:'Dual Incision', tc:'TC-NER', gap:'Gap-Fill & Ligation'
};

function buildNERNetwork(cid) {
  const el = document.getElementById('ner-network-svg-wrap');
  if (!el || typeof d3 === 'undefined') return;
  cid = cid || 'C8';
  const gs = _gwLook()[cid] || {};
  el.innerHTML = '';
  const W = el.clientWidth || 800, H = 520;

  const svg = d3.select(el).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('style', 'width:100%;height:'+H+'px;font-family:Inter,sans-serif;');

  // defs for arrowhead
  svg.append('defs').append('marker')
    .attr('id','net-arr').attr('viewBox','0 -5 10 10').attr('refX',18)
    .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
    .append('path').attr('d','M0,-4L10,0L0,4').attr('fill','#94a3b8');

  const nodeData = NER_NET_NODES.map(n => {
    const g = gs[n.id] || {};
    return { ...n, l2fc: g.l || null, fdr: g.f || null };
  });
  const linkData = NER_NET_EDGES.map(([s,t]) => ({ source:s, target:t }));

  const sim = d3.forceSimulation(nodeData)
    .force('link', d3.forceLink(linkData).id(d=>d.id).distance(70).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-220))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collision', d3.forceCollide(24))
    .force('x', d3.forceX(d=>{
      const pos={gg:W*0.18,csn:W*0.25,tfiih:W*0.45,verify:W*0.6,incise:W*0.72,tc:W*0.15,gap:W*0.82};
      return pos[d.grp]||W/2;
    }).strength(0.3))
    .force('y', d3.forceY(d=>{
      const pos={gg:H*0.3,csn:H*0.7,tfiih:H*0.3,verify:H*0.5,incise:H*0.65,tc:H*0.6,gap:H*0.5};
      return pos[d.grp]||H/2;
    }).strength(0.25));

  const link = svg.append('g').selectAll('line').data(linkData).join('line')
    .attr('stroke','#cbd5e1').attr('stroke-width',1.5).attr('opacity',0.7);

  const node = svg.append('g').selectAll('g').data(nodeData).join('g')
    .attr('cursor','pointer')
    .call(d3.drag()
      .on('start',(e,d)=>{if(!e.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
      .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;})
      .on('end',(e,d)=>{if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null;}))
    .on('click',(e,d)=>{if(typeof showGenePopup==='function')showGenePopup(d.id,e.target);});

  node.append('circle')
    .attr('r', d => d.fdr!=null&&d.fdr<0.05 ? 14 : 11)
    .attr('fill', d => {
      if(d.l2fc==null) return '#e5e7eb';
      const v=Math.max(-1.5,Math.min(1.5,d.l2fc));
      if(v>=0){const t=v/1.5;return`rgb(${~~(255*(1-t)+220*t)},${~~(255*(1-t)+38*t)},${~~(255*(1-t)+38*t)})`;}
      else{const t=-v/1.5;return`rgb(${~~(255*(1-t)+29*t)},${~~(255*(1-t)+78*t)},${~~(255*(1-t)+216*t)})`;}
    })
    .attr('stroke', d => NER_GRP_COL[d.grp]||'#94a3b8')
    .attr('stroke-width', d => d.fdr!=null&&d.fdr<0.05 ? 3 : 1.5)
    .attr('stroke-dasharray', d => d.fdr!=null&&d.fdr<0.05 ? '4 2' : 'none');

  node.append('text')
    .attr('text-anchor','middle').attr('dominant-baseline','middle')
    .attr('font-size', d => d.id.length>5 ? 7.5 : 8.5)
    .attr('font-weight','700')
    .attr('fill', d => d.l2fc!=null&&Math.abs(d.l2fc)>0.5 ? 'white' : '#1e293b')
    .text(d=>d.id);

  // Tooltip
  node.append('title').text(d=>{
    const ls=d.l2fc!=null?(d.l2fc>=0?'+':'')+d.l2fc.toFixed(3):'n/a';
    const fs=d.fdr!=null?(d.fdr<0.001?'<0.001':d.fdr.toFixed(3)):'n/a';
    return `${d.id} [${NER_GRP_LBL[d.grp]}]\nL2FC: ${ls} | FDR: ${fs}\nClick for details`;
  });

  sim.on('tick', () => {
    link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y)
        .attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
    node.attr('transform',d=>`translate(${Math.max(16,Math.min(W-16,d.x))},${Math.max(16,Math.min(H-16,d.y))})`);
  });

  // Legend
  const lg = svg.append('g').attr('transform',`translate(12,12)`);
  Object.entries(NER_GRP_LBL).forEach(([grp,lbl],i)=>{
    const row = lg.append('g').attr('transform',`translate(0,${i*18})`);
    row.append('circle').attr('r',6).attr('cx',6).attr('fill',NER_GRP_COL[grp]).attr('opacity',0.85);
    row.append('text').attr('x',16).attr('y',4).attr('font-size',9).attr('fill','#374151').text(lbl);
  });
  // Scale legend
  const sc=svg.append('g').attr('transform',`translate(${W-180},${H-30})`);
  sc.append('text').attr('font-size',8.5).attr('fill','#64748b').text('Node fill: L2FC (blue=suppressed→red=induced)');
}

/* ══════════════════════════════════════════════════════════
   8. ERCC1 FOUR-COMPARISON CONSISTENCY PANEL
   ══════════════════════════════════════════════════════════ */
function buildERCC1Panel() {
  const el = document.getElementById('ercc1-panel');
  if (!el) return;
  const dl = _gwLook();

  // Stem vs parental comparisons C5-C8
  const comps = [
    { cid:'C5', label:'C5: NHW Stem vs Parental (No Arsenic)', col:'#0891b2', race:'NHW' },
    { cid:'C6', label:'C6: AA Stem vs Parental (No Arsenic)',  col:'#db2777', race:'AA'  },
    { cid:'C7', label:'C7: NHW Stem vs Parental (Arsenic)',    col:'#06b6d4', race:'NHW' },
    { cid:'C8', label:'C8: AA Stem vs Parental (Arsenic) ★',  col:'#dc2626', race:'AA'  },
  ];

  const getData = (cid, gene) => {
    const g = dl[cid] && dl[cid][gene];
    return g || null;
  };

  const maxL = 0.8;

  let html = `<div style="margin-bottom:.8rem;font-size:.82rem;color:#64748b;">
    ERCC1 L2FC across stem vs parental comparisons (C5–C8). Consistently suppressed in AA stem (C6, C8); not suppressed in NHW stem (C5, C7). L2FC range: −0.44 to −0.67 in AA.</div>`;
  html += `<div style="display:grid;grid-template-columns:260px 1fr 70px 70px;gap:.35rem;align-items:center;">`;
  html += `<div style="font-weight:700;font-size:.73rem;color:#64748b;border-bottom:2px solid #e2e8f0;padding:.25rem 0;">Comparison</div>
    <div style="font-weight:700;font-size:.73rem;color:#64748b;border-bottom:2px solid #e2e8f0;padding:.25rem 0;">ERCC1 L2FC</div>
    <div style="font-weight:700;font-size:.73rem;color:#64748b;border-bottom:2px solid #e2e8f0;text-align:center;">FDR</div>
    <div style="font-weight:700;font-size:.73rem;color:#64748b;border-bottom:2px solid #e2e8f0;text-align:center;">Sig</div>`;

  comps.forEach(c => {
    const d = getData(c.cid,'ERCC1');
    const l = d?d.l:null, f = d?d.f:null;
    const sig = f!=null&&f<0.05;
    const pct = l!=null?Math.min(Math.abs(l)/maxL*45,45):0;
    const isPos = l!=null&&l>=0;
    const bg = c.race==='AA' ? '#fff0f6' : '#f0f9ff';
    html += `<div style="padding:.35rem .4rem;background:${bg};border-radius:4px 0 0 4px;font-size:.77rem;font-weight:600;color:${c.col};">${c.label}</div>
    <div style="background:${bg};padding:.35rem .25rem;">
      <div style="display:flex;align-items:center;gap:.3rem;">
        <span style="font-size:.72rem;color:#64748b;width:30px;text-align:right;font-weight:700;">${c.race}</span>
        <div style="flex:1;height:12px;background:#f1f5f9;border-radius:3px;position:relative;">
          <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#cbd5e1;"></div>
          ${l!=null?`<div style="position:absolute;top:1px;bottom:1px;${isPos?'left:50%':'right:50%'};width:${pct}%;background:${isPos?'#ef4444':'#3b82f6'};border-radius:2px;opacity:${sig?1:.5};"></div>`:''}
        </div>
        <span style="font-family:monospace;font-size:.73rem;min-width:46px;text-align:right;color:${isPos?'#dc2626':'#1d4ed8'};font-weight:${sig?700:400};">${l!=null?(l>=0?'+':'')+l.toFixed(3):'n/a'}</span>
      </div>
    </div>
    <div style="background:${bg};font-size:.72rem;font-family:monospace;text-align:center;padding:.35rem;">${f!=null?(f<0.001?'<.001':f.toFixed(3)):'n/a'}</div>
    <div style="background:${bg};border-radius:0 4px 4px 0;text-align:center;padding:.35rem;">${sig?'<span style="color:#f59e0b;">★</span>':'—'}</div>`;
  });
  html += `</div>
  <div style="margin-top:.9rem;padding:.7rem;background:#fee2e2;border-radius:8px;border-left:3px solid #dc2626;font-size:.81rem;color:#374151;">
    <strong>ERCC1 summary:</strong> Consistently suppressed in AA stem cells in C6 and C8 (stem vs parental, −0.44 to −0.67, FDR &lt; 0.05). NHW stem cells (C5, C7) show no significant ERCC1 suppression. The racial contrast is present without arsenic and amplified by it. <strong>ERCC1 is the single most reproducible gene-level marker of race-specific NER disparity in this dataset.</strong>
  </div>`;
  el.innerHTML = html;
}

/* ══════════════════════════════════════════════════════════
   9. OXPHOS STABILITY PANEL
   ══════════════════════════════════════════════════════════ */
function buildOxPhosPanel() {
  const el = document.getElementById('oxphos-plot');
  if (!el || !window.GSEA_DATA) return;
  const p = GSEA_DATA.pathways.find(x=>x.name==='HALLMARK_OXIDATIVE_PHOSPHORYLATION');
  if (!p) return;

  const racialComps = ['C1','C2','C11','C12'];
  const allComps = CID;
  const ci_racial = racialComps.map(c=>CID.indexOf(c));

  // Full 12-comparison bar
  Plotly.newPlot(el, [{
    x: CID,
    y: CID.map(c=>p.nes[CID.indexOf(c)]),
    type:'bar',
    marker:{ color: CID.map(c=>{
      const nes=p.nes[CID.indexOf(c)];
      return nes>0?`rgba(220,38,38,${0.5+Math.min(nes/3,1)*0.45})`:`rgba(29,78,216,${0.5+Math.min(Math.abs(nes)/3,1)*0.45})`;
    }), line:{color:CID.map(c=>racialComps.includes(c)?'#f59e0b':'transparent'),width:2.5} },
    text: CID.map(c=>(p.nes[CID.indexOf(c)]>=0?'+':'')+p.nes[CID.indexOf(c)].toFixed(2)),
    textposition:'outside',
    hovertemplate:'<b>%{x}</b><br>OxPhos NES: %{y:.3f}<extra></extra>',
    cliponaxis:false
  }], {
    xaxis:{ title:'Comparison (orange border = racial comparisons)', gridcolor:'#f1f5f9' },
    yaxis:{ title:'NES (HALLMARK_OXIDATIVE_PHOSPHORYLATION)', zeroline:true, zerolinecolor:'#94a3b8', gridcolor:'#f1f5f9' },
    shapes:[{type:'line',x0:-0.5,x1:11.5,y0:0,y1:0,line:{color:'#94a3b8',width:1}}],
    annotations:[{x:3.5,y:3.0,text:'← AA HIGHER in ALL racial comparisons →',showarrow:false,font:{size:10,color:'#dc2626',family:'Inter'}}],
    margin:{l:65,r:20,t:40,b:60}, height:340,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:'Oxidative Phosphorylation NES — Most Stable Racial Signal in Dataset',font:{size:11}}
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   10. NRF2/ANTIOXIDANT AXIS PANEL
   ══════════════════════════════════════════════════════════ */
function buildNRF2Panel() {
  const el = document.getElementById('nrf2-wrap');
  if (!el) return;
  const dl = _gwLook();
  function gv(cid,g){const d=dl[cid]&&dl[cid][g];return d?{l:d.l,f:d.f}:{l:null,f:null};}

  const genes = [
    { name:'NFE2L2',alias:'NRF2 (master TF)',cids:['C3','C4','C9','C10'] },
    { name:'HMOX1',alias:'HMOX1 (heme oxygenase)',cids:['C3','C4','C9','C10'] },
    { name:'SLC7A11',alias:'SLC7A11 (xCT, cystine)',cids:['C3','C4','C9','C10'] },
    { name:'NQO1',alias:'NQO1 (quinone reductase)',cids:['C3','C4','C9','C10'] },
    { name:'AKR1C1',alias:'AKR1C1 (aldo-keto red.)',cids:['C3','C4','C9','C10'] },
    { name:'HSPB1',alias:'HSPB1 (HSP27)',cids:['C3','C4','C9','C10'] },
  ];

  const traces = [];
  ['C3','C4','C9','C10'].forEach(cid=>{
    const col={C3:'#0891b2',C4:'#dc2626',C9:'#06b6d4',C10:'#f87171'}[cid];
    const lbl={C3:'NHW Parental Arsenic',C4:'AA Parental Arsenic',C9:'NHW Stem Arsenic',C10:'AA Stem Arsenic'}[cid];
    traces.push({
      x:genes.map(g=>g.alias), y:genes.map(g=>gv(cid,g.name).l),
      type:'bar', name:`${cid}: ${lbl}`, marker:{color:col,opacity:0.8},
      hovertemplate:'<b>%{x}</b><br>'+cid+' L2FC: %{y:.3f}<extra></extra>'
    });
  });

  Plotly.newPlot(el, traces, {
    barmode:'group',
    xaxis:{title:'',tickangle:-20,tickfont:{size:10}},
    yaxis:{title:'Shrunken log₂FC',zeroline:true,zerolinecolor:'#94a3b8',gridcolor:'#f1f5f9'},
    legend:{orientation:'h',y:-0.35},
    margin:{l:55,r:20,t:35,b:110}, height:380,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:'NRF2 Antioxidant Axis — Induced by Arsenic Across All Conditions',font:{size:11}}
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   11. HEDGEHOG / NOTCH / HYPOXIA SELF-RENEWAL PARADOX
   ══════════════════════════════════════════════════════════ */
function buildSelfRenewalPanel() {
  const el = document.getElementById('selfrenewal-plot');
  if (!el || !window.GSEA_DATA) return;

  const pws = [
    'HALLMARK_HEDGEHOG_SIGNALING','HALLMARK_NOTCH_SIGNALING',
    'HALLMARK_WNT_BETA_CATENIN_SIGNALING','HALLMARK_HYPOXIA',
    'HALLMARK_MYC_TARGETS_V1','KEGG_NUCLEOTIDE_EXCISION_REPAIR'
  ];
  const comps = ['C3','C4','C7','C8','C9','C10'];
  const compLbls = {C3:'NHW Par+Ars',C4:'AA Par+Ars',C7:'NHW Stem+Ars',C8:'AA Stem+Ars',C9:'NHW InStem+Ars',C10:'AA InStem+Ars'};
  const traces = pws.map(pn=>{
    const p=GSEA_DATA.pathways.find(x=>x.name===pn)||{nes:new Array(12).fill(0)};
    const lbl=pn.replace(/^(HALLMARK_|KEGG_)/,'').replace(/_/g,' ');
    return {
      x:comps, y:comps.map(c=>p.nes[CID.indexOf(c)]||0),
      type:'bar', name:lbl,
      hovertemplate:'<b>'+lbl+'</b><br>%{x}: NES %{y:.2f}<extra></extra>'
    };
  });

  Plotly.newPlot(el, traces, {
    barmode:'group',
    xaxis:{title:'', tickvals:comps, ticktext:comps.map(c=>compLbls[c])},
    yaxis:{title:'NES',zeroline:true,zerolinecolor:'#94a3b8',gridcolor:'#f1f5f9'},
    legend:{orientation:'h',y:-0.3,font:{size:9}},
    margin:{l:55,r:20,t:35,b:100}, height:400,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:'Self-Renewal Paradox: Stem pathways INDUCED while NER SUPPRESSED in AA stem cells',font:{size:11}}
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   12. BER vs NER RACIAL SWAP PANEL
   ══════════════════════════════════════════════════════════ */
function buildBERNERSwap() {
  const el = document.getElementById('ber-ner-plot');
  if (!el || !window.GSEA_DATA) return;

  const nerK = GSEA_DATA.pathways.find(p=>p.name==='KEGG_NUCLEOTIDE_EXCISION_REPAIR');
  const berR = GSEA_DATA.pathways.find(p=>p.name==='REACTOME_BASE_EXCISION_REPAIR');
  const nerR = GSEA_DATA.pathways.find(p=>p.name==='REACTOME_NUCLEOTIDE_EXCISION_REPAIR');
  const berK = GSEA_DATA.pathways.find(p=>p.name==='KEGG_BASE_EXCISION_REPAIR');
  if (!nerK||!berR) return;

  const stemComps=['C5','C6','C7','C8'];
  const traces=[
    {name:'KEGG NER',y:stemComps.map(c=>nerK.nes[CID.indexOf(c)]),
     marker:{color:'#1d4ed8'},hovertemplate:'KEGG NER | %{x}: NES %{y:.2f}<extra></extra>'},
    {name:'Reactome NER',y:stemComps.map(c=>(nerR?nerR.nes[CID.indexOf(c)]:0)||0),
     marker:{color:'#3b82f6'},hovertemplate:'Reactome NER | %{x}: NES %{y:.2f}<extra></extra>'},
    {name:'Reactome BER',y:stemComps.map(c=>berR.nes[CID.indexOf(c)]||0),
     marker:{color:'#dc2626'},hovertemplate:'Reactome BER | %{x}: NES %{y:.2f}<extra></extra>'},
    {name:'KEGG BER',y:stemComps.map(c=>(berK?berK.nes[CID.indexOf(c)]:0)||0),
     marker:{color:'#f87171'},hovertemplate:'KEGG BER | %{x}: NES %{y:.2f}<extra></extra>'},
  ].map(t=>({...t, x:stemComps, type:'bar',
    hovertemplate:(t.hovertemplate)}));

  Plotly.newPlot(el, traces, {
    barmode:'group',
    xaxis:{title:'',tickvals:stemComps,
      ticktext:['C5: NHW Stem Veh','C6: AA Stem Veh','C7: NHW Stem Ars','C8: AA Stem Ars']},
    yaxis:{title:'NES (stem vs parental comparison)',zeroline:true,zerolinecolor:'#94a3b8',gridcolor:'#f1f5f9'},
    legend:{orientation:'h',y:-0.3},
    margin:{l:55,r:20,t:35,b:100}, height:380,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:'BER vs NER: Racial Swap of Pathway Vulnerability in Stem Cells Under Arsenic',font:{size:11}},
    annotations:[
      {x:'C7',y:berR.nes[CID.indexOf('C7')],text:'BER elevated<br>in NHW stem',showarrow:true,arrowhead:2,font:{size:9,color:'#dc2626'},ax:40,ay:30},
      {x:'C8',y:nerK.nes[CID.indexOf('C8')],text:'NER suppressed<br>in AA stem',showarrow:true,arrowhead:2,font:{size:9,color:'#1d4ed8'},ax:-40,ay:-30},
    ]
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   13. C9/C10 WITHIN-STEM COMPARISON PANEL
   ══════════════════════════════════════════════════════════ */
function buildWithinStemPanel() {
  const el = document.getElementById('within-stem-plot');
  if (!el || !window.GSEA_DATA) return;
  const pws=[
    'HALLMARK_OXIDATIVE_PHOSPHORYLATION','HALLMARK_HEDGEHOG_SIGNALING',
    'HALLMARK_NOTCH_SIGNALING','HALLMARK_HYPOXIA','HALLMARK_MYC_TARGETS_V1',
    'KAN_RESPONSE_TO_ARSENIC_TRIOXIDE','HALLMARK_G2M_CHECKPOINT',
    'KEGG_NUCLEOTIDE_EXCISION_REPAIR'
  ];
  const labels=pws.map(n=>n.replace(/^(HALLMARK_|KEGG_|KAN_)/,'').replace(/_/g,' ').toLowerCase().replace(/\b\w/,c=>c.toUpperCase()).substring(0,30));
  const c9i=CID.indexOf('C9'),c10i=CID.indexOf('C10');
  const getNES=(pn,ci)=>{const p=GSEA_DATA.pathways.find(x=>x.name===pn);return p?(p.nes[ci]||0):0;};
  const c9vals=pws.map(p=>getNES(p,c9i));
  const c10vals=pws.map(p=>getNES(p,c10i));

  Plotly.newPlot(el,[
    {x:labels,y:c9vals,type:'bar',name:'C9: NHW Stem Arsenic vs Vehicle',
     marker:{color:'#0891b2',opacity:0.8},hovertemplate:'<b>%{x}</b><br>C9 NES: %{y:.2f}<extra></extra>'},
    {x:labels,y:c10vals,type:'bar',name:'C10: AA Stem Arsenic vs Vehicle',
     marker:{color:'#dc2626',opacity:0.8},hovertemplate:'<b>%{x}</b><br>C10 NES: %{y:.2f}<extra></extra>'},
  ],{
    barmode:'group',
    xaxis:{tickangle:-30,tickfont:{size:9.5}},
    yaxis:{title:'NES',zeroline:true,zerolinecolor:'#94a3b8',gridcolor:'#f1f5f9'},
    legend:{orientation:'h',y:-0.45},
    margin:{l:55,r:20,t:40,b:110}, height:400,
    plot_bgcolor:'#fafafa', paper_bgcolor:'#fff', font:PLOT_FONT,
    title:{text:'C9 vs C10: Within-Stem Arsenic Response (858 & 967 significant pathways respectively)',font:{size:11}},
    annotations:[{x:'Nucleotide Excision Repair',y:-0.3,text:'NER NOT sig\nin either',showarrow:false,font:{size:9,color:'#64748b'}}]
  },{responsive:true,displayModeBar:false});
}

/* ══════════════════════════════════════════════════════════
   SCROLL-TRIGGERED BUILDS (extend existing observer)
   ══════════════════════════════════════════════════════════ */
function setupViz2Observers() {
  const builds = {
    'gsea-vol-plot':   ()=>buildGSEAVolcano(),
    'c8-profile-wrap': ()=>buildC8Profile(),
    'waterfall-plot':  ()=>buildWaterfall(),
    'radar-plot':      ()=>buildRadar(),
    'bubble-plot':     ()=>buildBubble(),
    'ner-trigger-wrap':()=>buildNERTrigger(),
    'venn-wrap':       ()=>buildVenn(),
    'ner-network-svg-wrap': ()=>{
      const cid=(document.getElementById('net-comp')||{}).value||'C8';
      buildNERNetwork(cid);
    },
    'ercc1-panel':    ()=>buildERCC1Panel(),
    'oxphos-plot':    ()=>buildOxPhosPanel(),
    'nrf2-wrap':      ()=>buildNRF2Panel(),
    'selfrenewal-plot':()=>buildSelfRenewalPanel(),
    'ber-ner-plot':   ()=>buildBERNERSwap(),
    'within-stem-plot':()=>buildWithinStemPanel(),
  };
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const fn=builds[e.target.id];
      if(fn){ fn(); obs.unobserve(e.target); }
    });
  },{threshold:0.1});
  Object.keys(builds).forEach(id=>{
    const el=document.getElementById(id);
    if(el) obs.observe(el);
  });
}

/* ── Event wiring for interactive controls ─────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    setupViz2Observers();
    // Wire up selectors
    const wire=(id,fn)=>{const el=document.getElementById(id);if(el)el.onchange=fn;};
    wire('gsea-vol-comp', buildGSEAVolcano);
    wire('gsea-vol-db',   buildGSEAVolcano);
    wire('wf-comp',       buildWaterfall);
    wire('bubble-comp',   buildBubble);
    wire('net-comp',      ()=>buildNERNetwork((document.getElementById('net-comp')||{}).value||'C8'));
    // Radar checkboxes
    document.querySelectorAll('.radar-comp-cb').forEach(cb=>cb.onchange=buildRadar);
  },800);
});
