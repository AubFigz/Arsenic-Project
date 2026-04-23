/* ══════════════════════════════════════════════════════════
   enhancements.js  —  All 14 new features for the interactive
   Arsenic & Breast Cancer Explorer website
   ══════════════════════════════════════════════════════════ */

/* ── Sig pathway counts per comparison (|NES|>1.5 & FDR<0.25) ─ */
const SIG_COUNTS = {C1:71,C2:57,C3:705,C4:334,C5:900,C6:877,C7:936,C8:962,C9:858,C10:967,C11:582,C12:503};

/* ── PCA simulated data (from paper: PC1=81% variance, stem vs parental) ── */
const PCA_DATA = [
  // NHW Parental Vehicle (n=3)
  {x:-2.83,y:1.18,g:'NHW Parental Vehicle',col:'#0891b2',sym:'circle',n:1},
  {x:-2.61,y:1.07,g:'NHW Parental Vehicle',col:'#0891b2',sym:'circle',n:2},
  {x:-2.74,y:0.96,g:'NHW Parental Vehicle',col:'#0891b2',sym:'circle',n:3},
  // NHW Parental Arsenic (n=3)
  {x:-2.41,y:1.46,g:'NHW Parental Arsenic',col:'#06b6d4',sym:'square',n:1},
  {x:-2.27,y:1.31,g:'NHW Parental Arsenic',col:'#06b6d4',sym:'square',n:2},
  {x:-2.35,y:1.52,g:'NHW Parental Arsenic',col:'#06b6d4',sym:'square',n:3},
  // AA Parental Vehicle (n=3)
  {x:-2.52,y:-0.84,g:'AA Parental Vehicle',col:'#dc2626',sym:'circle',n:1},
  {x:-2.68,y:-0.97,g:'AA Parental Vehicle',col:'#dc2626',sym:'circle',n:2},
  {x:-2.61,y:-0.91,g:'AA Parental Vehicle',col:'#dc2626',sym:'circle',n:3},
  // AA Parental Arsenic (n=3) — converging toward NHW (68% DEG collapse)
  {x:-1.92,y:-0.63,g:'AA Parental Arsenic',col:'#f87171',sym:'square',n:1},
  {x:-2.04,y:-0.71,g:'AA Parental Arsenic',col:'#f87171',sym:'square',n:2},
  {x:-1.83,y:-0.55,g:'AA Parental Arsenic',col:'#f87171',sym:'square',n:3},
  // NHW Stem Vehicle (n=1)
  {x:2.73,y:1.13,g:'NHW Stem Vehicle',col:'#0891b2',sym:'diamond',n:1},
  // NHW Stem Arsenic (n=1)
  {x:2.48,y:0.82,g:'NHW Stem Arsenic',col:'#06b6d4',sym:'cross',n:1},
  // AA Stem Vehicle (n=1)
  {x:2.29,y:-1.54,g:'AA Stem Vehicle',col:'#dc2626',sym:'diamond',n:1},
  // AA Stem Arsenic (n=1) — diverging from NHW (10x amplification)
  {x:2.61,y:-2.17,g:'AA Stem Arsenic ★',col:'#991b1b',sym:'cross',n:1},
];

/* ── Inflammatory gene leading edges ── */
const INFLAM_CORE = ['ICAM1','IL1A','IL1R1','IL7R','IFITM1','LYN','TLR3','NAMPT','ADORA2B','BDKRB1','CD82','CXCL6']; // Shared C1 & C11 — 23 core genes, 12 shown in Fig 4B
const INFLAM_STEM = ['IL6','CXCL8','CCL2','CCL20','NFKBIA','IRAK2']; // C11-only stem gains (Fig 4B)
const INFLAM_ARS  = ['AHR','HIF1A','TNF','NFKB1','STAT3']; // C1-only or additional

/* ── XPC paradox data ── */
const XPC_PARADOX = {
  label: 'XPC Induction Under Arsenic — Parental Cells',
  AA:  {l2fc: 0.78, fdr: 0.0003, desc: 'Strong compensatory induction'},
  NHW: {l2fc: 0.03, fdr: 0.87,   desc: 'No significant response'},
  stemAA: {l2fc: -0.45, fdr: 0.016, desc: 'Suppressed in stem cells'},
};

/* ═══════════════════════════════════════════════════════════════
   GENE INFO POPUP SYSTEM
   ══════════════════════════════════════════════════════════════*/
function showGenePopup(geneName, anchorEl) {
  const info = (window.GENE_INFO || {})[geneName];
  const catMap = {ner:'NER / DNA Repair',stem:'Stemness / EMT',arsenic:'Arsenic Response',inflam:'Inflammatory',other:'Other'};
  const catCol = {ner:'#1d4ed8',stem:'#db2777',arsenic:'#16a34a',inflam:'#d97706',other:'#64748b'};
  const cat = info ? info.category : 'other';
  const col = catCol[cat] || '#64748b';
  let html = `<div class="gpop-header" style="border-left:4px solid ${col};padding-left:.7rem;margin-bottom:.8rem;">
    <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
      <span style="font-size:1.25rem;font-weight:800;color:${col};">${geneName}</span>
      <span style="font-size:.72rem;background:${col}1a;color:${col};padding:.15rem .45rem;border-radius:4px;font-weight:600;">${catMap[cat]||cat}</span>
    </div>
    ${info ? `<div style="font-size:.83rem;color:#475569;margin-top:.15rem;font-style:italic;">${info.fullName}</div>` : ''}
  </div>`;
  if (info) {
    html += `<p style="font-size:.84rem;line-height:1.6;color:#1e293b;margin-bottom:.85rem;">${info.summary}</p>`;
    const sections = [
      {icon:'🔬',label:'Cancer Connection',key:'cancerLink',bg:'#fee2e2',col:'#991b1b'},
      {icon:'🌱',label:'Stem Cell Role',key:'stemLink',bg:'#dbeafe',col:'#1e40af'},
      {icon:'⚗️',label:'Arsenic Interaction',key:'arsenicLink',bg:'#dcfce7',col:'#14532d'},
    ];
    sections.forEach(s => {
      if (info[s.key]) {
        html += `<div style="background:${s.bg};border-radius:8px;padding:.6rem .85rem;margin-bottom:.5rem;">
          <div style="font-size:.71rem;font-weight:700;color:${s.col};text-transform:uppercase;letter-spacing:.05em;margin-bottom:.2rem;">${s.icon} ${s.label}</div>
          <div style="font-size:.82rem;color:#1e293b;line-height:1.55;">${info[s.key]}</div>
        </div>`;
      }
    });
    // Mini L2FC bar across comparisons
    html += buildMiniL2FC(geneName);
  } else {
    html += `<p style="font-size:.84rem;color:#64748b;font-style:italic;">Detailed annotation not yet available for this gene. Use Gene Browser to view L2FC values across all 12 comparisons.</p>`;
    html += buildMiniL2FC(geneName);
  }
  // Leading edge membership
  const leSets = (typeof GENE_TO_LE !== 'undefined' && GENE_TO_LE[geneName]) ? GENE_TO_LE[geneName] : [];
  const leSetData = (typeof LE_SETS !== 'undefined') ? LE_SETS : {};
  if (leSets.length > 0) {
    const DB_COL_POP = { Hallmark:'#1d4ed8', KEGG:'#d97706', Reactome:'#16a34a', CGP:'#7c3aed' };
    html += `<div style="margin-top:.8rem;padding-top:.7rem;border-top:1px solid #f1f5f9;">
      <div style="font-size:.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;">Leading Edge Membership</div>
      <div style="display:flex;flex-wrap:wrap;gap:.3rem;">
        ${leSets.map(k => {
          const s = leSetData[k];
          if (!s) return '';
          const dbC = DB_COL_POP[s.db] || '#64748b';
          const isSig = !s.notSig;
          return `<span style="background:${dbC}18;color:${dbC};border:1px solid ${dbC}40;border-radius:4px;
            padding:.15rem .45rem;font-size:.72rem;font-weight:700;display:inline-flex;align-items:center;gap:.25rem;">
            ${isSig ? '★' : '⚠'} ${s.comparison} ${s.db}
            <span style="font-weight:400;opacity:.7;">${(s.nes>0?'+':'')+s.nes.toFixed(2)}</span>
          </span>`;
        }).join('')}
      </div>
    </div>`;
  }
  html += `<div style="margin-top:.9rem;text-align:right;">
    <button class="btn btn-p" style="font-size:.78rem;padding:.3rem .75rem;" onclick="setG('${geneName}');closeGPop();">View in Gene Browser →</button>
    <button class="btn btn-o" style="font-size:.78rem;padding:.3rem .75rem;margin-left:.3rem;" onclick="closeGPop()">Close</button>
  </div>`;
  document.getElementById('gpop-content').innerHTML = html;
  document.getElementById('gpop-modal').classList.add('open');
}

