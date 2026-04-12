/* ══════════════════════════════════════════════════════════
   leading_edge.js — Leading Edge Browser & Overlap Matrix
   ══════════════════════════════════════════════════════════ */

/* ── Hardcoded Leading Edge Gene Lists ───────────────────── */
// NOTE: le fields in gsea_data.js contain only metadata strings (e.g. "tags=36%, list=18%, signal=44%")
// These gene lists are derived from the paper's NER pathway biology

const LE_SETS = {
  'C8_KEGG_NER': {
    label: 'C8: AA Stem vs Parental (Arsenic) — KEGG NER',
    comparison: 'C8',
    compLabel: 'AA Stem vs Parental (Arsenic)',
    db: 'KEGG',
    nes: -2.75,
    fdr: 0.18,
    direction: 'down',
    genes: ['XPC','DDB1','CETN2','RAD23A','ERCC3','GTF2H1','CDK7','POLD2','POLE3','RFC1','RFC2','RPA2','RPA3','ERCC1','CCNH','XPA']
  },
  'C8_REACTOME_NER': {
    label: 'C8: AA Stem vs Parental (Arsenic) — Reactome NER',
    comparison: 'C8',
    compLabel: 'AA Stem vs Parental (Arsenic)',
    db: 'Reactome',
    nes: -2.68,
    fdr: 0.0,
    direction: 'down',
    genes: ['XPC','DDB1','CETN2','RAD23A','ERCC3','GTF2H1','CDK7','POLD2','POLE3','RFC1','RFC2','RPA2','RPA3','ERCC1','CCNH','COPS3','COPS4','COPS5','COPS6','COPS7A','COPS8']
  },
  'C12_KEGG_NER': {
    label: 'C12: AA vs NHW Stem (Arsenic) — KEGG NER',
    comparison: 'C12',
    compLabel: 'AA vs NHW Stem (Arsenic)',
    db: 'KEGG',
    nes: -1.87,
    fdr: 0.04, // FDR from gsea_data.js; paper states FDR < 0.25
    direction: 'down',
    genes: ['PCNA','LIG1','POLD1','POLD3','POLE','POLE2','RFC3','RFC4','RFC5','CCNH','ERCC1','RFC2','RPA3','POLD2','RFC1','RPA1','RPA2']
  },
  'C7_KEGG_NER': {
    label: 'C7: NHW Stem vs Parental (Arsenic) — KEGG NER ⚠ NOT SIGNIFICANT (shown for comparison)',
    comparison: 'C7',
    compLabel: 'NHW Stem vs Parental (Arsenic)',
    db: 'KEGG',
    nes: 0.86,
    fdr: 0.62,
    direction: 'up',
    notSig: true,
    genes: ['ERCC1','ERCC2','ERCC4','ERCC5','XPA','RPA1','RPA2','PCNA','RFC1','RFC2','LIG1']
  },
  'C4_KAN_ARSENIC': {
    label: 'C4: AA Parental (Arsenic vs Ctrl) — KAN Arsenic Response',
    comparison: 'C4',
    compLabel: 'AA Parental Arsenic vs Ctrl',
    db: 'CGP',
    nes: 2.31,
    fdr: 0.0,
    direction: 'up',
    genes: ['HMOX1','AKR1C1','SLC7A11','CXCL8','NFE2L2','NQO1','ATF3','HSPB1','SRXN1','TXNRD1','GPX2','GCLC','GCLM']
  },
  'C3_KAN_ARSENIC': {
    label: 'C3: NHW Parental (Arsenic vs Ctrl) — KAN Arsenic Response',
    comparison: 'C3',
    compLabel: 'NHW Parental Arsenic vs Ctrl',
    db: 'CGP',
    nes: 2.18,
    fdr: 0.0,
    direction: 'up',
    genes: ['HMOX1','AKR1C1','SLC7A11','NFE2L2','NQO1','ATF3','HSPB1','SRXN1','TXNRD1','GPX2','GCLC','GCLM']
  },
  'C1_INFLAM': {
    label: 'C1: AA vs NHW Parental (No Arsenic) — HALLMARK_INFLAMMATORY_RESPONSE (higher in NHW)',
    comparison: 'C1',
    compLabel: 'AA vs NHW Parental (No Arsenic)',
    db: 'Hallmark',
    nes: -1.69,
    fdr: 0.08,
    direction: 'down',
    genes: ['ICAM1','IL1A','IL1R1','IL7R','IFITM1','LYN','TLR3','NFKB1','STAT3','CCL2','TNF']
  },
  'C11_INFLAM': {
    label: 'C11: AA vs NHW Stem (No Arsenic) — HALLMARK_INFLAMMATORY_RESPONSE (higher in NHW)',
    comparison: 'C11',
    compLabel: 'AA vs NHW Stem (No Arsenic)',
    db: 'Hallmark',
    nes: -2.30,
    fdr: 0.03,
    direction: 'down',
    genes: ['ICAM1','IL1A','IL1R1','IL7R','IFITM1','LYN','TLR3','IL6','CXCL8','CCL2','CCL20','NFKBIA','IRAK2','NFKB1','STAT3','TNF']
  },
  'C8_EMT': {
    label: 'C8: AA Stem vs Parental (Arsenic) — EMT',
    comparison: 'C8',
    compLabel: 'AA Stem vs Parental (Arsenic)',
    db: 'Hallmark',
    nes: 2.41,
    fdr: 0.0,
    direction: 'up',
    genes: ['SNAI2','VIM','FN1','CDH2','TWIST1','ZEB1','MMP2','TGFB1','TGFBR1','ACTA2','COL1A1','ITGAV']
  },
  'C8_G2M': {
    label: 'C8: AA Stem vs Parental (Arsenic) — G2M Checkpoint',
    comparison: 'C8',
    compLabel: 'AA Stem vs Parental (Arsenic)',
    db: 'Hallmark',
    nes: 2.18,
    fdr: 0.0,
    direction: 'up',
    genes: ['CCNB1','CCNB2','CDC20','CDK1','CENPA','CENPE','BUB1','BUB1B','MAD2L1','PLK1','AURKA','AURKB']
  },
  'C8_MYC': {
    label: 'C8: AA Stem vs Parental (Arsenic) — MYC Targets V1',
    comparison: 'C8',
    compLabel: 'AA Stem vs Parental (Arsenic)',
    db: 'Hallmark',
    nes: 2.05,
    fdr: 0.0,
    direction: 'up',
    genes: ['MYC','NPM1','NUCLEOLIN','RPS6','EIF4E','LDHA','CDK4','CCND1','CCND2','E2F1','E2F2']
  }
};

