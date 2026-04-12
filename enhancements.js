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
const INFLAM_CORE = ['ICAM1','IL1A','IL1R1','IL7R','IFITM1','LYN','TLR3']; // C1 & C11
const INFLAM_STEM = ['IL6','CXCL8','CCL2','CCL20','NFKBIA','IRAK2','HIF1A']; // C11 only gains
const INFLAM_ARS  = ['NAMPT','ADORA2B','BDKRB1','CD82','CXCL6','AHR','TNF','NFKB1','STAT3']; // additional

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
  if (!el) return;
  const labels = CID.map(c => `${c}<br><span style="font-size:9px">${CLBL[c].split('—')[1]||CLBL[c].split(':')[1]||''}</span>`);
  const vals = CID.map(c => SIG_COUNTS[c]);
  const cols = CID.map(c => CCOL[c]);
  Plotly.newPlot(el, [{
    x: CID.map(c => SIG_COUNTS[c]),
    y: CID,
    type: 'bar',
    orientation: 'h',
    marker: {color: CID.map(c => CCOL[c]), opacity: 0.88,
      line: {color: CID.map(c => CCOL[c]), width: 1.5}},
    text: CID.map(c => SIG_COUNTS[c]),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>%{x} significant pathways<extra></extra>',
    cliponaxis: false,
  }], {
    xaxis: {title: 'Significant pathways (|NES| > 1.5, FDR < 0.25)', gridcolor: '#f1f5f9', zeroline: false, range: [0, 1150]},
    yaxis: {autorange: 'reversed', tickfont: {size: 11}},
    margin: {l: 55, r: 80, t: 20, b: 55},
    height: 340,
    plot_bgcolor: '#fafafa', paper_bgcolor: '#fff',
    font: {family: 'Inter, sans-serif', size: 11},
    shapes: [{type:'line',x0:71,x1:71,y0:-0.5,y1:11.5,line:{color:'#7c3aed',dash:'dot',width:1.5}},
             {type:'line',x0:57,x1:57,y0:-0.5,y1:11.5,line:{color:'#7c3aed',dash:'dot',width:1.5}}],
    annotations: [
      {x:71,y:0,text:'Racial\nbaseline',showarrow:false,font:{size:9,color:'#7c3aed'},xanchor:'left',yanchor:'bottom'},
      {x:SIG_COUNTS['C2'],y:'C2',text:'\u2190 100% NHW direction',showarrow:false,font:{size:9,color:'#1d4ed8'},xanchor:'left',xshift:5},
      {x:SIG_COUNTS['C3'],y:'C3',text:'2.1\u00d7 more than C4 \u2192 NHW more arsenic-primed (Theme 3)',showarrow:false,font:{size:8.5,color:'#0891b2'},xanchor:'left',xshift:5}
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
  s += group(10, 10, 340, 130, 'Core Signature — Shared C1 & C11 (AA vs. NHW)', INFLAM_CORE, 4, '#fff1f2', '#fecdd3');
  // C11-only gains
  s += group(360, 10, 340, 130, 'Amplified in Stem Cells — C11 Additions', INFLAM_STEM, 4, '#fff7ed', '#fed7aa');
  // Additional
  s += group(710, 10, 240, 130, 'Additional Inflammatory', INFLAM_ARS, 3, '#f5f3ff', '#ddd6fe');
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
  <text x="755" y="164" text-anchor="middle" font-size="10" fill="#374151">ERCC1, CDK7, CCNH, RFC2, RPA3</text>
  <text x="755" y="178" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">Less repair capacity (NES −2.75)</text>

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
     body:'Low ERCC1 expression (as found in AA stem cells under arsenic) predicts elevated susceptibility to arsenic-induced mutagenesis. Conversely, high ERCC1 confers platinum chemotherapy resistance — making ERCC1 a dual biomarker of environmental vulnerability AND treatment resistance. ERCC1 protein levels are measurable by immunohistochemistry (IHC) in clinical tissue samples. Published studies in breast cancer demonstrate that low ERCC1 expression correlates with improved response to platinum-based chemotherapy (cisplatin, carboplatin). This suggests AA breast cancer patients with stem cell-enriched tumors may be selectively sensitive to platinum-based regimens — an actionable therapeutic hypothesis.'},
    {icon:'🌍',title:'Environmental Exposure Context',col:'#d97706',bg:'#fff7ed',
     body:'Arsenic in drinking water affects millions of Americans, with particularly elevated levels in South Florida and other Southern states. These same communities show elevated rates of advanced breast cancer diagnosis in AA women. This study provides a mechanistic framework connecting environmental arsenic exposure to race-specific cancer stem cell vulnerability. Arsenic exposure is not hypothetical in the study population. Arsenic levels exceeding California\'s Public Health Goal have been documented in water supplies serving zip codes with elevated breast cancer incidence rates — including South Florida communities with high proportions of AA residents. The 0.3 µM dose used in this study falls within the range of chronic environmental exposure.'},
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
      <p><strong>BRL-23 (NHW):</strong> Derived from reduction mammoplasty of a premenopausal Non-Hispanic White woman. <strong>BRL-24 (AA):</strong> Same source, premenopausal African American. Both karyotyped — confirmed normal chromosomal content.</p>
      <p><strong>Arsenic dose:</strong> 0.3 µM arsenite (As³⁺) — corresponding to the LC₁₀ (10% lethal concentration). This models <em>chronic, low-dose environmental exposure</em> rather than therapeutic doses. Stock: 40 mM in PBS, filter-sterilized, fed every other day + 1 hour before harvest. Duration: 14 days (~2–3 population doublings).</p>
    `},
    {title:'Cancer Stem Cell Isolation (FACS)',content:`
      <p><strong>Surface markers:</strong> CD24-FITC (loss → dedifferentiation), CD49f-PE (integrin α6, mammary progenitor marker), CD44-APC (cancer stem cell adhesion receptor). DAPI for viability. Fluorescence-minus-one (FMO) controls for gating.</p>
      <p><strong>Instrument:</strong> BD FACS Aria cell sorter. <strong>Yield:</strong> 2–5% viable cells, consistent across BRL-23, BRL-24, vehicle, and arsenic conditions. n=3 biological replicates for parental; n=1 per group for stem (sorting yield constraint).</p>
    `},
    {title:'RNA Sequencing',content:`
      <p><strong>Quality:</strong> RIN ≥ 9 all 16 samples, NanoDrop A260/A280: 1.9–2.1. <strong>Library prep:</strong> 150 bp paired-end. <strong>Depth:</strong> 41–72 million read pairs per sample. <strong>Phred scores:</strong> ~33 arsenic-treated parental, ~38 vehicle and stem (separate library batch for stem).</p>
      <p><strong>Alignment:</strong> STAR aligner, GRCh38 (hg38) + Ensembl release 105, strict paired-end compatibility, minimum 75% read overlap. <strong>Count filter:</strong> ≥10 summed reads across all 16 samples → 16,682 genes in final matrix.</p>
    `},
    {title:'DESeq2 Statistical Model',content:`
      <p><strong>Model:</strong> Full factorial interaction: <code>~ ethnicity + Treatment + Type + ethnicity×Treatment + ethnicity×Type + Treatment×Type</code>. Reference levels: Vehicle, Parental, NHW.</p>
      <p><strong>Normalization:</strong> Median-of-ratios (DESeq2 internal). <strong>Shrinkage:</strong> apeglm (adaptive t-prior) on log₂FC — stabilizes estimates for lowly expressed genes and single-replicate stem comparisons. <strong>Significance:</strong> FDR &lt; 0.05 (Benjamini-Hochberg). Variance borrowed from n=3 parental replicates for n=1 stem comparisons via empirical Bayes dispersion estimation.</p>
    `},
    {title:'GSEA Analysis',content:`
      <p><strong>Method:</strong> GSEAPreranked v4.4.0. <strong>Rank metric:</strong> −log₁₀(p-value) × sign(shrunken L2FC). <strong>Parameters:</strong> 1,000 permutations, fixed seed 149, weighted enrichment statistic, gene set size 15–500 genes.</p>
      <p><strong>Databases:</strong> (1) Hallmark (50 curated sets, minimal overlap), (2) KEGG Legacy (mechanistic pathway maps), (3) Reactome (hierarchical pathway annotations), (4) CGP (empirical signatures including KAN_RESPONSE_TO_ARSENIC_TRIOXIDE, BenPorath, Pece). Total: 48 runs (12 comparisons × 4 databases).</p>
      <p><strong>Significance threshold:</strong> |NES| &gt; 1.5 AND FDR &lt; 0.25 (standard GSEA criterion accounting for multiple testing burden across thousands of pathways).</p>
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
    {icon:'⚠️',title:'Mechanism of baseline NER differences unexplained',desc:'Why do AA stem cells have lower NER expression at baseline (C5/C6, before arsenic) versus NHW stem cells? Epigenetic mechanisms (CpG methylation of XPC, DDB1, ERCC1 promoters) are suspected but not yet investigated in this dataset.'},
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