function buildMiniL2FC(geneName) {
  if (typeof deseqLook === 'undefined') return '';
  let maxA = 0;
  const vals = CID.map(c => {
    const gd = deseqLook[c] && deseqLook[c][geneName];
    const l = gd ? gd.l : null; const f = gd ? gd.f : null;
    if (l != null) maxA = Math.max(maxA, Math.abs(l));
    return {c,l,f};
  });
  if (!vals.some(v => v.l != null)) return '';
  maxA = Math.max(maxA, 0.5);
  let html = `<div style="margin-top:.75rem;border-top:1px solid #e2e8f0;padding-top:.6rem;">
    <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:#64748b;margin-bottom:.4rem;">Log₂FC across 12 comparisons</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.18rem .9rem;">`;
  vals.forEach(({c,l,f}) => {
    const pct = l != null ? Math.abs(l)/maxA*45 : 0;
    const isPos = l != null && l >= 0;
    const sig = f != null && f < 0.05;
    const ls = l != null ? (l >= 0 ? '+' : '') + l.toFixed(2) : 'n/a';
    html += `<div style="display:grid;grid-template-columns:32px 1fr 44px;align-items:center;gap:.25rem;">
      <span style="font-size:.68rem;font-weight:600;color:${CCOL[c]};">${c}</span>
      <div style="background:#f1f5f9;border-radius:3px;height:9px;position:relative;">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#94a3b8;"></div>
        ${l != null ? `<div style="position:absolute;top:0;height:100%;border-radius:3px;background:${isPos?'#ef4444':'#3b82f6'};${isPos?`left:50%;width:${pct}%`:`right:50%;width:${pct}%`};opacity:${sig?1:.45};"></div>` : ''}
      </div>
      <span style="font-size:.67rem;font-family:monospace;color:${isPos?'#dc2626':'#1d4ed8'};font-weight:${sig?700:400};text-align:right;">${ls}</span>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function closeGPop() {
  document.getElementById('gpop-modal').classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════════
   PATHWAY INFO POPUP — enrich existing modal
   ══════════════════════════════════════════════════════════════*/
function enrichPathwayModal(pname) {
  const info = (window.PATHWAY_INFO || {})[pname];
  if (!info) return;
  const el = document.getElementById('m-info-extra');
  if (!el) return;
  el.innerHTML = `<div style="margin-top:.8rem;padding-top:.8rem;border-top:1px solid #e2e8f0;">
    <div style="font-size:.71rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.35rem;">Pathway Overview</div>
    <p style="font-size:.82rem;color:#1e293b;line-height:1.6;margin-bottom:.55rem;">${info.summary}</p>
    ${info.studyContext ? `<div style="background:#fef3c7;border-radius:7px;padding:.55rem .8rem;margin-bottom:.45rem;">
      <div style="font-size:.7rem;font-weight:700;color:#92400e;margin-bottom:.15rem;">📊 Study Context</div>
      <div style="font-size:.8rem;color:#1e293b;line-height:1.55;">${info.studyContext}</div>
    </div>` : ''}
    ${info.clinicalRelevance ? `<div style="background:#dbeafe;border-radius:7px;padding:.55rem .8rem;">
      <div style="font-size:.7rem;font-weight:700;color:#1e40af;margin-bottom:.15rem;">🏥 Clinical Relevance</div>
      <div style="font-size:.8rem;color:#1e293b;line-height:1.55;">${info.clinicalRelevance}</div>
    </div>` : ''}
  </div>`;
}

/* Override openModal to add pathway info */
const _origOpenModal = (typeof openModal !== 'undefined') ? openModal : null;
window.openModal = function(pname, ci) {
  if (_origOpenModal) _origOpenModal(pname, ci);
  setTimeout(() => enrichPathwayModal(pname), 50);
};

/* ═══════════════════════════════════════════════════════════════
   1. SIGNIFICANT PATHWAY COUNT BAR CHART (Plotly animated)
   ══════════════════════════════════════════════════════════════*/
function buildSigChart() {
  const el = document.getElementById('sig-chart');
  if (!el || !window.GSEA_DATA) return;

  // Compute direction split from live GSEA data
  const posCount = {}, negCount = {};
  CID.forEach(c => {
    const ci = CID.indexOf(c);
    const sigPWs = window.GSEA_DATA.pathways.filter(p => p.sig[ci]);
    posCount[c] = sigPWs.filter(p => p.nes[ci] > 0).length;
    negCount[c] = sigPWs.filter(p => p.nes[ci] < 0).length;
  });

  // Color coding: NES>0 = numerator-enriched (red = AA or arsenic/stem numerator)
  //               NES<0 = denominator-enriched (blue = NHW or parental/vehicle denominator)
  // For racial comparisons (C1,C2,C11,C12): numerator=AA → red; denominator=NHW → blue
  // For arsenic comparisons (C3,C4,C9,C10): numerator=arsenic → red; denominator=vehicle → blue
  // For stem comparisons (C5,C6,C7,C8): numerator=stem → red; denominator=parental → blue
  const posColor = '#dc2626'; // red — numerator always
  const negColor = '#1d4ed8'; // blue — denominator always

  const posHoverLabel = c => {
    if (['C1','C2','C11','C12'].includes(c)) return 'AA-enriched';
    if (['C3','C4','C9','C10'].includes(c)) return 'Arsenic-induced';
    return 'Stem-enriched';
  };
  const negHoverLabel = c => {
    if (['C1','C2','C11','C12'].includes(c)) return 'NHW-enriched';
    if (['C3','C4','C9','C10'].includes(c)) return 'Vehicle-higher';
    return 'Parental-higher';
  };

  Plotly.newPlot(el, [
    {
      x: CID.map(c => posCount[c]),
      y: CID,
      type: 'bar', orientation: 'h',
      name: '▲ Numerator-enriched (NES > 0) — AA / Arsenic / Stem',
      marker: { color: posColor, opacity: 0.82 },
      text: CID.map(c => posCount[c] > 0 ? posCount[c] : ''),
      textposition: 'inside', insidetextanchor: 'middle',
      textfont: {color: '#fff', size: 10},
      hovertemplate: '<b>%{y}</b><br>' + CID.map(c => posHoverLabel(c) + ': <b>%{x}</b>').join('<br>') + '<extra></extra>',
      customdata: CID.map(c => posHoverLabel(c)),
      hovertemplate: '<b>%{y}</b><br>%{customdata}: <b>%{x}</b> pathways<extra></extra>',
      cliponaxis: false,
    },
    {
      x: CID.map(c => negCount[c]),
      y: CID,
      type: 'bar', orientation: 'h',
      name: '▼ Denominator-enriched (NES < 0) — NHW / Vehicle / Parental',
      marker: { color: negColor, opacity: 0.60 },
      text: CID.map(c => negCount[c] > 0 ? negCount[c] : ''),
      textposition: 'inside', insidetextanchor: 'middle',
      textfont: {color: '#fff', size: 10},
      customdata: CID.map(c => negHoverLabel(c)),
      hovertemplate: '<b>%{y}</b><br>%{customdata}: <b>%{x}</b> pathways<extra></extra>',
      cliponaxis: false,
    }
  ], {
    barmode: 'stack',
    xaxis: {title: 'Significant pathways (|NES| > 1.5, FDR < 0.25)', gridcolor: '#f1f5f9', zeroline: false, range: [0, 1200]},
    yaxis: {autorange: 'reversed', tickfont: {size: 11}},
    margin: {l: 55, r: 90, t: 30, b: 65},
    height: 360,
    plot_bgcolor: '#fafafa', paper_bgcolor: '#fff',
    font: {family: 'Inter, sans-serif', size: 11},
    legend: {orientation: 'h', y: -0.22, font: {size: 10}},
    title: {text: 'Red = AA/Arsenic/Stem-enriched  ·  Blue = NHW/Vehicle/Parental-enriched', font: {size: 9.5, color: '#64748b'}, x: 0},
    shapes: [
      {type:'line',x0:71,x1:71,y0:-0.5,y1:11.5,line:{color:'#7c3aed',dash:'dot',width:1.5}},
    ],
    annotations: [
      {x:71,y:0,text:'Racial\nbaseline',showarrow:false,font:{size:9,color:'#7c3aed'},xanchor:'left',yanchor:'bottom'},
      {x:(posCount['C2']||0)+(negCount['C2']||0),y:'C2',
        text:' ← 100% NHW-enriched (arsenic paradox)',
        showarrow:false,font:{size:9,color:'#1d4ed8'},xanchor:'left',xshift:4},
      {x:(posCount['C3']||0)+(negCount['C3']||0),y:'C3',
        text:' 2.1× more than C4 → NHW more arsenic-primed',
        showarrow:false,font:{size:8.5,color:'#0891b2'},xanchor:'left',xshift:4},
    ]
  }, {responsive: true, displayModeBar: false});
}

/* ═══════════════════════════════════════════════════════════════
   2. CONVERGENCE / DIVERGENCE PANEL (Animated SVG)
   ══════════════════════════════════════════════════════════════*/
function buildConvergence() {
  const el = document.getElementById('convergence-wrap');
  if (!el) return;
  el.innerHTML = `<svg viewBox="0 0 760 280" style="width:100%;font-family:Inter,sans-serif;" id="conv-svg">
    <!-- Title -->
    <text x="380" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">The Arsenic Paradox: Convergence in Bulk, Divergence in Stem Cells</text>

    <!-- PARENTAL SIDE -->
    <rect x="15" y="38" width="340" height="228" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="185" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">PARENTAL CELLS</text>

    <!-- AA parental line -->
    <circle cx="55" cy="95" r="18" fill="#fecaca" stroke="#dc2626" stroke-width="2" class="conv-node" id="cn-aa-p"/>
    <text x="55" y="99" text-anchor="middle" font-size="9" font-weight="700" fill="#dc2626">AA</text>
    <text x="55" y="122" text-anchor="middle" font-size="9" fill="#64748b">7,355 DEGs</text>

    <!-- NHW parental line -->
    <circle cx="55" cy="195" r="18" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2" class="conv-node" id="cn-nhw-p"/>
    <text x="55" y="199" text-anchor="middle" font-size="9" font-weight="700" fill="#1d4ed8">NHW</text>

    <!-- Convergence arrows -->
    <path id="conv-arr-aa"  d="M 75 95  Q 200 130 295 145" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-dasharray="0 400" marker-end="url(#arr2)" opacity="0.85"/>
    <path id="conv-arr-nhw" d="M 75 195 Q 200 165 295 150" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-dasharray="0 400" marker-end="url(#arr2)" opacity="0.85"/>

    <!-- Merged circle -->
    <circle cx="320" cy="147" r="26" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" id="conv-merged" opacity="0"/>
    <text x="320" y="143" text-anchor="middle" font-size="8.5" font-weight="700" fill="#475569" id="conv-merged-t1" opacity="0">2,328</text>
    <text x="320" y="155" text-anchor="middle" font-size="8" fill="#64748b" id="conv-merged-t2" opacity="0">DEGs</text>
    <text x="320" y="185" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626" id="conv-pct" opacity="0">−68%</text>
    <text x="320" y="198" text-anchor="middle" font-size="9" fill="#64748b" id="conv-pct2" opacity="0">racial collapse</text>

    <!-- STEM SIDE -->
    <rect x="405" y="38" width="340" height="228" rx="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
    <text x="575" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">STEM CELLS</text>

    <!-- AA stem -->
    <circle cx="450" cy="95" r="18" fill="#fecaca" stroke="#dc2626" stroke-width="2" class="div-node" id="dn-aa"/>
    <text x="450" y="99" text-anchor="middle" font-size="9" font-weight="700" fill="#dc2626">AA</text>

    <!-- NHW stem -->
    <circle cx="450" cy="195" r="18" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2" class="div-node" id="dn-nhw"/>
    <text x="450" y="199" text-anchor="middle" font-size="9" font-weight="700" fill="#1d4ed8">NHW</text>

    <!-- Divergence arrows -->
    <path id="div-arr-aa"  d="M 470 95  Q 560 80  680 60"  stroke="#dc2626" stroke-width="2.5" fill="none" stroke-dasharray="0 400" marker-end="url(#arr2)" opacity="0.85"/>
    <path id="div-arr-nhw" d="M 470 195 Q 560 210 680 228" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-dasharray="0 400" marker-end="url(#arr2)" opacity="0.85"/>

    <!-- AA stem endpoint (suppressed NER) -->
    <circle cx="700" cy="54" r="26" fill="#fecaca" stroke="#dc2626" stroke-width="2.5" id="div-aa-end" opacity="0"/>
    <text x="700" y="48" text-anchor="middle" font-size="7.5" font-weight="700" fill="#dc2626" id="div-aa-t1" opacity="0">NER ↓↓</text>
    <text x="700" y="59" text-anchor="middle" font-size="7" fill="#64748b" id="div-aa-t2" opacity="0">962 pathways</text>
    <text x="700" y="69" text-anchor="middle" font-size="7" fill="#64748b" id="div-aa-t3" opacity="0">NES=−2.75</text>

    <!-- NHW stem endpoint (NER maintained) -->
    <circle cx="700" cy="230" r="26" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5" id="div-nhw-end" opacity="0"/>
    <text x="700" y="224" text-anchor="middle" font-size="7.5" font-weight="700" fill="#1d4ed8" id="div-nhw-t1" opacity="0">NER ✓</text>
    <text x="700" y="235" text-anchor="middle" font-size="7" fill="#64748b" id="div-nhw-t2" opacity="0">936 pathways</text>
    <text x="700" y="245" text-anchor="middle" font-size="7" fill="#64748b" id="div-nhw-t3" opacity="0">NES=+0.86</text>

    <!-- 10x badge -->
    <rect x="540" y="118" width="70" height="36" rx="8" fill="#92400e" id="tenfold-badge" opacity="0"/>
    <text x="575" y="133" text-anchor="middle" font-size="11" font-weight="800" fill="white" id="tenfold-t1" opacity="0">10×</text>
    <text x="575" y="146" text-anchor="middle" font-size="8" fill="#fef3c7" id="tenfold-t2" opacity="0">amplification</text>

    <!-- Labels -->
    <text x="185" y="255" text-anchor="middle" font-size="9" fill="#64748b">Arsenic homogenizes bulk transcriptomes</text>
    <text x="575" y="265" text-anchor="middle" font-size="9" fill="#92400e">Arsenic reveals hidden racial biology in stem cells</text>

    <defs>
      <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#64748b"/>
      </marker>
    </defs>
  </svg>`;
  // Append C2 directional uniformity insight box
  const insightBox = document.createElement('div');
  insightBox.style.cssText = 'margin-top:.9rem;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;padding:1rem;border-left:4px solid #1d4ed8;';
  insightBox.innerHTML = `<div style="font-size:.78rem;font-weight:700;color:#1e3a8a;margin-bottom:.3rem;">&#9889; Striking directional uniformity in C2</div>
    <div style="font-size:.8rem;color:#1e40af;line-height:1.55;">Under arsenic, all 57 remaining significant racial pathways are enriched in the <strong>NHW direction</strong> &mdash; zero in the AA direction. Arsenic does not just reduce racial differences; it <em>reorients them entirely</em>.</div>`;
  el.appendChild(insightBox);
  // Gene reversal panel
  const reversalDiv = document.createElement('div');
  reversalDiv.innerHTML = `
<div style="margin-top:.9rem;background:#fdf4ff;border:1.5px solid #e9d5ff;border-radius:10px;padding:1rem;border-left:4px solid #7c3aed;">
  <div style="font-size:.78rem;font-weight:700;color:#6d28d9;margin-bottom:.5rem;">Gene-Level Convergence: Direction Reversals Under Arsenic</div>
  <div style="font-size:.77rem;color:#475569;margin-bottom:.6rem;">Three genes that are higher in AA at baseline (C1) reverse direction under arsenic (C2) — illustrating the gene-level reorientation:</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;">
    <div style="background:#fff;border-radius:8px;padding:.6rem;border:1px solid #e9d5ff;text-align:center;">
      <div style="font-weight:700;font-size:.85rem;color:#7c3aed;cursor:pointer;" onclick="showGenePopup&&showGenePopup('ALDH1A3',this)">ALDH1A3</div>
      <div style="font-size:.72rem;color:#16a34a;margin-top:.2rem;">C1: ▲ Higher in AA</div>
      <div style="font-size:.72rem;color:#dc2626;">C2: ▼ Reverses under arsenic</div>
    </div>
    <div style="background:#fff;border-radius:8px;padding:.6rem;border:1px solid #e9d5ff;text-align:center;">
      <div style="font-weight:700;font-size:.85rem;color:#7c3aed;cursor:pointer;" onclick="showGenePopup&&showGenePopup('SNAI2',this)">SNAI2</div>
      <div style="font-size:.72rem;color:#16a34a;margin-top:.2rem;">C1: ▲ Higher in AA</div>
      <div style="font-size:.72rem;color:#dc2626;">C2: ▼ Reverses under arsenic</div>
    </div>
    <div style="background:#fff;border-radius:8px;padding:.6rem;border:1px solid #e9d5ff;text-align:center;">
      <div style="font-weight:700;font-size:.85rem;color:#7c3aed;cursor:pointer;" onclick="showGenePopup&&showGenePopup('TGFBR1',this)">TGFBR1</div>
      <div style="font-size:.72rem;color:#16a34a;margin-top:.2rem;">C1: ▲ Higher in AA</div>
      <div style="font-size:.72rem;color:#dc2626;">C2: ▼ Reverses under arsenic</div>
    </div>
  </div>
  <div style="font-size:.73rem;color:#6d28d9;margin-top:.5rem;">These reversals confirm that arsenic does not simply mute racial differences — it actively reorients the AA transcriptional program toward the NHW profile.</div>
</div>`;
  el.appendChild(reversalDiv);
  // Animate on load with delays
  animateConvergence();
}

function animateConvergence() {
  function animPath(id, dur, delay) {
    const el = document.getElementById(id);
    if (!el) return;
    const len = el.getTotalLength ? el.getTotalLength() : 300;
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.style.transition = `stroke-dashoffset ${dur}ms ease ${delay}ms`;
    setTimeout(() => { el.style.strokeDashoffset = 0; }, 50);
  }
  function fadeIn(id, delay) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = `opacity 400ms ease ${delay}ms`;
    setTimeout(() => { el.setAttribute('opacity','1'); }, 50);
  }
  animPath('conv-arr-aa',  700, 200);
  animPath('conv-arr-nhw', 700, 400);
  ['conv-merged','conv-merged-t1','conv-merged-t2','conv-pct','conv-pct2'].forEach((id,i) => fadeIn(id, 900+i*80));
  animPath('div-arr-aa',  700, 1200);
  animPath('div-arr-nhw', 700, 1400);
  ['div-aa-end','div-aa-t1','div-aa-t2','div-aa-t3','div-nhw-end','div-nhw-t1','div-nhw-t2','div-nhw-t3'].forEach((id,i) => fadeIn(id, 1900+i*60));
  ['tenfold-badge','tenfold-t1','tenfold-t2'].forEach((id,i) => fadeIn(id, 2400+i*80));
}

/* ═══════════════════════════════════════════════════════════════
   3. PCA PLOT (Plotly, simulated from paper description)
   ══════════════════════════════════════════════════════════════*/
function buildPCA() {
  const el = document.getElementById('pca-plot');
  if (!el) return;
  const groups = [...new Set(PCA_DATA.map(d => d.g))];
  const traces = groups.map(g => {
    const pts = PCA_DATA.filter(d => d.g === g);
    return {
      x: pts.map(d => d.x), y: pts.map(d => d.y),
      mode: 'markers',
      name: g,
      text: pts.map(d => `${d.g} (rep ${d.n})`),
      hovertemplate: '<b>%{text}</b><br>PC1: %{x:.2f}<br>PC2: %{y:.2f}<extra></extra>',
      marker: {
        color: pts[0].col, size: pts[0].sym === 'cross' ? 14 : (pts[0].sym === 'diamond' ? 14 : 11),
        symbol: pts.map(d => d.sym),
        line: {color: '#fff', width: 1.5},
        opacity: 0.9
      }
    };
  });
  Plotly.newPlot(el, traces, {
    xaxis: {title: 'PC1 (81% variance) — Stem ← → Parental', zeroline: false, gridcolor: '#f1f5f9'},
    yaxis: {title: 'PC2 — AA ↑ ↓ NHW', zeroline: false, gridcolor: '#f1f5f9'},
    legend: {orientation: 'h', y: -0.25, font: {size: 10}},
    margin: {l: 60, r: 20, t: 30, b: 100},
    height: 380,
    plot_bgcolor: '#fafafa', paper_bgcolor: '#fff',
    font: {family: 'Inter, sans-serif', size: 11},
    shapes: [
      {type:'rect',x0:-0.5,x1:0.5,y0:-3,y1:3,fillcolor:'#f8fafc',layer:'below',line:{width:0}},
      {type:'line',x0:0,x1:0,y0:-3,y1:3,line:{color:'#cbd5e1',dash:'dot',width:1}},
    ],
    annotations: [
      {x:2.7,y:0,text:'STEM →',showarrow:false,font:{size:10,color:'#64748b'}},
      {x:-2.7,y:0,text:'← PARENTAL',showarrow:false,font:{size:10,color:'#64748b'}},
      {text:'⚠ Schematic representation — PC coordinates are illustrative only',showarrow:false,x:0.5,y:-0.18,xref:'paper',yref:'paper',font:{size:10,color:'#94a3b8',style:'italic'},xanchor:'center'},
    ]
  }, {responsive: true, displayModeBar: false});
}

/* ═══════════════════════════════════════════════════════════════
   4. NER GENE CROSS-COMPARISON HEATMAP
   ══════════════════════════════════════════════════════════════*/
const NER_GENES_HM = [
  'ERCC1','XPC','DDB1','CETN2','RAD23A','CDK7','CCNH','GTF2H1',
  'ERCC3','ERCC5','ERCC6','XPA','RPA2','RPA3',
  'PCNA','RFC2','LIG1','POLD1','POLE','COPS5'
];

function buildNERGeneHM() {
  const el = document.getElementById('ner-gene-hm');
  if (!el || typeof deseqLook === 'undefined') return;
  let maxA = 0;
  const matrix = NER_GENES_HM.map(g => CID.map(c => {
    const gd = deseqLook[c] && deseqLook[c][g];
    const l = gd ? gd.l : null;
    if (l != null) maxA = Math.max(maxA, Math.abs(l));
    return {l, f: gd ? gd.f : null};
  }));
  maxA = Math.max(maxA, 0.5);

  let html = `<div style="overflow-x:auto;"><div style="display:inline-grid;grid-template-columns:110px repeat(12,52px);min-width:740px;">`;
  // Header
  html += `<div style="display:flex;align-items:flex-end;height:60px;font-size:.7rem;font-weight:700;color:#64748b;padding-right:.3rem;">Gene</div>`;
  CID.forEach(c => {
    html += `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:60px;padding:.3rem .1rem;">
      <div style="writing-mode:vertical-lr;transform:rotate(180deg);font-size:.63rem;font-weight:700;color:${CCOL[c]};">${c}</div>
    </div>`;
  });
  // Rows
  NER_GENES_HM.forEach((g, gi) => {
    html += `<div style="display:flex;align-items:center;height:32px;font-size:.77rem;font-weight:600;color:#1e293b;padding-right:.4rem;cursor:pointer;white-space:nowrap;"
      onclick="showGenePopup('${g}',this)" title="Click for gene info">${g}</div>`;
    matrix[gi].forEach(({l, f}, ci) => {
      const sig = f != null && f < 0.05;
      const bg = l2fCol(l);
      const tc = l != null && Math.abs(l) > 0.5 ? 'white' : '#374151';
      const ls = l != null ? (l >= 0 ? '+' : '') + l.toFixed(2) : '';
      const fs = f != null ? (f < 0.001 ? '<.001' : f.toFixed(3)) : 'n/a';
      html += `<div style="height:30px;margin:1px;border-radius:4px;background:${bg};display:flex;align-items:center;justify-content:center;cursor:pointer;
        ${sig ? 'outline:2.5px solid #f59e0b;outline-offset:-2px;' : ''}
        transition:transform .1s;"
        onclick="showGenePopup('${g}',this)"
        onmouseenter="showHMGTip(event,'${g}','${CID[ci]}',${l != null ? l : 'null'},'${fs}')"
        onmouseleave="hideTip()"
        title="${g} | ${CID[ci]}: L2FC=${ls}, FDR=${fs}">
        <span style="color:${tc};font-size:.65rem;font-weight:${sig?700:400};">${ls}</span>
      </div>`;
    });
  });
  html += `</div></div>`;
  html += `<div style="display:flex;gap:1.5rem;align-items:center;margin-top:.7rem;flex-wrap:wrap;font-size:.77rem;color:#64748b;">
    <div style="display:flex;align-items:center;gap:.35rem;"><div style="width:18px;height:11px;border:2px solid #f59e0b;border-radius:3px;background:#fef3c7;"></div>FDR &lt; 0.05</div>
    <div style="display:flex;align-items:center;gap:.35rem;"><div class="nesbar" style="display:flex;align-items:center;gap:.4rem;"><span>Suppressed</span><div style="width:90px;height:10px;border-radius:3px;background:linear-gradient(to right,#1d4ed8,#93c5fd,white,#fca5a5,#dc2626);"></div><span>Induced</span></div></div>
    <span style="font-size:.74rem;">Click any gene name or cell for details</span>
  </div>`;
  el.innerHTML = html;
}

function showHMGTip(e, gene, comp, l2fc, fdr) {
  const t = document.getElementById('hm-tip');
  if (!t) return;
  const ls = l2fc != null ? (l2fc >= 0 ? '+' : '') + l2fc.toFixed(3) : 'n/a';
  t.innerHTML = `<strong>${gene}</strong> in ${comp}<br>L2FC: <strong>${ls}</strong> &nbsp; FDR: <strong>${fdr}</strong><br><em style="font-size:.7rem;opacity:.7">Click for gene details</em>`;
  t.style.display = 'block';
  t.style.left = (e.clientX + 12) + 'px';
  t.style.top = (e.clientY - 10) + 'px';
}

/* ═══════════════════════════════════════════════════════════════
   5. INFLAMMATORY GENE PANEL (SVG, similar to NER diagram)
   ══════════════════════════════════════════════════════════════*/
function buildInflamPanel(cid) {
  const el = document.getElementById('inflam-wrap');
  if (!el || typeof deseqLook === 'undefined') return;
  const gs = deseqLook[cid] || {};
  function gd(name) { const d = gs[name]; return {l: d?d.l:null, f: d?d.f:null}; }
  function gb(x, y, w, h, name) {
    const d = gd(name);
    const bg = l2fCol(d.l);
    const tc = d.l != null && Math.abs(d.l) > 0.6 ? 'white' : '#1e293b';
    const st = d.f != null && d.f < 0.05 ? '#f59e0b' : '#94a3b8';
    const sw = d.f != null && d.f < 0.05 ? '2.5' : '1';
    const da = d.f != null && d.f < 0.05 ? 'stroke-dasharray="5 2"' : '';
    const lv = d.l != null ? (d.l >= 0 ? '+' : '') + d.l.toFixed(2) : '';
    return `<g transform="translate(${x},${y})" style="cursor:pointer;" onclick="showGenePopup('${name}',this)">
      <title>${name}: L2FC=${lv||'n/a'}, FDR=${d.f != null ? d.f.toFixed(3) : 'n/a'} — Click for gene info</title>
      <rect width="${w}" height="${h}" rx="5" fill="${bg}" stroke="${st}" stroke-width="${sw}" ${da}/>
      <text x="${w/2}" y="${h/2-(lv?4:0)}" text-anchor="middle" dominant-baseline="middle" font-size="9.5" font-weight="700" fill="${tc}">${name}</text>
      ${lv ? `<text x="${w/2}" y="${h/2+8}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="${tc}" opacity=".9">${lv}</text>` : ''}
    </g>`;
  }
  function group(x, y, w, h, lbl, genes, cols, fill, stroke) {
    const bw = Math.floor((w-8)/cols)-2, bh = 34;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
    <text x="${x+w/2}" y="${y+14}" text-anchor="middle" font-size="9" font-weight="700" fill="#475569">${lbl}</text>`;
    genes.forEach((g, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      s += gb(x+4+col*(bw+2), y+18+row*(bh+3), bw, bh, g);
    });
    return s;
  }
  const W = 960, H = 330;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;font-family:Inter,sans-serif;" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arr-i" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker></defs>`;
  // Core shared (C1 & C11)
  s += group(10, 10, 420, 130, 'Shared C1 & C11 — 23 Core NHW-Higher Genes (12 shown)', INFLAM_CORE, 4, '#fff1f2', '#fecdd3');
  // C11-only gains
  s += group(440, 10, 290, 130, 'C11-Only — Stemness-Amplified (IL6, CCL2, NFκB axis)', INFLAM_STEM, 3, '#fff7ed', '#fed7aa');
  // C1-only / Additional
  s += group(740, 10, 210, 130, 'C1-Only / Additional', INFLAM_ARS, 2, '#f5f3ff', '#ddd6fe');
  // Bottom: OxPhos context
  s += `<rect x="10" y="152" width="940" height="80" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
  <text x="480" y="170" text-anchor="middle" font-size="10" font-weight="700" fill="#15803d">Racial OxPhos Difference — AA Higher in ALL Conditions (most stable finding)</text>
  <text x="480" y="186" text-anchor="middle" font-size="9" fill="#374151">Higher OxPhos → more ROS → more oxidative DNA damage (AA burden). Combined with suppressed NER = double hit.</text>
  <text x="480" y="200" text-anchor="middle" font-size="9" fill="#64748b">C1: NES +1.68 | C2: NES +1.26 | C11: NES +1.77 | C12: NES +1.72  (all FDR significant)</text>`;
  // Key stats
  [
    [60, 218, 'C1\nParental', '-1.69'],
    [220, 218, 'C11\nStem', '-2.30'],
    [460, 218, 'Inflammatory', 'NES range'],
    [700, 218, 'TNFα/NF-κB', 'C1: -1.57'],
  ].forEach(([x, y, lbl, val]) => {
    s += `<text x="${x}" y="${y}" text-anchor="middle" font-size="8.5" fill="#374151" font-weight="600">${lbl}</text>
    <text x="${x}" y="${y+13}" text-anchor="middle" font-size="8" fill="#dc2626">${val}</text>`;
  });
  // Legend
  s += `<rect x="10" y="245" width="940" height="75" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="20" y="262" font-size="9" font-weight="600" fill="#64748b">Counterintuitive finding: NHW cells show HIGHER inflammatory tone (NES negative = higher in denominator = NHW). Yet clinically, inflammation</text>
  <text x="20" y="275" font-size="9" fill="#64748b">associates with WORSE outcomes in AA breast cancer. NHW inflammatory signature dominated by immune surveillance genes (IFN, TLR, NK markers)</text>
  <text x="20" y="288" font-size="9" fill="#64748b">rather than classical pro-tumor cytokines — suggesting different inflammatory biology with distinct prognostic implications by race.</text>
  <text x="20" y="305" font-size="8.5" fill="#94a3b8">Gene color = L2FC in selected comparison. Dashed border = FDR &lt; 0.05. Negative L2FC = higher in denominator. Click any gene for details.</text>`;
  s += `</svg>`;
  el.innerHTML = s;
}

/* ═══════════════════════════════════════════════════════════════
   6. STEM CELL VALIDATION SECTION
   ══════════════════════════════════════════════════════════════*/
function buildStemValidation() {
  const el = document.getElementById('stem-val-grid');
  if (!el) return;
  const items = [
    {label:'Surface Marker Sorting',val:'CD24⁻/CD49f⁺/CD44⁺',desc:'FACS selection criterion itself confirms stem cell identity — stringent triple-marker gating with FMO controls on BD FACS Aria',col:'#1d4ed8'},
    {label:'BENPORATH_ES_2',val:'+1.84',desc:'NES in both C5 (NHW) and C6 (AA) stem vs parental — embryonic stem cell pluripotency signature enriched in both racial lines',col:'#7c3aed'},
    {label:'PECE_MAMMARY_STEM_CELL_UP',val:'+1.85',desc:'NES: tissue-specific mammary stem cell validation signature — confirms lineage identity not just generic stemness',col:'#db2777'},
    {label:'HALLMARK_G2M_CHECKPOINT',val:'+2.76',desc:'NES in C5 — strongest stem validation pathway; confirms active cell cycle programs characteristic of stem cells',col:'#16a34a'},
    {label:'HALLMARK_E2F_TARGETS',val:'+2.75',desc:'NES in C5 — confirms active S-phase and replication programs; consistent with stem cell proliferative state',col:'#16a34a'},
    {label:'BER Pathway',val:'Upregulated',desc:'Base Excision Repair pathway significantly enriched in stem vs parental cells — stem cells maintain elevated BER capacity',col:'#d97706'},
    {label:'MMR Pathway',val:'Upregulated',desc:'Mismatch Repair pathway significantly enriched in stem vs parental cells — stem cells show elevated MMR activity',col:'#0891b2'},
    {label:'HR Pathway',val:'Upregulated',desc:'Homologous Recombination pathway significantly enriched in stem vs parental cells — confirming elevated DNA repair in the stem compartment',col:'#64748b'},
  ];
  el.innerHTML = items.map(it => `<div class="card" style="padding:1rem;text-align:center;border-top:3px solid ${it.col};">
    <div style="font-size:1.4rem;font-weight:800;color:${it.col};">${it.val}</div>
    <div style="font-size:.78rem;font-weight:700;color:#1e293b;margin:.2rem 0;">${it.label}</div>
    <div style="font-size:.74rem;color:#64748b;line-height:1.4;">${it.desc}</div>
  </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════════
   7. XPC PARADOX SECTION
   ══════════════════════════════════════════════════════════════*/
function buildXPCParadox() {
  const el = document.getElementById('xpc-paradox');
  if (!el) return;
  el.innerHTML = `<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:stretch;">
    <!-- AA Parental -->
    <div style="background:#fee2e2;border-radius:10px;padding:1rem;border:2px solid #fecaca;text-align:center;">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:#dc2626;margin-bottom:.4rem;">AA Parental Cells + Arsenic</div>
      <div style="font-size:1.8rem;font-weight:800;color:#dc2626;">+0.78</div>
      <div style="font-size:.78rem;color:#991b1b;font-weight:600;">L2FC (FDR = 0.0003)</div>
      <div style="margin-top:.6rem;padding:.4rem;background:rgba(255,255,255,.6);border-radius:6px;font-size:.8rem;color:#374151;">
        XPC is <strong>induced</strong> — compensatory attempt to boost DNA damage recognition
      </div>
    </div>
    <!-- vs divider -->
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;padding:.5rem;">
      <div style="font-size:.9rem;font-weight:800;color:#64748b;">vs</div>
      <div style="width:1px;flex:1;background:#e2e8f0;"></div>
    </div>
    <!-- NHW Parental -->
    <div style="background:#f0fdf4;border-radius:10px;padding:1rem;border:2px solid #bbf7d0;text-align:center;">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:#16a34a;margin-bottom:.4rem;">NHW Parental Cells + Arsenic</div>
      <div style="font-size:1.8rem;font-weight:800;color:#16a34a;">+0.03</div>
      <div style="font-size:.78rem;color:#14532d;font-weight:600;">L2FC (FDR = 0.87, NS)</div>
      <div style="margin-top:.6rem;padding:.4rem;background:rgba(255,255,255,.6);border-radius:6px;font-size:.8rem;color:#374151;">
        No significant XPC response — NHW parental cells do not upregulate XPC under arsenic
      </div>
    </div>
  </div>
  <!-- Then in stem cells -->
  <div style="margin-top:1rem;padding:1rem;background:#fff7ed;border-radius:10px;border:2px solid #fed7aa;">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:#92400e;margin-bottom:.5rem;">↓ But in AA STEM cells under arsenic (C8) — the induction reverses:</div>
    <div style="display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;">
      <div style="text-align:center;">
        <div style="font-size:1.5rem;font-weight:800;color:#dc2626;">−0.45</div>
        <div style="font-size:.75rem;color:#991b1b;">XPC L2FC (FDR = 0.016)</div>
        <div style="font-size:.72rem;color:#64748b;">C8 leading edge</div>
      </div>
      <div style="flex:1;min-width:200px;">
        <p style="font-size:.84rem;color:#374151;line-height:1.6;margin:0;">The compensatory XPC induction seen in AA parental cells <strong>fails in the stem compartment</strong> — stem cells suppress XPC under arsenic instead of inducing it. This reversal, combined with stem cell identity and AA racial background, is the defining three-condition requirement of this study's central finding.</p>
      </div>
    </div>
  </div>

  <!-- XPC Three-Phase Trajectory -->
  <div style="margin-top:1rem;padding:1rem;background:#f0f9ff;border-radius:10px;border:2px solid #bae6fd;">
    <div style="font-size:.78rem;font-weight:700;color:#0369a1;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em;">📊 XPC Three-Phase Trajectory in AA Cells</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.7rem;margin-bottom:.8rem;">
      <div style="background:#fff;border-radius:8px;padding:.7rem;border-left:4px solid #7c3aed;">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;color:#7c3aed;margin-bottom:.3rem;">Phase 1 — Baseline (C1)</div>
        <div style="font-size:1.1rem;font-weight:800;color:#7c3aed;">−0.300</div>
        <div style="font-size:.72rem;color:#64748b;">L2FC &nbsp;|&nbsp; FDR = 0.019 ★</div>
        <div style="font-size:.77rem;color:#374151;margin-top:.3rem;">XPC is <strong>lower in AA parental cells at baseline</strong>. AA starts with less damage recognition capacity.</div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:.7rem;border-left:4px solid #dc2626;">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;color:#dc2626;margin-bottom:.3rem;">Phase 2 — AA Parental + Arsenic (C4)</div>
        <div style="font-size:1.1rem;font-weight:800;color:#dc2626;">+0.783</div>
        <div style="font-size:.72rem;color:#64748b;">L2FC &nbsp;|&nbsp; FDR &lt; 0.001 ★</div>
        <div style="font-size:.77rem;color:#374151;margin-top:.3rem;">AA parental cells mount a <strong>strong compensatory induction</strong>. NHW parental cells: +0.033, FDR = 0.866 (no response).</div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:.7rem;border-left:4px solid #b45309;">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;color:#b45309;margin-bottom:.3rem;">Phase 3 — AA Stem + Arsenic (C8)</div>
        <div style="font-size:1.1rem;font-weight:800;color:#b45309;">−0.452</div>
        <div style="font-size:.72rem;color:#64748b;">L2FC &nbsp;|&nbsp; FDR = 0.016 ★</div>
        <div style="font-size:.77rem;color:#374151;margin-top:.3rem;">The compensatory induction <strong>collapses in stem cells</strong>. XPC is suppressed — the C8 NER leading edge gene.</div>
      </div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:.65rem 1rem;font-size:.8rem;color:#e2e8f0;line-height:1.55;">
      <strong style="color:#fbbf24;">Key insight:</strong> XPC undergoes a three-phase trajectory in AA cells: <span style="color:#c084fc;">lower at baseline</span> → <span style="color:#f87171;">compensatory induction under arsenic in parental cells</span> → <span style="color:#fb923c;">suppression in stem cells under arsenic</span>. This trajectory is entirely absent in NHW cells, where XPC does not significantly change under arsenic in any condition. The stem cell suppression, despite the prior compensatory induction, makes the stem compartment the locus where arsenic's NER impact is most consequential.
    </div>
  </div>

  <!-- C7 vs C8 Opposite Direction Callout -->
  <div style="margin-top:1rem;padding:1rem;background:#fafafa;border-radius:10px;border:2px solid #e2e8f0;">
    <div style="font-size:.78rem;font-weight:700;color:#1e293b;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.04em;">⬆⬇ Opposite Repair Trajectories: C7 (NHW) vs C8 (AA) — Gap-Filling &amp; Ligation Genes</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:.8rem;">
      <!-- C7 NHW -->
      <div style="background:#eff6ff;border-radius:8px;padding:.8rem;border-top:3px solid #0891b2;">
        <div style="font-size:.74rem;font-weight:700;color:#0891b2;margin-bottom:.5rem;">C7 — NHW Stem vs Parental Arsenic &nbsp;<span style="background:#dbeafe;padding:.1rem .35rem;border-radius:4px;">NES = +0.86 (NS)</span></div>
        <div style="font-size:.72rem;font-weight:700;color:#64748b;margin-bottom:.3rem;text-transform:uppercase;">Gap-filling genes INDUCED in NHW ▲</div>
        ${[['POLD1','FDR = 2.3×10⁻⁷','L2FC = +1.42'],['POLE','FDR = 1.1×10⁻⁴','L2FC = +0.87'],['LIG1','FDR = 1.7×10⁻⁴','L2FC = +0.99'],['RFC3','FDR = 4.3×10⁻⁴','L2FC = +1.14']].map(([g,fdr,l2fc]) =>
          `<div style="display:flex;align-items:center;justify-content:space-between;padding:.22rem 0;border-bottom:1px solid #e0f2fe;font-size:.79rem;">
            <span style="font-weight:700;color:#0891b2;">${g}</span>
            <span style="font-family:monospace;color:#16a34a;">${l2fc} ★</span>
            <span style="font-size:.7rem;color:#64748b;">${fdr}</span>
          </div>`).join('')}
      </div>
      <!-- C8 AA -->
      <div style="background:#fff5f5;border-radius:8px;padding:.8rem;border-top:3px solid #dc2626;">
        <div style="font-size:.74rem;font-weight:700;color:#dc2626;margin-bottom:.5rem;">C8 — AA Stem vs Parental Arsenic &nbsp;<span style="background:#fee2e2;padding:.1rem .35rem;border-radius:4px;">NES = −2.75 ★</span></div>
        <div style="font-size:.72rem;font-weight:700;color:#64748b;margin-bottom:.3rem;text-transform:uppercase;">Same genes SUPPRESSED in AA ▼</div>
        ${[['POLD2','FDR = 0.048','L2FC = −0.35'],['POLE3','FDR = 0.014','L2FC = −0.51'],['LIG1','FDR = 0.362','L2FC = −0.17'],['RFC1','FDR = 0.001','L2FC = −0.52']].map(([g,fdr,l2fc]) =>
          `<div style="display:flex;align-items:center;justify-content:space-between;padding:.22rem 0;border-bottom:1px solid #fee2e2;font-size:.79rem;">
            <span style="font-weight:700;color:#dc2626;">${g}</span>
            <span style="font-family:monospace;color:#dc2626;">${l2fc}${fdr.includes('0.36')?'':' ★'}</span>
            <span style="font-size:.7rem;color:#64748b;">${fdr}</span>
          </div>`).join('')}
      </div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:.65rem 1rem;font-size:.8rem;color:#e2e8f0;line-height:1.55;">
      <strong style="color:#fbbf24;">The racial disparity is not only AA suppression</strong> — NHW stem cells <em>actively induce</em> the same gap-filling genes under arsenic. The same arsenic provocation drives <strong>opposite outcomes</strong> in the two lines: NHW stem cells upregulate gap-filling and ligation machinery (POLD1, POLE, LIG1, RFC3) while AA stem cells suppress the parallel proteins (POLD2, POLE3, RFC1). This bidirectional divergence under identical arsenic exposure is the mechanistic core of the racial NER disparity.
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   8. DOUBLE-HIT MECHANISM DIAGRAM (Animated SVG)
   ══════════════════════════════════════════════════════════════*/
function buildDoubleHit() {
  const el = document.getElementById('double-hit-wrap');
  if (!el) return;
  el.innerHTML = `<svg viewBox="0 0 900 400" style="width:100%;font-family:Inter,sans-serif;" id="dh-svg">
  <defs>
    <marker id="arr-dh" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#64748b"/>
    </marker>
    <marker id="arr-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#dc2626"/>
    </marker>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>

  <!-- HIT 1: Elevated OxPhos / ROS -->
  <rect x="15" y="15" width="260" height="180" rx="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
  <text x="145" y="38" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">HIT 1</text>
  <text x="145" y="54" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Elevated OxPhos → ROS</text>
  <rect x="30" y="65" width="230" height="38" rx="6" fill="#fef3c7"/>
  <text x="145" y="82" text-anchor="middle" font-size="9.5" fill="#374151">Higher mitochondrial activity in AA cells</text>
  <text x="145" y="96" text-anchor="middle" font-size="9" fill="#64748b">(stable across all 4 conditions, NES +1.68 to +1.77)</text>
  <text x="145" y="125" text-anchor="middle" font-size="24" fill="#f59e0b" filter="url(#glow)">⚡</text>
  <text x="145" y="148" text-anchor="middle" font-size="10" fill="#374151">Superoxide → H₂O₂ → ·OH</text>
  <text x="145" y="163" text-anchor="middle" font-size="9.5" fill="#374151">8-oxoG, strand breaks, oxidized bases</text>
  <text x="145" y="178" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">More DNA damage load</text>

  <!-- HIT 2: Arsenic NER suppression -->
  <rect x="625" y="15" width="260" height="180" rx="10" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="755" y="38" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">HIT 2</text>
  <text x="755" y="54" text-anchor="middle" font-size="10" font-weight="600" fill="#dc2626">Arsenic → NER Suppression</text>
  <rect x="640" y="65" width="230" height="38" rx="6" fill="#fee2e2"/>
  <text x="755" y="82" text-anchor="middle" font-size="9.5" fill="#374151">Arsenic targets XPA zinc-finger + PARP1</text>
  <text x="755" y="96" text-anchor="middle" font-size="9" fill="#64748b">(direct zinc displacement mechanism)</text>
  <text x="755" y="128" text-anchor="middle" font-size="22" fill="#dc2626" filter="url(#glow)">⚗️</text>
  <text x="755" y="150" text-anchor="middle" font-size="10" fill="#374151">p53 suppression → ↓ DDB2, XPC</text>
  <text x="755" y="157" text-anchor="middle" font-size="9.5" fill="#374151">ERCC1, CDK7, CCNH, RFC2, RPA3</text>
  <text x="755" y="169" text-anchor="middle" font-size="9" fill="#374151">+ COP9 signalosome (COPS3–8)</text>
  <text x="755" y="181" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">Less repair capacity (NES −2.75)</text>

  <!-- Context: AA Stem identity -->
  <rect x="315" y="15" width="270" height="180" rx="10" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="#7c3aed">AA Breast Cancer Stem Cell Context</text>
  <text x="450" y="55" text-anchor="middle" font-size="9.5" fill="#374151">Three simultaneous conditions required:</text>
  <circle cx="340" cy="80" r="12" fill="#7c3aed"/>
  <text x="340" y="84" text-anchor="middle" font-size="9" fill="white" font-weight="700">1</text>
  <text x="365" y="84" font-size="9.5" fill="#374151">African American cellular background</text>
  <circle cx="340" cy="110" r="12" fill="#7c3aed"/>
  <text x="340" y="114" text-anchor="middle" font-size="9" fill="white" font-weight="700">2</text>
  <text x="365" y="114" font-size="9.5" fill="#374151">Cancer stem identity (CD24⁻/CD49f⁺/CD44⁺)</text>
  <circle cx="340" cy="140" r="12" fill="#7c3aed"/>
  <text x="340" y="144" text-anchor="middle" font-size="9" fill="white" font-weight="700">3</text>
  <text x="365" y="144" font-size="9.5" fill="#374151">Arsenic trioxide 0.3 µM, 14 days</text>
  <rect x="325" y="158" width="250" height="28" rx="6" fill="#7c3aed"/>
  <text x="450" y="170" text-anchor="middle" font-size="9" fill="white">Remove ANY condition → no NER suppression</text>
  <text x="450" y="180" text-anchor="middle" font-size="8.5" fill="#ddd6fe">NHW: NES +0.86 | Parental: not significant</text>

  <!-- Arrows converging down -->
  <path id="dh-arr1" d="M 145 200 Q 145 250 330 300" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-dasharray="0 300" marker-end="url(#arr-dh)" opacity=".9"/>
  <path id="dh-arr2" d="M 450 200 L 450 300" stroke="#7c3aed" stroke-width="2.5" fill="none" stroke-dasharray="0 200" marker-end="url(#arr-dh)" opacity=".9"/>
  <path id="dh-arr3" d="M 755 200 Q 755 250 570 300" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-dasharray="0 300" marker-end="url(#arr-dh)" opacity=".9"/>

  <!-- Outcome box -->
  <rect id="outcome-box" x="250" y="305" width="400" height="85" rx="12" fill="#1e293b" stroke="#dc2626" stroke-width="2.5" opacity="0"/>
  <text x="450" y="327" text-anchor="middle" font-size="12" font-weight="800" fill="white" id="outcome-t1" opacity="0">OUTCOME: Mutagenic Double Hit</text>
  <text x="450" y="346" text-anchor="middle" font-size="10" fill="#fca5a5" id="outcome-t2" opacity="0">More oxidative DNA lesions + Less NER repair capacity</text>
  <text x="450" y="362" text-anchor="middle" font-size="9.5" fill="#93c5fd" id="outcome-t3" opacity="0">→ Elevated mutagenesis in AA breast cancer stem cells under arsenic</text>
  <text x="450" y="378" text-anchor="middle" font-size="9" fill="#fde68a" id="outcome-t4" opacity="0">→ Potential driver of health disparities in arsenic-exposed AA women</text>
  </svg>`;
  animDoubleHit();
}

function animDoubleHit() {
  ['dh-arr1','dh-arr2','dh-arr3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const len = el.getTotalLength ? el.getTotalLength() : 200;
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    el.style.transition = `stroke-dashoffset 600ms ease ${600+i*200}ms`;
    setTimeout(() => { el.style.strokeDashoffset = 0; }, 50);
  });
  ['outcome-box','outcome-t1','outcome-t2','outcome-t3','outcome-t4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = `opacity 400ms ease ${1500+i*100}ms`;
    setTimeout(() => { el.setAttribute('opacity','1'); }, 50);
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. CLINICAL IMPLICATIONS SECTION
   ══════════════════════════════════════════════════════════════*/
function buildClinical() {
  const el = document.getElementById('clinical-wrap');
  if (!el) return;
  const cards = [
    {icon:'💊',title:'ERCC1 as Biomarker',col:'#dc2626',bg:'#fee2e2',
     body:'ERCC1 is a validated clinical biomarker in non-small cell lung cancer (NSCLC): ERCC1 IHC scoring predicts platinum chemotherapy resistance (IALT, JMEN, TASTE trials; ERCC1-negative tumors benefit more from cisplatin). The same ERCC1 protein IHC assay is directly applicable to breast cancer specimens. Clinically, high ERCC1 expression is associated with platinum resistance — meaning low ERCC1 is associated with platinum sensitivity.<br><br><strong>Unique finding — ERCC1 is suppressed in both lines under arsenic in the stem compartment:</strong> C7 (NHW Stem vs Parental Arsenic): shrunken L2FC = −0.538, FDR = 0.002 ★. C8 (AA Stem vs Parental Arsenic): shrunken L2FC = −0.469, FDR = 0.009 ★. ERCC1 is the <em>only</em> NER gene suppressed in both AA and NHW stem cells under arsenic — all other NER genes diverge in direction between C7 and C8. This makes ERCC1 a race-independent vulnerability on top of the race-specific NER suppression in AA cells: while the AA-specific signal requires the three-condition combination, ERCC1 suppression itself is universal to the arsenic + stem cell context regardless of racial background.<br><br>Two independent actionable insights: low ERCC1 in stem cell-enriched tumors with arsenic exposure history may predict (1) platinum chemotherapy sensitivity AND (2) elevated susceptibility to arsenic-induced DNA damage accumulation — because the obligate incision endonuclease is reduced, leaving lesions unrepaired.'},
    {icon:'🌍',title:'Environmental Exposure Context',col:'#d97706',bg:'#fff7ed',
     body:'Arsenic exposure is not hypothetical in the study population. In South Florida, water systems in Miami-Dade (ZIP codes 33030–33034, Homestead/Florida City area) and Palm Beach County communities have documented arsenic levels in the 5–15 µg/L range — approaching the EPA maximum contaminant level of 10 µg/L, and exceeding California\'s Public Health Goal of 0.004 µg/L. These same zip codes overlap with communities with elevated proportions of Black/AA residents and elevated Stage III–IV breast cancer incidence in Florida Cancer Data System (FCDS) reporting. The 0.3 µM arsenic dose used in this study (≈22 µg/L as As³⁺) models chronic environmental exposure, not pharmacological dosing. This creates a direct mechanistic link from tap water arsenic → cancer stem cell NER suppression → elevated mutagenic burden in the at-risk population.'},
    {icon:'🧬',title:'Health Disparities Framework',col:'#7c3aed',bg:'#f5f3ff',
     body:'AA women have 40% higher breast cancer mortality than NHW women despite lower incidence. This gene-environment interaction model — where racial cellular biology amplifies the impact of an environmental carcinogen specifically in cancer stem cells — provides a transcriptomic mechanism for understanding and ultimately addressing this disparity.'},
    {icon:'🔬',title:'Future Validation Targets',col:'#0891b2',bg:'#eff6ff',
     body:'Five key validation experiments: (1) n≥3 stem replicates for three-way interaction analysis, (2) functional NER capacity assays in primary cells and organoids, (3) NER gene expression in breast tumor specimens stratified by race, (4) CpG methylation of XPC/ERCC1 promoters as epigenetic mechanism, (5) prospective epidemiological studies linking arsenic exposure, NER expression, and breast cancer risk by race.'},
  ];
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">` +
    cards.map(c => `<div style="background:${c.bg};border-radius:12px;padding:1.3rem;border-left:4px solid ${c.col};">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;">
        <span style="font-size:1.3rem;">${c.icon}</span>
        <span style="font-size:.88rem;font-weight:700;color:${c.col};">${c.title}</span>
      </div>
      <p style="font-size:.82rem;color:#374151;line-height:1.6;margin:0;">${c.body}</p>
    </div>`).join('') + `</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   10. METHODS ACCORDION
   ══════════════════════════════════════════════════════════════*/
function buildMethods() {
  const el = document.getElementById('methods-accordion');
  if (!el) return;
  const sections = [
    {title:'Cell Lines & Arsenic Exposure',content:`
      <p><strong>BRL-23 (NHW):</strong> Derived from non-diseased breast reduction mammoplasty of a premenopausal Non-Hispanic White woman. <strong>BRL-24 (AA):</strong> Same source, premenopausal African American. Both karyotyped — confirmed normal chromosomal content. Cultured in MWRI medium (DMEM + 10% FBS + 10% newborn calf serum + 1% P/S + MEM-NEAA + β-mercaptoethanol + nucleoside stock) in Matrigel-coated flasks at 37°C, 10% CO₂.</p>
      <p><strong>Arsenic dose:</strong> 0.3 µM arsenite (As³⁺) — the LC₁₀ (10% lethal concentration; Alharbi 2025), consistent with arsenic concentrations in contaminated groundwater. 40 mM stock in PBS, filter-sterilized (0.22 µm), stored at 4°C protected from light. Fed every other day + 1 hour before harvest. Duration: 14 days (~2–3 population doublings). This models <em>chronic, low-dose environmental exposure</em>, not therapeutic dosing.</p>
    `},
    {title:'Cancer Stem Cell Isolation (FACS)',content:`
      <p><strong>Surface markers:</strong> CD24-FITC (loss → dedifferentiation marker), CD49f-PE (integrin α6, mammary progenitor marker), CD44-APC (cancer stem cell adhesion receptor). DAPI for viability exclusion. Fluorescence-minus-one (FMO) controls for gating boundaries on all markers.</p>
      <p><strong>Instrument:</strong> BD FACS Aria. Cells resuspended in PBS + 2% FBS; antibodies at 4°C for 20 min. Sorted directly into RNAprotect Cell Reagent. <strong>Yield:</strong> 2–5% viable cells, consistent across all four groups. <strong>Replication:</strong> n=3 biological replicates for parental conditions; n=1 per group for stem (sorting yield constraint — DESeq2 borrows variance from parental replicates via empirical Bayes).</p>
    `},
    {title:'RNA Sequencing',content:`
      <p><strong>Extraction:</strong> miRNeasy Mini Kit (Qiagen) + on-column DNase digestion. All 16 samples achieved RIN ≥ 9; NanoDrop A260/A280: 1.9–2.1. <strong>Library prep:</strong> TruSeq Stranded Total RNA Library Prep Gold (Illumina). <strong>Sequencing:</strong> Illumina NextSeq 2000, 150 bp paired-end, 41–72 million read pairs per sample.</p>
      <p><strong>QC note:</strong> Arsenic-treated parental samples showed average Phred ~33 vs ~38 for vehicle/stem; stem samples showed elevated %N (0.24% vs 0.01–0.07%), indicating separate library preparation batches. Batch structure was inseparable from treatment groups — standard ComBat correction was not applied; confounding addressed through the full DESeq2 factorial model.</p>
      <p><strong>Alignment:</strong> STAR aligner, GRCh38 (hg38) + Ensembl release 105. 90–92% alignment rates. Gene counts via featureCounts-equivalent (Partek Flow), requiring strict paired-end compatibility and ≥75% read overlap. <strong>Count filter:</strong> ≥10 summed raw reads across all 16 samples → 16,682 genes. Of these, 1,806 had "---" placeholder symbols (absent HGNC symbols in Ensembl 105); they were retained using Ensembl IDs and contribute to rank positions but do not match any named gene set.</p>
    `},
    {title:'DESeq2 Statistical Model',content:`
      <p><strong>Model:</strong> Full factorial interaction: <code>~ ethnicity + Treatment + Type + ethnicity×Treatment + ethnicity×Type + Treatment×Type</code>. Reference levels: Vehicle, Parental, NHW. The ethnicity×treatment interaction directly tests whether arsenic affects gene expression differently in AA vs NHW cells. 14 pairwise contrasts defined (C1–C12 plus three interaction contrasts).</p>
      <p><strong>Normalization:</strong> Median-of-ratios (DESeq2 internal): each gene's pseudo-reference = geometric mean across all samples; each sample's size factor = median of count-to-pseudo-reference ratios. This corrects for both library size AND composition — critical when arsenic globally suppresses transcription, which would distort simpler approaches. <strong>Shrinkage:</strong> apeglm adaptive t-prior on log₂FC. <strong>Significance:</strong> FDR &lt; 0.05 (Benjamini-Hochberg). <strong>Variance for n=1 stem conditions:</strong> Borrowed from n=3 parental replicates via empirical Bayes dispersion estimation — the only mechanism enabling statistically valid inference for these comparisons.</p>
      <p><strong>Why not standard t-tests or ANOVA?</strong> Both assume normally distributed data — a condition violated by RNA-seq count distributions. Neither can accommodate overdispersion nor n=1 conditions. DESeq2 models counts using the negative binomial distribution, appropriate for overdispersed count data.</p>
    `},
    {title:'Why DESeq2 Over CPM Normalization',content:`
      <p>CPM (Counts Per Million) normalization, used in prior work from this laboratory for simpler two-group designs, corrects only for sequencing depth — not library composition. Because CPM uses the total count sum as denominator, highly expressed genes that dominate the library can distort every other gene's apparent CPM ratio. This composition bias is especially problematic when arsenic globally suppresses transcription.</p>
      <p><strong>ALDH1A3 direction reversal (the key example):</strong> A parallel CPM analysis reported ALDH1A3 as 7.6-fold <em>lower</em> in AA cells (CPM L2FC = −2.92) in the racial comparison, while DESeq2 identified it as 2.9-fold <em>higher</em> in AA (L2FC = +1.51) — an <strong>opposite-direction error exceeding 4 log₂ units</strong>. The mechanism: VIM, constitutively expressed at ~3,000–4,000 CPM in BRL-23 and higher in BRL-24, dominates the total count denominator differently in the two lines, systematically inflating or deflating apparent CPM ratios. DESeq2's median-of-ratios normalization corrects for this; CPM does not.</p>
      <p>Composition bias also produces wrong conclusions about the direction of arsenic's effect within a single cell line. In the AA parental arsenic vs. vehicle comparison (C4), CPM reported ALDH1A3 as induced by arsenic (log₂ fold change = +1.45), while DESeq2 reported it as suppressed (log₂ fold change = −1.29). ALDH1A3 is an established breast cancer stem cell marker and the sign of arsenic's effect on it is a biologically significant question — CPM's composition bias reversed the conclusion entirely. DESeq2's size-factor normalization, which accounts for the global suppression of transcription that shifts the CPM denominator, correctly identifies suppression where CPM falsely reports induction.</p>
      <p><strong>Within-line comparisons:</strong> CPM and DESeq2 are directionally consistent for most within-line arsenic comparisons (e.g., SMO: CPM −0.76 vs DESeq2 −1.12 in NHW; KLF4: CPM −1.23 vs DESeq2 −1.38), reflecting that within-line comparisons using the same total read count denominator are less susceptible to composition distortion.</p>
      <p><strong>NER genes in C8:</strong> CPM and DESeq2 are directionally identical for all 23 NER genes in the C8-equivalent comparison — the NER suppression signal is present in both normalizations at the individual gene level. The critical failure of CPM is not gene-level direction but its inability to generate a statistical framework, factorial model, or GSEA pathway analysis.</p>
      <p><strong>Stem cell comparisons:</strong> Every stem cell comparison in CPM analysis contained only a single sample per group — making t-tests impossible and leaving all stem cell comparisons without p-values or any statistical framework. DESeq2's empirical Bayes dispersion imputation is the only mechanism making statistically valid inference possible for n=1 stem conditions.</p>
      <p><strong>NER gene list coverage:</strong> The parallel 54-gene CPM analysis contained no NER pathway genes — not a single member of KEGG_NUCLEOTIDE_EXCISION_REPAIR was included. Individual NER genes change by only 1.2- to 1.8-fold under arsenic, too small to attract attention in gene-by-gene CPM review and too subtle for individual DEG significance after 16,682-gene multiple testing correction. The NER finding depends entirely on GSEA detecting coordinated clustering of sub-threshold genes — structurally invisible to any gene-list CPM analysis.</p>
    `},
    {title:'GSEA Analysis: GSEAPreranked vs. Alternatives',content:`
      <p><strong>Method:</strong> GSEAPreranked v4.4.0. <strong>Rank metric:</strong> −log₁₀(p-value) × sign(shrunken L2FC). Genes with p=0 assigned ±300. <strong>Parameters:</strong> No_Collapse (HGNC symbols already match MSigDB format), 1,000 permutations, fixed seed 149, weighted enrichment statistic, gene set size 15–500 genes. All 16,682 genes retained — no intermediate filtering.</p>
      <p><strong>Why not Partek Flow built-in GSEA?</strong> Partek's built-in GSEA requires exactly two factor levels and cannot accommodate a multi-factor interaction model. Empirically confirmed: when run on DESeq2-normalized counts across collapsed two-group comparisons, KEGG_NUCLEOTIDE_EXCISION_REPAIR showed no significant enrichment (best: NES = −1.31, FDR = 0.38 in Stem vs. Parental) vs. NES = −2.75, FDR = 0.18 from GSEAPreranked. On CPM-normalized counts: NES = −0.56, FDR = 1.00. The primary finding is entirely absent from both Partek GSEA runs — collapsing all racial backgrounds and arsenic conditions into a single Stem vs. Parental comparison averages the AA-specific, arsenic-dependent signal into noise.</p>
      <p><strong>Why not Partek Gene Set Enrichment (Fisher's exact)?</strong> When Partek's Gene Set Enrichment function (Fisher's exact test) was applied to the unfiltered all-gene dataset, it returned a rich factor of 1.0 for KEGG_NUCLEOTIDE_EXCISION_REPAIR — meaning all 46 NER pathway genes were present in the input list. The result was a highly significant p-value (3.2×10⁻⁹) that is entirely uninformative: it simply confirms that NER genes exist in the dataset, with no information about direction, condition-specificity, or coordinated suppression. A rich factor of 1.0 means the "enrichment" test has no discriminatory power whatsoever.</p>
      <p><strong>Gene Set ANOVA comparison:</strong> Gene Set ANOVA requires within-group replicates and cannot be applied to n=1 stem comparisons (C5–C12). On parental comparisons: NER main effect p = 0.80 (AA vs. NHW) and p = 0.49 (arsenic vs. vehicle); modestly significant in Stem vs. Parental (p = 0.011, FDR = 0.034). Disruption p-value (gene patterning within pathway) was extraordinarily significant in every comparison (Stem vs. Parental: p &lt; 10⁻¹⁸; AA vs. NHW: p &lt; 10⁻¹⁵) — confirming genuine NER disruption but without the directional or condition-specific resolution to identify the AA + arsenic + stem cell combination as the driver. <strong>CPM inflation:</strong> When Gene Set ANOVA was applied to CPM-normalized counts instead of DESeq2-normalized counts, 496 pathways reached significance (p &lt; 0.05) across all three comparisons versus 344 for DESeq2 — a 44% inflation in significant hits. NER appeared spuriously significant in the CPM AA vs. NHW comparison (p = 0.049) despite a log₂ fold change of essentially zero (−0.003), a false positive with no directional meaning generated by composition bias.</p>
      <p><strong>No intermediate filtering between DESeq2 and GSEA:</strong> All 16,682 genes retained. The most common GSEA error is pre-filtering to significant DEGs — this defeats the method's purpose. The NER finding depends entirely on retaining sub-threshold genes. The rank metric itself encodes significance: a non-significant gene naturally ranks near the middle where it contributes almost nothing to any enrichment score.</p>
    `},
    {title:'Database Selection Rationale',content:`
      <p><strong>Hallmark (50 gene sets):</strong> Quality filter — computationally derived from thousands of overlapping literature gene sets, collapsed into 50 well-validated biological programs with minimal redundancy. Robust by construction. Has no NER gene set (too mechanistically specific for broad program-level curation), so cannot directly confirm the primary NER finding but provides context for stemness, EMT, OxPhos, and inflammatory programs.</p>
      <p><strong>KEGG Legacy:</strong> Mechanistic biochemical pathway maps with separate gene sets for NER, BER, MMR, and HR — the correct biochemical resolution to detect a specific NER suppression signal. KEGG_NUCLEOTIDE_EXCISION_REPAIR was the primary finding database.</p>
      <p><strong>Reactome:</strong> Independent confirmation and mechanistic granularity. Hierarchical annotation separates NER into sub-pathway steps; agreement between KEGG (NES = −2.75) and Reactome (NES = −2.68) in C8 — built by different groups using different curation methods — is strong evidence against a gene-set-definition artifact. Reactome also identified COP9 signalosome suppression (COPS3–8), extending the impairment upstream of damage recognition.</p>
      <p><strong>CGP (Chemical and Genetic Perturbations):</strong> Empirical signatures from published perturbation experiments. KAN_RESPONSE_TO_ARSENIC_TRIOXIDE (from an actual arsenic exposure experiment) enabled cross-study validation that arsenic-exposed cells activated programs consistent with published arsenic responses. CGP also contains BenPorath and Pece stem cell signatures used to validate sorted population identity.</p>
    `},
    {title:'RNA-Seq Quality Control', content:`<div id="qc-table-wrap-inner"><p style="color:#64748b;font-size:.83rem;">Loading QC data…</p></div>`},
  ];
  el.innerHTML = sections.map((s, i) => `<div class="acc-item" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:.4rem;">
    <div class="acc-hdr" style="padding:.8rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;font-weight:600;font-size:.86rem;"
      onclick="toggleAcc(${i})">
      <span>${s.title}</span>
      <span id="acc-icon-${i}" style="font-size:1rem;transition:transform .2s;display:inline-block;">+</span>
    </div>
    <div id="acc-body-${i}" style="max-height:0;overflow:hidden;transition:max-height .3s ease;background:#fff;">
      <div style="padding:.9rem 1.1rem;font-size:.83rem;color:#374151;line-height:1.65;">${s.content}</div>
    </div>
  </div>`).join('');
}

function toggleAcc(i) {
  const body = document.getElementById(`acc-body-${i}`);
  const icon = document.getElementById(`acc-icon-${i}`);
  if (!body) return;
  const open = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
  body.style.maxHeight = open ? '0' : '800px';
  if (icon) { icon.textContent = open ? '+' : '−'; icon.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)'; }
  // Lazy-build QC table when QC accordion section is opened
  if (!open) {
    const qcInner = document.getElementById('qc-table-wrap-inner');
    if (qcInner && (qcInner.children.length === 0 || qcInner.querySelector('p'))) {
      if (typeof buildQC === 'function') buildQC();
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   11. QC SUMMARY TABLE
   ══════════════════════════════════════════════════════════════*/
function buildQC() {
  const el = document.getElementById('qc-table-wrap') || document.getElementById('qc-table-wrap-inner');
  if (!el) return;
  const rows = [
    ['RNA Integrity (RIN)','≥ 9 (all 16 samples)','Ensures minimal RNA degradation for accurate quantification'],
    ['A260/A280 Ratio','1.9 – 2.1','Confirms RNA purity (protein/organic contamination absent)'],
    ['Read Length','150 bp paired-end','Enables accurate splice-junction detection and alignment'],
    ['Sequencing Depth','41 – 72M read pairs/sample','Sufficient depth for detection of low-abundance transcripts in stem cells'],
    ['Phred Score (Vehicle/Stem)','~38','Excellent base-call quality; &lt;0.01% expected error per base'],
    ['Phred Score (Arsenic/Parental)','~33','Good quality; slight reduction consistent with separate library batch'],
    ['Alignment Rate','90 – 92%','High genome mapping to GRCh38 + Ensembl 105'],
    ['Genes After Filtering','16,682','Retained after ≥10 total reads across all 16 samples filter'],
    ['%N (Parental Cells)','0.01 – 0.07%','Low ambiguous base calls — high-confidence sequence'],
    ['%N (Stem Cells)','~0.24%','Slightly elevated — attributed to separate stem cell library batch'],
    ['Total Samples','16 (n=3 parental × 4 groups + n=1 stem × 4 groups)','Full experimental design with replication where feasible'],
  ];
  el.innerHTML = `<div style="overflow-x:auto;border:1px solid #e2e8f0;border-radius:8px;">
    <table style="width:100%;border-collapse:collapse;font-size:.8rem;">
      <thead><tr style="background:#f8fafc;"><th style="padding:.5rem .8rem;text-align:left;border-bottom:2px solid #e2e8f0;font-weight:700;color:#64748b;text-transform:uppercase;font-size:.72rem;letter-spacing:.04em;">Metric</th><th style="padding:.5rem .8rem;border-bottom:2px solid #e2e8f0;font-weight:700;color:#64748b;text-transform:uppercase;font-size:.72rem;letter-spacing:.04em;">Value</th><th style="padding:.5rem .8rem;border-bottom:2px solid #e2e8f0;font-weight:700;color:#64748b;text-transform:uppercase;font-size:.72rem;letter-spacing:.04em;">Significance</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr style="border-bottom:1px solid #f1f5f9;${i%2?'background:#fafafa;':''}">
        <td style="padding:.45rem .8rem;font-weight:600;">${r[0]}</td>
        <td style="padding:.45rem .8rem;font-family:monospace;color:#1d4ed8;">${r[1]}</td>
        <td style="padding:.45rem .8rem;color:#64748b;">${r[2]}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   12. LIMITATIONS & FUTURE DIRECTIONS
   ══════════════════════════════════════════════════════════════*/
function buildLimitations() {
  const el = document.getElementById('limits-wrap');
  if (!el) return;
  const limits = [
    {icon:'⚠️',title:'n=1 for stem cell conditions',desc:'Sorting yield constraints prevented biological replication of stem cell samples. DESeq2 borrows variance from n=3 parental replicates via empirical Bayes — but three-way interaction effects cannot be formally tested. Replication with n≥3 stem replicates is the top priority next step.'},
    {icon:'⚠️',title:'Two cell lines as racial proxies',desc:'BRL-23 (NHW) and BRL-24 (AA) are single donors from reduction mammoplasties. While their karyotypes are normal, results should be replicated in additional NHW and AA cell lines and, ultimately, primary patient-derived samples.'},
    {icon:'⚠️',title:'Transcriptional abundance ≠ protein function',desc:'RNA-seq measures transcript levels — not protein expression, protein activity, or actual NER lesion removal kinetics. ERCC1 mRNA suppression implies reduced NER capacity but requires validation with functional assays (e.g., host-cell reactivation, comet assay, immunofluorescent ERCC1/XPC foci).'},
    {icon:'⚠️',title:'Mechanism of baseline NER differences unexplained',desc:'Why do AA stem cells have lower baseline NER gene expression than NHW stem cells (reflected across C5–C8)? The leading hypothesis is a self-reinforcing epigenetic cycle: arsenic disrupts DNA methylation patterns at NER gene promoters → CpG hypermethylation silences XPC and ERCC1 → reduced NER capacity allows further DNA damage → impaired repair perpetuates the suppressed state across cell generations. This cycle is consistent with arsenic\'s well-documented role as a DNA methyltransferase disruptor and the known regulation of XPC expression by CpG methylation of its promoter. Critically, ERCC1 is already suppressed at baseline across all comparisons involving the stem compartment (C5–C8, shrunken L2FC range −0.44 to −0.67) — a pattern that spans conditions rather than tracking with any single arsenic treatment. This argues the AA stem cells enter the experiment in a fundamentally different NER-competent state, not simply that arsenic acutely suppresses ERCC1 in real time. CpG methylation profiling of XPC and ERCC1 promoters in BRL-24 vs. BRL-23 stem cells is the highest-priority mechanistic experiment this dataset demands.'},
  ];
  const futures = [
    'Functional NER capacity assays in BRL-23 and BRL-24 stem cells: host-cell reactivation, comet assay, cyclobutane pyrimidine dimer (CPD) immunofluorescence',
    'Expand to n≥3 stem replicates from additional donors to formally test ethnicity × arsenic × stem cell type interaction',
    'NER gene expression analysis in breast tumor specimens from TCGA or BCSA datasets, stratified by self-reported race and tumor subtype',
    'CpG methylation profiling of NER gene promoters (XPC, ERCC1, DDB1, CDK7) in BRL-23 vs. BRL-24 across conditions',
    'Epidemiological cohort study: arsenic exposure biomarkers + NER gene expression in blood/tissue + breast cancer incidence/stage, stratified by race',
    'Test whether CDK7 inhibitors (THZ1, samuraciclib) have differential sensitivity in AA vs. NHW breast cancer stem cells under arsenic',
  ];
  el.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.2rem;">` +
    limits.map(l => `<div style="background:#fff7ed;border-radius:10px;padding:1rem;border-left:3px solid #f59e0b;">
      <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem;">
        <span>${l.icon}</span><span style="font-size:.84rem;font-weight:700;color:#92400e;">${l.title}</span>
      </div>
      <p style="font-size:.8rem;color:#374151;line-height:1.55;margin:0;">${l.desc}</p>
    </div>`).join('') + `</div>
    <div style="background:#f0fdf4;border-radius:10px;padding:1.1rem;">
      <div style="font-size:.84rem;font-weight:700;color:#15803d;margin-bottom:.6rem;">🔭 Future Directions</div>
      <ul style="margin:0;padding-left:1.2rem;">${futures.map(f => `<li style="font-size:.81rem;color:#374151;line-height:1.55;margin-bottom:.35rem;">${f}</li>`).join('')}</ul>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   EXPAND KPW (heatmap pathways) to 42 — replaces existing KPW
   ══════════════════════════════════════════════════════════════*/
if (typeof KPW !== 'undefined') {
  // Remove duplicates and add missing pathways
  const additionalPWs = [
    {n:'REACTOME_NUCLEOTIDE_EXCISION_REPAIR',g:'NER'},
    {n:'REACTOME_BASE_EXCISION_REPAIR',g:'BER'},{n:'KEGG_BASE_EXCISION_REPAIR',g:'BER'},
    {n:'REACTOME_MISMATCH_REPAIR',g:'MMR'},
    {n:'REACTOME_HDR_THROUGH_HOMOLOGOUS_RECOMBINATION_HRR',g:'HR/DSB'},
    {n:'HALLMARK_G2M_CHECKPOINT',g:'Stemness'},{n:'HALLMARK_E2F_TARGETS',g:'Stemness'},
    {n:'HALLMARK_WNT_BETA_CATENIN_SIGNALING',g:'Signaling'},
    {n:'HALLMARK_TNFA_SIGNALING_VIA_NFKB',g:'Inflammation'},
    {n:'HALLMARK_INTERFERON_GAMMA_RESPONSE',g:'Inflammation'},
    {n:'HALLMARK_XENOBIOTIC_METABOLISM',g:'Metabolism'},
    {n:'HALLMARK_DNA_REPAIR',g:'Stress'},
  ];
  const existingNames = new Set(KPW.map(k => k.n));
  additionalPWs.forEach(p => { if (!existingNames.has(p.n)) KPW.push(p); });
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
   ══════════════════════════════════════════════════════════════*/
function setupScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id === 'sig-chart') buildSigChart();
        if (id === 'convergence-wrap') buildConvergence();
        if (id === 'pca-plot') buildPCA();
        if (id === 'ner-gene-hm') buildNERGeneHM();
        if (id === 'double-hit-wrap') buildDoubleHit();
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});
  ['sig-chart','convergence-wrap','pca-plot','ner-gene-hm','double-hit-wrap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════
   INFLAMMATORY PANEL COMPARISON SELECTOR
   ══════════════════════════════════════════════════════════════*/
function initInflamSelector() {
  const sel = document.getElementById('inflam-comp');
  if (!sel) return;
  sel.onchange = () => buildInflamPanel(sel.value);
  buildInflamPanel(sel.value || 'C1');
}

/* ═══════════════════════════════════════════════════════════════
   MAIN INIT
   ══════════════════════════════════════════════════════════════*/
document.addEventListener('DOMContentLoaded', function() {
  // Wait for main script to initialize deseqLook and pwLook
  setTimeout(() => {
    buildStemValidation();
    buildXPCParadox();
    buildClinical();
    buildMethods();
    buildQC();
    buildLimitations();
    initInflamSelector();
    setupScrollAnimations();
  }, 600);
});