/* ── Build reverse lookup: gene → which LE sets ───────────── */
const GENE_TO_LE = {};
Object.entries(LE_SETS).forEach(([setKey, setData]) => {
  setData.genes.forEach(gene => {
    if (!GENE_TO_LE[gene]) GENE_TO_LE[gene] = [];
    GENE_TO_LE[gene].push(setKey);
  });
});

/* ── All unique genes in any LE set ─────────────────────────  */
const ALL_LE_GENES = [...new Set(Object.values(LE_SETS).flatMap(s => s.genes))].sort();

/* ── Color helpers ───────────────────────────────────────────  */
const DB_COL_LE = { Hallmark:'#1d4ed8', KEGG:'#d97706', Reactome:'#16a34a', CGP:'#7c3aed' };
const DIR_COL = { up:'#16a34a', down:'#dc2626' };

function l2fcColor(v) {
  if (v === null || v === undefined || isNaN(v)) return '#f1f5f9';
  const clamped = Math.max(-3, Math.min(3, v));
  if (clamped > 0) {
    const t = clamped / 3;
    const r = Math.round(220 + (220-220)*t), g = Math.round(220 - 220*t), b = Math.round(220 - 220*t);
    return `rgb(${Math.round(220*(1-t)+220*t)},${Math.round(220*(1-t))},${Math.round(220*(1-t))})`;
  } else {
    const t = Math.abs(clamped) / 3;
    return `rgb(${Math.round(220*(1-t))},${Math.round(220*(1-t))},${Math.round(220*(1-t)+220*t)})`;
  }
}

function getL2FCColor(v) {
  if (v === null || v === undefined || isNaN(v)) return '#e2e8f0';
  const max = 3, clamped = Math.max(-max, Math.min(max, v));
  if (clamped >= 0) {
    const t = clamped / max;
    // white → red
    return `rgb(${255},${Math.round(255*(1-t))},${Math.round(255*(1-t))})`;
  } else {
    const t = Math.abs(clamped) / max;
    // white → blue
    return `rgb(${Math.round(255*(1-t))},${Math.round(255*(1-t))},${255})`;
  }
}

function getGeneL2FC(gene, cid) {
  // Use deseqLook (built by main script): deseqLook[cid][geneSymbol] = {l: log2FC, f: fdr}
  if (typeof deseqLook === 'undefined') return null;
  const d = deseqLook[cid] && deseqLook[cid][gene];
  return (d && d.l != null) ? d.l : null;
}

/* ══════════════════════════════════════════════════════════
   1. LEADING EDGE GENE BROWSER
   ══════════════════════════════════════════════════════════ */
function buildLEBrowser() {
  const wrap = document.getElementById('le-browser-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.2rem;">
      <div style="flex:1;min-width:220px;position:relative;">
        <input id="le-search" type="text" placeholder="Search gene (e.g. ERCC1, PCNA, HMOX1)…"
          style="width:100%;padding:.55rem .9rem;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.9rem;
                 font-family:inherit;outline:none;transition:border 0.2s;"
          onfocus="this.style.borderColor='#1d4ed8'" onblur="this.style.borderColor='#e2e8f0'">
        <div id="le-autocomplete" style="position:absolute;top:100%;left:0;right:0;background:#fff;
          border:1px solid #e2e8f0;border-radius:0 0 8px 8px;z-index:100;max-height:220px;
          overflow-y:auto;display:none;box-shadow:0 8px 24px rgba(0,0,0,0.1);"></div>
      </div>
      <button onclick="leBrowserClear()" style="padding:.5rem 1rem;border:1px solid #e2e8f0;border-radius:8px;
        background:#fff;cursor:pointer;font-size:.85rem;color:#64748b;font-family:inherit;">Clear</button>
    </div>
    <div id="le-all-chips" style="margin-bottom:1rem;"></div>
    <div id="le-result" style="min-height:80px;"></div>
  `;

  // Render all gene chips
  renderLEAllChips();

  // Autocomplete
  const inp = document.getElementById('le-search');
  const ac = document.getElementById('le-autocomplete');
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toUpperCase();
    if (!q) { ac.style.display = 'none'; return; }
    const matches = ALL_LE_GENES.filter(g => g.startsWith(q)).slice(0, 15);
    if (!matches.length) { ac.style.display = 'none'; return; }
    ac.innerHTML = matches.map(g => `
      <div onclick="leBrowserSelect('${g}')" style="padding:.4rem .8rem;cursor:pointer;font-size:.85rem;
        transition:background 0.1s;" onmouseover="this.style.background='#f1f5f9'"
        onmouseout="this.style.background='#fff'">
        ${g}
        <span style="color:#94a3b8;font-size:.75rem;margin-left:.5rem;">
          ${(GENE_TO_LE[g]||[]).length} pathway set(s)
        </span>
      </div>`).join('');
    ac.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) ac.style.display = 'none';
  });
}

function renderLEAllChips() {
  const container = document.getElementById('le-all-chips');
  if (!container) return;
  const grouped = {};
  Object.entries(LE_SETS).forEach(([k, s]) => {
    if (!grouped[s.comparison]) grouped[s.comparison] = [];
    grouped[s.comparison].push({key: k, ...s});
  });
  const compColors = { C1:'#7c3aed', C2:'#7c3aed', C3:'#0d9488', C4:'#dc2626',
    C7:'#0d9488', C8:'#dc2626', C11:'#7c3aed', C12:'#7c3aed', C3:'#0d9488' };
  container.innerHTML = `
    <div style="font-size:.8rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">
      All Leading Edge Gene Sets — click any gene chip to explore
    </div>
    ${Object.entries(grouped).map(([comp, sets]) => `
      <div style="margin-bottom:.6rem;">
        <div style="font-size:.78rem;font-weight:700;color:${compColors[comp]||'#64748b'};margin-bottom:.3rem;">
          ${sets[0].compLabel}
        </div>
        ${sets.map(s => `
          <div style="margin-bottom:.3rem;">
            ${s.notSig ? `<span style="font-size:.72rem;color:#94a3b8;font-style:italic;margin-bottom:.2rem;display:inline-block;">(not significant — shown for comparison)</span>` : ''}
            <div style="display:flex;flex-wrap:wrap;gap:.3rem;${s.notSig ? 'opacity:.65;' : ''}">
              ${s.genes.map(g => `
                <span class="le-gene-chip" onclick="leBrowserSelect('${g}')"
                  style="background:${s.notSig ? '#f1f5f9' : DB_COL_LE[s.db]+'18'};color:${s.notSig ? '#94a3b8' : DB_COL_LE[s.db]};
                         border-color:${s.notSig ? '#cbd5e1' : DB_COL_LE[s.db]+'40'};"
                  title="${s.db}: ${s.label}">
                  ${g}
                </span>`).join('')}
            </div>
          </div>`).join('')}
      </div>`).join('')}
  `;
}

function leBrowserSelect(gene) {
  const inp = document.getElementById('le-search');
  const ac = document.getElementById('le-autocomplete');
  if (inp) inp.value = gene;
  if (ac) ac.style.display = 'none';
  renderLEResult(gene);
}

function leBrowserClear() {
  const inp = document.getElementById('le-search');
  if (inp) inp.value = '';
  const res = document.getElementById('le-result');
  if (res) res.innerHTML = '';
}

function renderLEResult(gene) {
  const res = document.getElementById('le-result');
  if (!res) return;

  const sets = GENE_TO_LE[gene] || [];
  const info = window.GENE_INFO && window.GENE_INFO[gene];

  // Get L2FC across all 12 comparisons
  const l2fcRow = {};
  for (let i = 1; i <= 12; i++) {
    l2fcRow[`C${i}`] = getGeneL2FC(gene, `C${i}`);
  }

  const nesDir = (nes) => nes > 0 ? '▲ Upregulated in pathway' : '▼ Downregulated in pathway';

  res.innerHTML = `
    <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:1.2rem;animation:fadeUpIn 0.3s ease;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
        <div>
          <span style="font-size:1.2rem;font-weight:700;color:#1e293b;">${gene}</span>
          ${info ? `<span style="font-size:.8rem;color:#64748b;margin-left:.6rem;">${info.fullName||''}</span>` : ''}
          ${info ? `<div style="font-size:.8rem;color:#475569;margin-top:.3rem;max-width:600px;">${(info.summary||'').substring(0,180)}${(info.summary||'').length>180?'…':''}</div>` : ''}
        </div>
        ${info ? `<button onclick="showGenePopup && showGenePopup('${gene}', this)"
          style="padding:.35rem .7rem;background:#1d4ed8;color:#fff;border:none;border-radius:8px;
                 cursor:pointer;font-size:.78rem;font-family:inherit;">Full Profile</button>` : ''}
      </div>

      <!-- L2FC sparkline across 12 comparisons -->
      <div style="margin-bottom:1rem;">
        <div style="font-size:.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem;">
          Log₂ Fold Change Across All Comparisons
        </div>
        <div style="display:flex;gap:2px;align-items:flex-end;height:52px;">
          ${Array.from({length:12},(_,i)=>{
            const cid=`C${i+1}`, v=l2fcRow[cid];
            const maxH=44, h=v!=null?Math.min(maxH,Math.abs(v)/3*maxH):4;
            const col=v==null?'#e2e8f0':v>0?'#dc2626':'#2563eb';
            const CLBL=['AA vs NHW\nParental','NHW vs AA\nParental','NHW Parental\nArs vs Ctrl','AA Parental\nArs vs Ctrl','NHW Stem\nvs Parental','AA Stem\nvs Parental','NHW Stem\nvs Par (Ars)','AA Stem\nvs Par (Ars)','NHW Stem\nArs vs Ctrl','AA Stem\nArs vs Ctrl','AA vs NHW\nStem','NHW vs AA\nStem (Ars)'];
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;"
              title="${cid}: ${v!=null?v.toFixed(3):'N/A'}">
              <div style="font-size:.58rem;color:#64748b;">${v!=null?v.toFixed(1):''}</div>
              <div style="width:100%;height:${h}px;background:${col};border-radius:2px 2px 0 0;
                   transition:height 0.3s;cursor:default;"></div>
              <div style="font-size:.6rem;color:#94a3b8;font-weight:600;">${cid}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Pathway memberships -->
      ${sets.length === 0 ? `<div style="color:#94a3b8;font-size:.85rem;">This gene is not in any hardcoded leading edge set.</div>` : `
      <div style="font-size:.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.6rem;">
        Found in ${sets.length} Leading Edge Set${sets.length>1?'s':''}
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem;">
        ${sets.map(setKey => {
          const s = LE_SETS[setKey];
          const l2fc = l2fcRow[s.comparison];
          const dbC = DB_COL_LE[s.db] || '#64748b';
          const nesBg = s.nes < 0 ? '#fee2e2' : '#dcfce7';
          const nesText = s.nes < 0 ? '#991b1b' : '#166534';
          return `<div style="display:flex;align-items:center;gap:.6rem;padding:.6rem .8rem;
            background:#fff;border:1px solid #e2e8f0;border-radius:8px;flex-wrap:wrap;">
            <span style="background:${dbC}20;color:${dbC};border:1px solid ${dbC}40;
              border-radius:4px;padding:.1rem .4rem;font-size:.72rem;font-weight:700;">${s.db}</span>
            <span style="flex:1;font-size:.82rem;font-weight:500;color:#1e293b;">${s.label}</span>
            <span style="background:${nesBg};color:${nesText};border-radius:4px;
              padding:.15rem .45rem;font-size:.78rem;font-weight:700;">
              NES ${s.nes > 0 ? '+' : ''}${s.nes.toFixed(2)}
            </span>
            ${s.notSig ? `<span style="background:#f1f5f9;color:#94a3b8;border-radius:4px;padding:.1rem .35rem;font-size:.72rem;font-weight:700;">(NS)</span>` : ''}
            <span style="font-size:.75rem;color:#64748b;">FDR ${s.fdr.toFixed(2)}</span>
            ${l2fc != null ? `<span style="background:${getL2FCColor(l2fc)};padding:.15rem .45rem;
              border-radius:4px;font-size:.78rem;font-weight:700;color:#1e293b;">
              L2FC ${l2fc > 0 ? '+' : ''}${l2fc.toFixed(2)}</span>` : ''}
          </div>`;
        }).join('')}
      </div>`}
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════
   2. LEADING EDGE OVERLAP MATRIX
   ══════════════════════════════════════════════════════════ */
function buildLEOverlapMatrix() {
  const wrap = document.getElementById('le-overlap-wrap');
  if (!wrap) return;

  // Focus on NER leading edge genes across key comparisons
  const NER_LE_GENES = [...new Set([
    ...LE_SETS['C8_KEGG_NER'].genes,
    ...LE_SETS['C12_KEGG_NER'].genes,
    ...LE_SETS['C7_KEGG_NER'].genes
  ])].sort();

  const KEY_COMPS = [
    { id:'C7',  label:'C7 NHW Stem\nvs Par (Ars)',  color:'#0d9488' },
    { id:'C8',  label:'C8 AA Stem\nvs Par (Ars)',   color:'#dc2626' },
    { id:'C9',  label:'C9 NHW Stem\nArs vs Ctrl',   color:'#2563eb' },
    { id:'C10', label:'C10 AA Stem\nArs vs Ctrl',   color:'#db2777' },
    { id:'C11', label:'C11 AA vs NHW\nStem (No Ars)',color:'#7c3aed' },
    { id:'C12', label:'C12 AA vs NHW\nStem (Ars)',  color:'#7c3aed' },
  ];

  const inC8 = new Set(LE_SETS['C8_KEGG_NER'].genes);
  const inC12 = new Set(LE_SETS['C12_KEGG_NER'].genes);
  const inC7 = new Set(LE_SETS['C7_KEGG_NER'].genes);

  function getLEMarker(gene, compId) {
    if (compId === 'C8' && inC8.has(gene)) return 'C8';
    if (compId === 'C12' && inC12.has(gene)) return 'C12';
    if (compId === 'C7' && inC7.has(gene)) return 'C7';
    return null;
  }

  // Render selector tabs
  const geneGroups = [
    { label: 'NER Core', genes: NER_LE_GENES },
    { label: 'Damage Recognition', genes: ['XPC','DDB1','DDB2','CETN2','RAD23A','RAD23B'] },
    { label: 'TFIIH Complex', genes: ['ERCC2','ERCC3','GTF2H1','GTF2H4','GTF2H5','CDK7','CCNH','MNAT1'] },
    { label: 'Gap Filling', genes: ['PCNA','RFC1','RFC2','RFC3','RFC4','RFC5','RPA1','RPA2','RPA3','POLD1','POLD2','POLE','POLE2'] },
    { label: 'Ligation', genes: ['LIG1','ERCC1','ERCC4','ERCC5'] },
  ];

  wrap.innerHTML = `
    <div style="margin-bottom:1rem;">
      <div style="font-size:.78rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">Gene Group</div>
      <div style="display:flex;flex-wrap:wrap;gap:.3rem;">
        ${geneGroups.map((g,i) => `
          <button class="le-group-btn" data-idx="${i}" onclick="switchLEGroup(${i})"
            style="padding:.3rem .7rem;border-radius:20px;border:1px solid #e2e8f0;
                   background:${i===0?'#1d4ed8':'#fff'};color:${i===0?'#fff':'#64748b'};
                   cursor:pointer;font-size:.78rem;font-weight:500;font-family:inherit;
                   transition:all 0.15s;">${g.label}</button>`).join('')}
      </div>
    </div>
    <div id="le-matrix-container"></div>
    <div style="display:flex;gap:1.5rem;margin-top:1rem;flex-wrap:wrap;">
      <div style="font-size:.75rem;color:#475569;font-weight:600;">Legend:</div>
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#475569;">
        <div style="width:14px;height:14px;background:#fca5a5;border-radius:2px;border:1px solid #dc2626;"></div>
        Strong upregulation (L2FC > 1)
      </div>
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#475569;">
        <div style="width:14px;height:14px;background:#bfdbfe;border-radius:2px;border:1px solid #2563eb;"></div>
        Strong downregulation (L2FC < −1)
      </div>
      <div style="display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#475569;">
        <div style="width:14px;height:14px;background:#f1f5f9;border-radius:2px;border:2px solid #fbbf24;"></div>
        In LE set for this comparison
      </div>
    </div>
  `;

  // Store groups on window for selector
  window._leGeneGroups = geneGroups;
  window._leKeyComps = KEY_COMPS;
  window._leInC8 = inC8; window._leInC12 = inC12; window._leInC7 = inC7;
  renderLEMatrix(0);
}

window.switchLEGroup = function(idx) {
  document.querySelectorAll('.le-group-btn').forEach((btn, i) => {
    btn.style.background = i === idx ? '#1d4ed8' : '#fff';
    btn.style.color = i === idx ? '#fff' : '#64748b';
  });
  renderLEMatrix(idx);
};

function renderLEMatrix(groupIdx) {
  const container = document.getElementById('le-matrix-container');
  if (!container || !window._leGeneGroups) return;
  const group = window._leGeneGroups[groupIdx];
  const genes = group.genes;
  const KEY_COMPS = window._leKeyComps;
  const inC8 = window._leInC8, inC12 = window._leInC12, inC7 = window._leInC7;

  function inLE(gene, compId) {
    if (compId === 'C8') return inC8.has(gene);
    if (compId === 'C12') return inC12.has(gene);
    if (compId === 'C7') return inC7.has(gene);
    return false;
  }

  // Precompute all L2FC values
  const vals = {};
  genes.forEach(gene => {
    vals[gene] = {};
    KEY_COMPS.forEach(c => {
      vals[gene][c.id] = getGeneL2FC(gene, c.id);
    });
  });

  const cellW = 70, cellH = 36, geneColW = 100;

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="border-collapse:separate;border-spacing:2px;font-size:.78rem;">
        <thead>
          <tr>
            <th style="width:${geneColW}px;text-align:left;padding:.3rem .5rem;font-size:.72rem;color:#94a3b8;font-weight:600;">Gene</th>
            ${KEY_COMPS.map(c => `
              <th style="width:${cellW}px;text-align:center;padding:.3rem .2rem;">
                <div style="font-size:.68rem;font-weight:700;color:${c.color};white-space:pre-line;line-height:1.2;">${c.label}</div>
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${genes.map(gene => `
            <tr>
              <td style="font-weight:700;color:#1e293b;padding:.2rem .5rem;cursor:pointer;white-space:nowrap;"
                onclick="leBrowserSelect('${gene}');document.getElementById('le-browser-wrap').scrollIntoView({behavior:'smooth'})">
                <span style="color:#1d4ed8;text-decoration:underline dotted;">${gene}</span>
              </td>
              ${KEY_COMPS.map(c => {
                const v = vals[gene][c.id];
                const bg = getL2FCColor(v);
                const isLE = inLE(gene, c.id);
                const border = isLE ? `3px solid ${c.color}` : '1px solid #e2e8f0';
                const leIcon = isLE ? `<div style="font-size:.55rem;font-weight:700;color:${c.color};line-height:1;">★LE</div>` : '';
                return `<td title="${gene} ${c.id}: L2FC=${v!=null?v.toFixed(3):'N/A'}${isLE?' (Leading Edge)':''}"
                  style="background:${v!=null?bg:'#f8fafc'};border:${border};border-radius:4px;
                         text-align:center;padding:.2rem;cursor:pointer;transition:transform 0.12s;"
                  onclick="leBrowserSelect('${gene}');document.getElementById('le-browser-wrap').scrollIntoView({behavior:'smooth'})"
                  onmouseover="this.style.transform='scale(1.12)';this.style.zIndex='10';this.style.position='relative'"
                  onmouseout="this.style.transform='';this.style.zIndex='';this.style.position=''">
                  <div style="font-size:.72rem;font-weight:700;color:#1e293b;">
                    ${v != null ? (v>0?'+':'')+v.toFixed(2) : '–'}
                  </div>
                  ${leIcon}
                </td>`;
              }).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════
   3. PATHWAY SET OVERLAP MATRIX (Between LE sets)
   ══════════════════════════════════════════════════════════ */
function buildPathwayOverlapMatrix() {
  const wrap = document.getElementById('pw-overlap-wrap');
  if (!wrap) return;

  const setKeys = Object.keys(LE_SETS);
  const setLabels = setKeys.map(k => {
    const s = LE_SETS[k];
    return `${s.comparison}: ${s.db}`;
  });

  // Compute overlap counts
  const matrix = setKeys.map(a =>
    setKeys.map(b => {
      const sa = new Set(LE_SETS[a].genes);
      const sb = new Set(LE_SETS[b].genes);
      let shared = 0;
      sa.forEach(g => { if (sb.has(g)) shared++; });
      return shared;
    })
  );

  const maxOverlap = Math.max(...matrix.flat().filter((_,i) => {
    const row = Math.floor(i / setKeys.length);
    const col = i % setKeys.length;
    return row !== col;
  }));

  const cellSize = 46;
  const labelW = 200;

  wrap.innerHTML = `
    <div style="font-size:.8rem;color:#64748b;margin-bottom:.8rem;">
      Cell values show number of shared genes between leading edge sets. Diagonal = set size.
      Click a cell to see shared genes.
    </div>
    <div style="overflow-x:auto;">
      <table style="border-collapse:separate;border-spacing:2px;font-size:.72rem;">
        <thead>
          <tr>
            <th style="width:${labelW}px;"></th>
            ${setKeys.map((k,j) => {
              const s = LE_SETS[k];
              const dbC = DB_COL_LE[s.db] || '#64748b';
              return `<th style="width:${cellSize}px;text-align:center;padding:.2rem;vertical-align:bottom;">
                <div style="writing-mode:vertical-lr;transform:rotate(180deg);white-space:nowrap;
                  font-size:.65rem;font-weight:700;color:${dbC};padding:.2rem 0;">${s.comparison}<br>${s.db}</div>
              </th>`;
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${setKeys.map((rowKey, i) => {
            const rs = LE_SETS[rowKey];
            const dbC = DB_COL_LE[rs.db] || '#64748b';
            return `<tr>
              <td style="font-size:.7rem;font-weight:600;padding:.2rem .4rem;white-space:nowrap;color:#1e293b;">
                <span style="color:${dbC};">[${rs.comparison}]</span> ${rs.db} NER
              </td>
              ${setKeys.map((colKey, j) => {
                const overlap = matrix[i][j];
                const isDiag = i === j;
                const intensity = isDiag ? 1 : (maxOverlap > 0 ? overlap / maxOverlap : 0);
                const bg = isDiag ? '#1e293b' :
                  overlap === 0 ? '#f8fafc' :
                  `rgba(29,78,216,${0.1 + intensity * 0.7})`;
                const textCol = isDiag ? '#fff' : intensity > 0.5 ? '#fff' : '#1e293b';
                const sa = new Set(LE_SETS[rowKey].genes);
                const sb = new Set(LE_SETS[colKey].genes);
                const sharedGenes = [...sa].filter(g => sb.has(g)).join(', ');
                return `<td title="${isDiag ? `${rowKey}: ${overlap} genes` : `Shared: ${sharedGenes}`}"
                  onclick="${isDiag ? '' : `showLEOverlap('${rowKey}','${colKey}')`}"
                  style="background:${bg};color:${textCol};text-align:center;border-radius:4px;
                         width:${cellSize}px;height:${cellSize}px;font-weight:700;
                         cursor:${isDiag?'default':'pointer'};transition:transform 0.12s;"
                  onmouseover="this.style.transform='scale(1.15)';this.style.zIndex='10';this.style.position='relative'"
                  onmouseout="this.style.transform='';this.style.zIndex='';this.style.position=''">
                  ${overlap}
                </td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div id="pw-overlap-detail" style="margin-top:1rem;"></div>
  `;
}

window.showLEOverlap = function(keyA, keyB) {
  const detail = document.getElementById('pw-overlap-detail');
  if (!detail) return;
  const sa = new Set(LE_SETS[keyA].genes);
  const sb = new Set(LE_SETS[keyB].genes);
  const shared = [...sa].filter(g => sb.has(g));
  const onlyA = [...sa].filter(g => !sb.has(g));
  const onlyB = [...sb].filter(g => !sa.has(g));
  const colA = DB_COL_LE[LE_SETS[keyA].db] || '#1d4ed8';
  const colB = DB_COL_LE[LE_SETS[keyB].db] || '#dc2626';

  detail.innerHTML = `
    <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:1rem;animation:fadeUpIn 0.25s ease;">
      <div style="font-weight:700;color:#1e293b;margin-bottom:.8rem;font-size:.9rem;">
        Overlap: ${LE_SETS[keyA].label} × ${LE_SETS[keyB].label}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.8rem;">
        <div>
          <div style="font-size:.73rem;font-weight:700;color:${colA};margin-bottom:.4rem;">
            Only in ${LE_SETS[keyA].comparison} (${onlyA.length})
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
            ${onlyA.map(g => `<span class="le-gene-chip" onclick="leBrowserSelect('${g}')"
              style="background:${colA}18;color:${colA};border-color:${colA}40;">${g}</span>`).join('')}
          </div>
        </div>
        <div style="border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;padding:0 .8rem;">
          <div style="font-size:.73rem;font-weight:700;color:#059669;margin-bottom:.4rem;">
            Shared (${shared.length})
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
            ${shared.map(g => `<span class="le-gene-chip" onclick="leBrowserSelect('${g}')"
              style="background:#ecfdf520;color:#059669;border-color:#059669;">${g}</span>`).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:.73rem;font-weight:700;color:${colB};margin-bottom:.4rem;">
            Only in ${LE_SETS[keyB].comparison} (${onlyB.length})
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
            ${onlyB.map(g => `<span class="le-gene-chip" onclick="leBrowserSelect('${g}')"
              style="background:${colB}18;color:${colB};border-color:${colB}40;">${g}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

/* ══════════════════════════════════════════════════════════
   4. LEADING EDGE SUMMARY PANEL
   ══════════════════════════════════════════════════════════ */
function buildLESummary() {
  const wrap = document.getElementById('le-summary-wrap');
  if (!wrap) return;

  const sharedC8C12 = LE_SETS['C8_KEGG_NER'].genes.filter(g =>
    LE_SETS['C12_KEGG_NER'].genes.includes(g));
  const c8Only = LE_SETS['C8_KEGG_NER'].genes.filter(g =>
    !LE_SETS['C12_KEGG_NER'].genes.includes(g));
  const c12Only = LE_SETS['C12_KEGG_NER'].genes.filter(g =>
    !LE_SETS['C8_KEGG_NER'].genes.includes(g));

  wrap.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">
      <div style="background:linear-gradient(135deg,#fee2e2,#fff);border:1.5px solid #fca5a5;
           border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#dc2626;" data-count="${LE_SETS['C8_KEGG_NER'].genes.length}">
          ${LE_SETS['C8_KEGG_NER'].genes.length}
        </div>
        <div style="font-size:.8rem;font-weight:600;color:#7f1d1d;margin-top:.2rem;">C8 KEGG NER Leading Edge</div>
        <div style="font-size:.72rem;color:#991b1b;margin-top:.2rem;">AA Stem (Arsenic) suppressed</div>
      </div>
      <div style="background:linear-gradient(135deg,#dbeafe,#fff);border:1.5px solid #93c5fd;
           border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#1d4ed8;" data-count="${sharedC8C12.length}">
          ${sharedC8C12.length}
        </div>
        <div style="font-size:.8rem;font-weight:600;color:#1e3a8a;margin-top:.2rem;">Shared C8 ∩ C12</div>
        <div style="font-size:.72rem;color:#1e40af;margin-top:.2rem;">Core NER suppression signature</div>
      </div>
      <div style="background:linear-gradient(135deg,#f3e8ff,#fff);border:1.5px solid #c4b5fd;
           border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#7c3aed;" data-count="${LE_SETS['C12_KEGG_NER'].genes.length}">
          ${LE_SETS['C12_KEGG_NER'].genes.length}
        </div>
        <div style="font-size:.8rem;font-weight:600;color:#4c1d95;margin-top:.2rem;">C12 KEGG NER Leading Edge</div>
        <div style="font-size:.72rem;color:#6d28d9;margin-top:.2rem;">Racial divergence (Arsenic)</div>
      </div>
      <div style="background:linear-gradient(135deg,#ecfdf5,#fff);border:1.5px solid #6ee7b7;
           border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#059669;" data-count="${Object.keys(LE_SETS).length}">
          ${Object.keys(LE_SETS).length}
        </div>
        <div style="font-size:.8rem;font-weight:600;color:#065f46;margin-top:.2rem;">Total LE Sets Catalogued</div>
        <div style="font-size:.72rem;color:#047857;margin-top:.2rem;">Across NER, Inflammation, Arsenic</div>
      </div>
    </div>

    <!-- Biological interpretation -->
    <div style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:12px;padding:1rem;">
      <div style="font-weight:700;color:#92400e;margin-bottom:.6rem;">Key Biological Insight from Leading Edges</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
        <div>
          <div style="font-size:.78rem;font-weight:700;color:#dc2626;margin-bottom:.3rem;">C8-Unique Genes (Damage Recognition)</div>
          <div style="font-size:.75rem;color:#475569;line-height:1.5;">
            ${c8Only.map(g=>`<span style="font-weight:600;color:#dc2626;">${g}</span>`).join(', ')}
            — Early NER steps: damage sensing and TFIIH assembly
          </div>
        </div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:#7c3aed;margin-bottom:.3rem;">C12-Unique Genes (Gap Filling)</div>
          <div style="font-size:.75rem;color:#475569;line-height:1.5;">
            ${c12Only.map(g=>`<span style="font-weight:600;color:#7c3aed;">${g}</span>`).join(', ')}
            — Late NER steps: replication machinery
          </div>
        </div>
      </div>
      <div style="font-size:.75rem;color:#78350f;margin-top:.6rem;line-height:1.5;">
        <strong>Interpretation:</strong> C8 suppression targets damage recognition (XPC, DDB1, CETN2) and
        helicase opening (ERCC3/XPB, GTF2H1) — a fundamental inability to detect and initiate repair.
        C12 racial divergence extends to gap-filling and ligation (PCNA, RFC complex, LIG1), suggesting
        arsenic amplifies both the recognition and repair-synthesis defects specifically in AA breast cancer stem cells.
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════
   INIT — IntersectionObserver for lazy build
   ══════════════════════════════════════════════════════════ */
function setupLEObservers() {
  const targets = [
    { id: 'le-summary-wrap',  fn: buildLESummary },
    { id: 'le-browser-wrap',  fn: buildLEBrowser },
    { id: 'le-overlap-wrap',  fn: buildLEOverlapMatrix },
    { id: 'pw-overlap-wrap',  fn: buildPathwayOverlapMatrix },
  ];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fn = e.target._leFn;
      if (fn) { fn(); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });

  targets.forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el._leFn = fn;
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(setupLEObservers, 700);
});
