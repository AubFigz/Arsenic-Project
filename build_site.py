"""Build the interactive website for the Arsenic & Breast Cancer paper."""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arsenic &amp; Breast Cancer Disparities &mdash; Interactive Explorer</title>
<script src="deseq_data.js"></script>
<script src="gsea_data.js"></script>
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#f0f4f8;--card:#fff;--border:#e2e8f0;--text:#1e293b;--text2:#64748b;--blue:#1d4ed8;--blue-lt:#dbeafe;--red:#dc2626;--red-lt:#fee2e2;--amber:#d97706;--green:#16a34a;--purple:#7c3aed;--teal:#0891b2;--pink:#db2777;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
a{color:var(--blue);text-decoration:none;}
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:56px;}
nav .logo{font-weight:700;font-size:.95rem;color:var(--text);display:flex;align-items:center;gap:.5rem;}
.dot{width:10px;height:10px;background:var(--red);border-radius:50%;display:inline-block;}
nav .links{display:flex;gap:.2rem;}
nav .links a{padding:.3rem .7rem;border-radius:6px;font-size:.82rem;font-weight:500;color:var(--text2);transition:all .15s;}
nav .links a:hover,.nav-active{background:var(--blue-lt)!important;color:var(--blue)!important;}
.hero{background:linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 55%,#7c3aed 100%);color:#fff;padding:3.5rem 2rem 2.5rem;}
.hero-inner{max-width:1100px;margin:0 auto;}
.hero h1{font-size:clamp(1.3rem,3vw,2rem);font-weight:700;line-height:1.3;margin-bottom:.9rem;}
.hero p{font-size:.95rem;opacity:.85;max-width:760px;margin-bottom:1.3rem;}
.hero-badges{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.8rem;}
.badge{display:inline-flex;align-items:center;gap:.3rem;padding:.22rem .7rem;border-radius:20px;font-size:.78rem;font-weight:600;}
.badge-w{background:rgba(255,255,255,.2);color:#fff;}
.badge-a{background:#fef3c7;color:#92400e;}
.finding-box{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:12px;padding:1.2rem 1.4rem;max-width:800px;}
.finding-box h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;opacity:.7;margin-bottom:.4rem;}
.three-way{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.9rem;}
.req{background:rgba(255,255,255,.2);border-radius:8px;padding:.45rem .85rem;font-size:.82rem;display:flex;align-items:center;gap:.4rem;}
.req .n{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0;}
.section{padding:2.5rem 2rem;max-width:1200px;margin:0 auto;}
.section-header{margin-bottom:1.3rem;}
.section-header h2{font-size:1.35rem;font-weight:700;}
.section-header p{font-size:.88rem;color:var(--text2);margin-top:.2rem;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1rem;margin-bottom:2rem;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.2rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.07);}
.stat-card .val{font-size:1.7rem;font-weight:700;color:var(--blue);display:block;}
.stat-card .lbl{font-size:.77rem;color:var(--text2);margin-top:.15rem;}
.stat-card.hl .val{color:var(--red);}
.hm-wrap{overflow-x:auto;}
.hm-grid{display:grid;min-width:860px;}
.hm-label{display:flex;align-items:center;height:34px;font-size:.76rem;color:var(--text);font-weight:500;padding-right:.5rem;margin:1px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:275px;}
.hm-cell{display:flex;align-items:center;justify-content:center;height:34px;border-radius:3px;margin:1px;cursor:pointer;transition:transform .1s;position:relative;}
.hm-cell:hover{transform:scale(1.1);z-index:10;box-shadow:0 3px 10px rgba(0,0,0,.25);}
.hm-cell.sig{outline:2.5px solid #f59e0b;outline-offset:-2px;}
.hm-col-hdr{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:64px;font-size:.67rem;font-weight:700;writing-mode:vertical-lr;transform:rotate(180deg);padding:.4rem .2rem;}
.grp-lbl{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:.4rem 0 .2rem;border-bottom:1px solid var(--border);margin-bottom:1px;}
.tabs{display:flex;gap:.2rem;margin-bottom:1.2rem;border-bottom:1px solid var(--border);}
.tab-btn{padding:.45rem .95rem;border:none;background:none;cursor:pointer;font-size:.88rem;font-weight:500;color:var(--text2);border-bottom:2px solid transparent;margin-bottom:-1px;font-family:inherit;transition:all .15s;}
.tab-btn.act{color:var(--blue);border-bottom-color:var(--blue);}
.controls{display:flex;flex-wrap:wrap;gap:.7rem;margin-bottom:1.2rem;align-items:center;}
.controls select,.controls input[type=text]{padding:.38rem .7rem;border:1px solid var(--border);border-radius:7px;font-size:.83rem;background:var(--card);color:var(--text);font-family:inherit;}
.btn{padding:.38rem .85rem;border-radius:7px;font-size:.83rem;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all .15s;}
.btn-p{background:var(--blue);color:#fff;}.btn-p:hover{background:#1e40af;}
.btn-o{background:transparent;color:var(--blue);border:1px solid var(--blue);}.btn-o:hover{background:var(--blue-lt);}
#volcano-plot{width:100%;height:500px;}
.gene-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.2rem;}
.gene-card h3{font-size:1.05rem;font-weight:700;margin-bottom:.25rem;display:flex;align-items:center;gap:.4rem;}
.gtag{font-size:.68rem;padding:.12rem .38rem;border-radius:4px;font-weight:600;}
.gtag-ner{background:#dbeafe;color:#1d4ed8;}.gtag-stem{background:#fce7f3;color:#9d174d;}
.gtag-arsenic{background:#dcfce7;color:#14532d;}.gtag-inflam{background:#fff7ed;color:#92400e;}
.gl2fc-row{display:grid;grid-template-columns:90px 1fr 78px;align-items:center;gap:.45rem;margin:.28rem 0;font-size:.8rem;}
.gl2fc-wrap{background:#f1f5f9;border-radius:4px;height:13px;position:relative;overflow:visible;}
.gl2fc-bar{height:100%;position:absolute;top:0;border-radius:4px;}
.gl2fc-mid{position:absolute;left:50%;top:0;bottom:0;width:1px;background:#94a3b8;}
.gl2fc-val{font-family:'JetBrains Mono',monospace;font-size:.76rem;text-align:right;}
.pathway-table{width:100%;border-collapse:collapse;font-size:.8rem;}
.pathway-table th{background:#f8fafc;padding:.55rem .7rem;text-align:left;border-bottom:2px solid var(--border);font-weight:600;font-size:.76rem;color:var(--text2);text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0;z-index:5;}
.pathway-table td{padding:.45rem .7rem;border-bottom:1px solid #f1f5f9;vertical-align:middle;}
.pathway-table tr:hover td{background:#f8fafc;}
.nes-cell{width:46px;height:21px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;cursor:pointer;}
.nes-cell.sig-c{outline:2px solid #f59e0b;outline-offset:-2px;}
.db-badge{font-size:.67rem;padding:.1rem .33rem;border-radius:3px;font-weight:700;}
.db-H{background:#dbeafe;color:#1e40af;}.db-K{background:#fef3c7;color:#92400e;}
.db-R{background:#dcfce7;color:#14532d;}.db-C{background:#fce7f3;color:#9d174d;}
.modal-back{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:none;align-items:center;justify-content:center;}
.modal-back.open{display:flex;}
.modal{background:var(--card);border-radius:14px;padding:1.7rem;max-width:680px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,.2);}
.modal h3{font-size:1.05rem;font-weight:700;margin-bottom:.2rem;}
.modal .x{float:right;font-size:1.2rem;cursor:pointer;color:var(--text2);line-height:1;}
.m-bar-row{display:flex;gap:.5rem;align-items:center;margin:.22rem 0;font-size:.78rem;}
.m-bar-wrap{flex:1;height:15px;background:#f1f5f9;border-radius:4px;position:relative;overflow:hidden;}
.m-bar{position:absolute;top:0;height:100%;border-radius:4px;}
.hm-tip{position:fixed;background:rgba(15,23,42,.92);color:#fff;padding:.45rem .7rem;border-radius:8px;font-size:.76rem;pointer-events:none;z-index:300;max-width:270px;line-height:1.5;display:none;}
.legend{display:flex;gap:1.2rem;flex-wrap:wrap;align-items:center;margin-bottom:.9rem;font-size:.78rem;}
.leg-item{display:flex;align-items:center;gap:.35rem;}
.leg-sw{width:17px;height:11px;border-radius:3px;}
.nesbar{display:flex;align-items:center;gap:.5rem;font-size:.73rem;color:var(--text2);}
.nesbar .bar{width:110px;height:11px;border-radius:3px;background:linear-gradient(to right,#1d4ed8,#93c5fd,white,#fca5a5,#dc2626);}
@media(max-width:768px){.section{padding:1.5rem 1rem;}.stats-row{grid-template-columns:repeat(2,1fr);}}
</style>
</head>
<body>

<nav>
  <div class="logo"><span class="dot"></span> Arsenic &amp; Breast Cancer Explorer</div>
  <div class="links">
    <a href="#overview">Overview</a>
    <a href="#heatmap">NES Heatmap</a>
    <a href="#volcano">Volcano</a>
    <a href="#genes">Gene Browser</a>
    <a href="#ner">NER Diagram</a>
    <a href="#pathways">All Pathways</a>
  </div>
</nav>

<div class="hero">
  <div class="hero-inner">
    <h1>Arsenic Selectively Suppresses Nucleotide Excision Repair in African American Breast Cancer Stem Cells</h1>
    <p>Transcriptome-wide profiling of BRL-23 (NHW) and BRL-24 (AA) breast tissue-derived cell lines across parental and CD24&minus;/CD49f+/CD44+ cancer stem cell populations under vehicle and chronic low-dose arsenic trioxide (0.3 &mu;M, 14 days).</p>
    <div class="hero-badges">
      <span class="badge badge-w">16,682 genes profiled</span>
      <span class="badge badge-w">12 pairwise comparisons</span>
      <span class="badge badge-w">48 GSEA runs &bull; 4 MSigDB databases</span>
      <span class="badge badge-a">Primary finding: KEGG NER &nbsp;NES = &minus;2.75 &nbsp;FDR = 0.18 (C8)</span>
    </div>
    <div class="finding-box">
      <h3>Central Finding &mdash; Three-Condition Requirement</h3>
      <p>NER suppression in AA stem cells requires ALL THREE simultaneously:</p>
      <div class="three-way">
        <div class="req"><span class="n">1</span> African American cellular biology</div>
        <div class="req"><span class="n">2</span> Cancer stem cell identity (CD24&minus;/CD49f+/CD44+)</div>
        <div class="req"><span class="n">3</span> Arsenic trioxide exposure (0.3 &mu;M, 14 days)</div>
      </div>
    </div>
  </div>
</div>

<!-- OVERVIEW -->
<div id="overview" class="section">
  <div class="stats-row">
    <div class="stat-card hl"><span class="val">&minus;2.75</span><span class="lbl">NES: KEGG NER in AA Stem+Arsenic (C8)</span></div>
    <div class="stat-card"><span class="val">+0.86</span><span class="lbl">NES: KEGG NER in NHW Stem+Arsenic (C7)</span></div>
    <div class="stat-card"><span class="val">10&times;</span><span class="lbl">Amplification of racial differences in stem vs parental cells</span></div>
    <div class="stat-card"><span class="val">68%</span><span class="lbl">Collapse in racial DEGs under arsenic (parental cells)</span></div>
    <div class="stat-card"><span class="val">ERCC1</span><span class="lbl">Primary candidate &mdash; suppressed in all 4 AA stem comparisons</span></div>
    <div class="stat-card"><span class="val">16</span><span class="lbl">Leading edge genes in C8 NER suppression (KEGG)</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
    <div class="card">
      <h3 style="font-size:.95rem;font-weight:700;margin-bottom:.7rem;color:var(--blue)">Study Design &mdash; 12 Comparisons</h3>
      <table style="width:100%;font-size:.8rem;border-collapse:collapse;">
        <tr style="background:#f8fafc;"><th style="padding:.35rem .5rem;text-align:left;border-bottom:2px solid var(--border);">ID</th><th style="padding:.35rem .5rem;border-bottom:2px solid var(--border);">Comparison</th><th style="padding:.35rem .5rem;border-bottom:2px solid var(--border);">Type</th></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#7c3aed;">C1</td><td style="padding:.35rem .5rem;">AA vs NHW &mdash; Parental Vehicle</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#7c3aed;">Racial</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#7c3aed;">C2</td><td style="padding:.35rem .5rem;">AA vs NHW &mdash; Parental Arsenic</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#7c3aed;">Racial</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#0891b2;">C3</td><td style="padding:.35rem .5rem;">NHW: Arsenic vs Vehicle (Parental)</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#0891b2;">NHW Arsenic</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#dc2626;">C4</td><td style="padding:.35rem .5rem;">AA: Arsenic vs Vehicle (Parental)</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#dc2626;">AA Arsenic</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#1d4ed8;">C5</td><td style="padding:.35rem .5rem;">NHW: Stem vs Parental (Vehicle)</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#1d4ed8;">NHW Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#db2777;">C6</td><td style="padding:.35rem .5rem;">AA: Stem vs Parental (Vehicle)</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#db2777;">AA Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#0891b2;">C7</td><td style="padding:.35rem .5rem;">NHW: Stem vs Parental (Arsenic)</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#0891b2;">NHW Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;background:#fff7ed;"><td style="padding:.35rem .5rem;font-weight:700;color:#dc2626;">C8 &#9733;</td><td style="padding:.35rem .5rem;font-weight:600;">AA: Stem vs Parental (Arsenic) &mdash; PRIMARY</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#dc2626;">AA Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#1d4ed8;">C9</td><td style="padding:.35rem .5rem;">NHW Stem: Arsenic vs Vehicle</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#1d4ed8;">Within Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#db2777;">C10</td><td style="padding:.35rem .5rem;">AA Stem: Arsenic vs Vehicle</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#db2777;">Within Stem</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:.35rem .5rem;font-weight:700;color:#7c3aed;">C11</td><td style="padding:.35rem .5rem;">AA vs NHW &mdash; Stem Vehicle</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#7c3aed;">Racial</td></tr>
        <tr><td style="padding:.35rem .5rem;font-weight:700;color:#7c3aed;">C12</td><td style="padding:.35rem .5rem;">AA vs NHW &mdash; Stem Arsenic</td><td style="padding:.35rem .5rem;font-size:.72rem;color:#7c3aed;">Racial</td></tr>
      </table>
    </div>
    <div class="card">
      <h3 style="font-size:.95rem;font-weight:700;margin-bottom:.7rem;color:var(--red)">Key NER Leading Edge Genes</h3>
      <p style="font-size:.8rem;color:var(--text2);margin-bottom:.75rem;">Genes from KEGG_NER leading edges in AA stem cells under arsenic (C8 &amp; C12):</p>
      <div style="margin-bottom:.75rem;"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--text2);margin-bottom:.3rem;">Shared C8 &amp; C12 &mdash; Most reproducible markers</div>
      <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
        <span style="background:#fee2e2;color:#991b1b;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;font-weight:700;">ERCC1</span>
        <span style="background:#fee2e2;color:#991b1b;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">CCNH</span>
        <span style="background:#fee2e2;color:#991b1b;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">RFC2</span>
        <span style="background:#fee2e2;color:#991b1b;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">RPA3</span>
      </div></div>
      <div style="margin-bottom:.75rem;"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--text2);margin-bottom:.3rem;">C8-only &mdash; Damage Recognition &amp; TFIIH Loading</div>
      <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">XPC</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">DDB1</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">CETN2</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">RAD23A</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">ERCC3</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">GTF2H1</span>
        <span style="background:#dbeafe;color:#1e40af;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">CDK7</span>
      </div></div>
      <div><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--text2);margin-bottom:.3rem;">C12-only &mdash; Gap-Filling &amp; Ligation Machinery</div>
      <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">PCNA</span>
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">LIG1</span>
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">POLD1</span>
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">POLD3</span>
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">POLE</span>
        <span style="background:#dcfce7;color:#14532d;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">RFC3-5</span>
      </div></div>
      <div style="margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border);">
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--text2);margin-bottom:.3rem;">Also Suppressed &mdash; COP9 Signalosome (Chromatin remodeling)</div>
        <div style="display:flex;flex-wrap:wrap;gap:.25rem;">
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS3</span>
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS4</span>
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS5</span>
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS6</span>
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS7A</span>
          <span style="background:#f5f3ff;color:#5b21b6;padding:.12rem .4rem;border-radius:5px;font-size:.78rem;">COPS8</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- NES HEATMAP -->
<div style="background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:2.5rem 2rem;">
<div id="heatmap" class="section" style="padding:0;max-width:1200px;">
  <div class="section-header">
    <h2>NES Heatmap &mdash; Key Pathways</h2>
    <p>Normalized Enrichment Score across 12 comparisons. Orange border = significant (|NES| &gt; 1.5 &amp; FDR &lt; 0.25). Click any cell for details and leading edge genes.</p>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.7rem;margin-bottom:.9rem;">
    <div class="legend">
      <div class="leg-item"><div class="leg-sw" style="background:#1d4ed8;"></div>Higher in denominator</div>
      <div class="leg-item"><div class="leg-sw" style="background:#e5e7eb;"></div>No enrichment</div>
      <div class="leg-item"><div class="leg-sw" style="background:#dc2626;"></div>Higher in numerator</div>
      <div class="leg-item"><div style="width:17px;height:11px;border:2px solid #f59e0b;border-radius:3px;background:#fef3c7;"></div>Significant</div>
    </div>
    <div class="nesbar"><span>&minus;3</span><div class="bar"></div><span>+3</span></div>
  </div>
  <div class="hm-wrap" id="hm-wrap"></div>
</div>
</div>

<!-- VOLCANO -->
<div id="volcano" class="section">
  <div class="section-header"><h2>Volcano Plots &mdash; Differential Gene Expression</h2>
  <p>DESeq2 results (apeglm-shrunken log&sup2;FC). Color coding: NER genes = blue, Stemness/EMT = pink, Arsenic response = green, Inflammatory = orange. Click any point for gene details.</p></div>
  <div class="card">
    <div class="controls">
      <select id="v-comp"></select>
      <label style="font-size:.8rem;display:flex;align-items:center;gap:.3rem;"><input type="checkbox" id="v-ner" checked> NER</label>
      <label style="font-size:.8rem;display:flex;align-items:center;gap:.3rem;"><input type="checkbox" id="v-stem" checked> Stemness</label>
      <label style="font-size:.8rem;display:flex;align-items:center;gap:.3rem;"><input type="checkbox" id="v-ars" checked> Arsenic</label>
      <label style="font-size:.8rem;display:flex;align-items:center;gap:.3rem;"><input type="checkbox" id="v-inf" checked> Inflammatory</label>
      <input type="text" id="v-search" placeholder="Highlight gene..." style="width:150px;">
    </div>
    <div id="volcano-plot"></div>
    <div id="v-info" style="font-size:.8rem;color:var(--text2);text-align:center;margin-top:.4rem;"></div>
  </div>
</div>

<!-- GENE BROWSER -->
<div id="genes" style="background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:2.5rem 2rem;">
<div class="section" style="padding:0;max-width:1200px;">
  <div class="section-header"><h2>Gene Browser</h2><p>Search any gene to see its shrunken log&sup2;FC across all 12 comparisons. Solid bars = FDR &lt; 0.05. Click quick buttons for key genes.</p></div>
  <div class="controls">
    <input type="text" id="g-search" placeholder="Gene symbol (e.g. ERCC1, XPC, CDK7)..." style="width:270px;">
    <button class="btn btn-p" onclick="lookupGene()">Search</button>
    <span style="font-size:.78rem;color:var(--text2);">Quick:</span>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('ERCC1')">ERCC1</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('XPC')">XPC</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('CDK7')">CDK7</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('LIG1')">LIG1</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('PARP1')">PARP1</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('HMOX1')">HMOX1</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('ALDH1A3')">ALDH1A3</button>
    <button class="btn btn-o" style="padding:.22rem .55rem;font-size:.73rem;" onclick="setG('SNAI2')">SNAI2</button>
  </div>
  <div id="g-result"></div>
</div>
</div>

<!-- NER DIAGRAM -->
<div id="ner" class="section">
  <div class="section-header"><h2>NER Pathway Diagram</h2><p>Interactive schematic of Nucleotide Excision Repair. Gene color = shrunken log&sup2;FC in selected comparison. Dashed border = FDR &lt; 0.05. Click any gene to view in Gene Browser.</p></div>
  <div class="card">
    <div class="controls" style="margin-bottom:.8rem;">
      <label style="font-size:.85rem;font-weight:500;">Comparison:</label>
      <select id="ner-comp"></select>
      <div class="nesbar"><span style="font-size:.73rem;">Suppressed</span><div class="bar"></div><span style="font-size:.73rem;">Induced</span></div>
      <span style="font-size:.75rem;color:var(--text2);">Dashed border = FDR &lt; 0.05</span>
    </div>
    <div id="ner-wrap" style="overflow-x:auto;"></div>
  </div>
</div>

<!-- ALL PATHWAYS -->
<div id="pathways" style="background:#fff;border-top:1px solid var(--border);padding:2.5rem 2rem;">
<div class="section" style="padding:0;max-width:1200px;">
  <div class="section-header"><h2>All Pathways Browser</h2><p>All 3,758 pathways across 12 comparisons. Click any NES cell for details. Filter by database, significance, or comparison.</p></div>
  <div class="controls">
    <input type="text" id="pw-search" placeholder="Search pathway name..." style="width:260px;" oninput="filterPW()">
    <select id="pw-db" onchange="filterPW()"><option value="">All databases</option><option>Hallmark</option><option>KEGG</option><option>Reactome</option><option>CGP</option></select>
    <select id="pw-sig" onchange="filterPW()"><option value="sig">Significant only</option><option value="all">All pathways</option></select>
    <select id="pw-cmp" onchange="filterPW()"><option value="">Any comparison</option></select>
    <span id="pw-cnt" style="font-size:.8rem;color:var(--text2);"></span>
  </div>
  <div style="overflow-x:auto;max-height:580px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;">
    <table class="pathway-table" id="pw-table">
      <thead><tr><th>Pathway</th><th>DB</th><th style="color:#7c3aed;">C1</th><th style="color:#7c3aed;">C2</th><th style="color:#0891b2;">C3</th><th style="color:#dc2626;">C4</th><th style="color:#1d4ed8;">C5</th><th style="color:#db2777;">C6</th><th style="color:#0891b2;">C7</th><th style="color:#dc2626;">C8</th><th style="color:#1d4ed8;">C9</th><th style="color:#db2777;">C10</th><th style="color:#7c3aed;">C11</th><th style="color:#7c3aed;">C12</th></tr></thead>
      <tbody id="pw-tbody"></tbody>
    </table>
  </div>
  <div style="display:flex;gap:.5rem;align-items:center;margin-top:.7rem;">
    <button class="btn btn-o" id="pw-prev" onclick="changePg(-1)">&#8592; Prev</button>
    <span id="pw-pg-info" style="font-size:.8rem;color:var(--text2);"></span>
    <button class="btn btn-o" id="pw-next" onclick="changePg(1)">Next &#8594;</button>
  </div>
</div>
</div>

<!-- MODAL -->
<div class="modal-back" id="modal-back" onclick="closeModal(event)">
  <div class="modal">
    <span class="x" onclick="closeModal2()">&#10005;</span>
    <span id="m-db" class="db-badge" style="float:left;margin-right:.4rem;margin-top:.15rem;"></span>
    <h3 id="m-title"></h3>
    <div style="clear:both;"></div>
    <p id="m-sub" style="font-size:.78rem;color:var(--text2);margin-top:.2rem;margin-bottom:.7rem;"></p>
    <div id="m-bars"></div>
    <div id="m-le"></div>
  </div>
</div>

<div class="hm-tip" id="hm-tip"></div>

<script>
const CID=['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12'];
const CLBL={C1:'AA vs NHW \u2014 Parental Vehicle',C2:'AA vs NHW \u2014 Parental Arsenic',C3:'NHW: Arsenic vs Vehicle (Parental)',C4:'AA: Arsenic vs Vehicle (Parental)',C5:'NHW: Stem vs Parental (Vehicle)',C6:'AA: Stem vs Parental (Vehicle)',C7:'NHW: Stem vs Parental (Arsenic)',C8:'AA: Stem vs Parental (Arsenic) \u2605',C9:'NHW Stem: Arsenic vs Vehicle',C10:'AA Stem: Arsenic vs Vehicle',C11:'AA vs NHW \u2014 Stem Vehicle',C12:'AA vs NHW \u2014 Stem Arsenic'};
const CCOL={C1:'#7c3aed',C2:'#7c3aed',C11:'#7c3aed',C12:'#7c3aed',C3:'#0891b2',C7:'#0891b2',C4:'#dc2626',C8:'#dc2626',C5:'#1d4ed8',C9:'#1d4ed8',C6:'#db2777',C10:'#db2777'};
const NER=new Set(['ERCC1','ERCC2','ERCC3','ERCC4','ERCC5','ERCC6','ERCC8','XPC','DDB1','DDB2','CETN2','RAD23A','RAD23B','GTF2H1','GTF2H2','GTF2H3','GTF2H4','GTF2H5','CDK7','CCNH','MNAT1','XPA','PCNA','LIG1','RFC1','RFC2','RFC3','RFC4','RFC5','RPA1','RPA2','RPA3','RPA4','POLD1','POLD2','POLD3','POLD4','POLE','POLE2','POLE3','POLE4','CUL4A','CUL4B','COPS3','COPS4','COPS5','COPS6','COPS7A','COPS8','PARP1','PARP2']);
const STEM=new Set(['SNAI2','VIM','KLF4','BMI1','SMO','ALDH1A3','CD44','TGFBR1','CD24','ITGA6','MYC','SOX2','NOTCH1','NOTCH2','HES1','GLI1','GLI2','ALDH1A1']);
const ARS=new Set(['HMOX1','SLC7A11','ATF3','IL6','CXCL8','NFE2L2','HSPB1','NQO1','AKR1C1','CXCL1','HSPA1A','HSPB8']);
const INF=new Set(['ICAM1','IL1A','IL1R1','IL7R','IFITM1','LYN','TLR3','NAMPT','ADORA2B','BDKRB1','CD82','CXCL6','CCL2','CCL20','NFKBIA','IRAK2','HIF1A','AHR','TNF','NFKB1','STAT3','IL8']);
const KPW=[
  {n:'KEGG_NUCLEOTIDE_EXCISION_REPAIR',g:'NER'},{n:'REACTOME_NUCLEOTIDE_EXCISION_REPAIR',g:'NER'},
  {n:'REACTOME_BASE_EXCISION_REPAIR',g:'BER'},{n:'KEGG_BASE_EXCISION_REPAIR',g:'BER'},
  {n:'REACTOME_MISMATCH_REPAIR',g:'MMR'},{n:'KEGG_MISMATCH_REPAIR',g:'MMR'},
  {n:'KEGG_HOMOLOGOUS_RECOMBINATION',g:'HR/DSB'},{n:'REACTOME_HDR_THROUGH_HOMOLOGOUS_RECOMBINATION_HRR',g:'HR/DSB'},
  {n:'HALLMARK_G2M_CHECKPOINT',g:'Stemness'},{n:'HALLMARK_E2F_TARGETS',g:'Stemness'},{n:'BENPORATH_ES_2',g:'Stemness'},{n:'PECE_MAMMARY_STEM_CELL_UP',g:'Stemness'},{n:'HALLMARK_MYC_TARGETS_V1',g:'Stemness'},
  {n:'HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION',g:'EMT'},
  {n:'HALLMARK_HEDGEHOG_SIGNALING',g:'Signaling'},{n:'HALLMARK_NOTCH_SIGNALING',g:'Signaling'},{n:'HALLMARK_WNT_BETA_CATENIN_SIGNALING',g:'Signaling'},
  {n:'HALLMARK_INFLAMMATORY_RESPONSE',g:'Inflammation'},{n:'HALLMARK_TNFA_SIGNALING_VIA_NFKB',g:'Inflammation'},{n:'HALLMARK_INTERFERON_GAMMA_RESPONSE',g:'Inflammation'},
  {n:'HALLMARK_OXIDATIVE_PHOSPHORYLATION',g:'Metabolism'},{n:'HALLMARK_XENOBIOTIC_METABOLISM',g:'Metabolism'},
  {n:'HALLMARK_HYPOXIA',g:'Stress'},{n:'HALLMARK_APOPTOSIS',g:'Stress'},{n:'HALLMARK_DNA_REPAIR',g:'Stress'},{n:'KAN_RESPONSE_TO_ARSENIC_TRIOXIDE',g:'Stress'}
];
const GCOL={'NER':'#dc2626','BER':'#ea580c','MMR':'#d97706','HR/DSB':'#65a30d','Stemness':'#0891b2','EMT':'#0e7490','Signaling':'#7c3aed','Inflammation':'#db2777','Metabolism':'#16a34a','Stress':'#475569'};

let pwLook={},gseaPWs=[],deseqLook={},allPWs=[],filtPWs=[],curPg=0;
const PG=50;

function dbS(db){return db==='Hallmark'?'H':db==='KEGG'?'K':db==='Reactome'?'R':'C';}
function nesCol(v,a=1){if(v==null)return `rgba(229,231,235,${a})`;v=Math.max(-3,Math.min(3,v));if(v>=0){const t=v/3;return `rgba(${~~(255*(1-t)+220*t)},${~~(255*(1-t)+38*t)},${~~(255*(1-t)+38*t)},${a})`;}else{const t=-v/3;return `rgba(${~~(255*(1-t)+29*t)},${~~(255*(1-t)+78*t)},${~~(255*(1-t)+216*t)},${a})`;}}
function l2fCol(v){if(v==null)return '#e5e7eb';v=Math.max(-1.5,Math.min(1.5,v));if(v>=0){const t=v/1.5;return `rgb(${~~(255*(1-t)+220*t)},${~~(255*(1-t)+38*t)},${~~(255*(1-t)+38*t)})`;}else{const t=-v/1.5;return `rgb(${~~(255*(1-t)+29*t)},${~~(255*(1-t)+78*t)},${~~(255*(1-t)+216*t)})`;}}
function gCat(g){if(NER.has(g))return'ner';if(STEM.has(g))return'stem';if(ARS.has(g))return'arsenic';if(INF.has(g))return'inflam';return'other';}
const CATLBL={ner:'NER/DNA Repair',stem:'Stemness/EMT',arsenic:'Arsenic Response',inflam:'Inflammatory',other:'Other'};

document.addEventListener('DOMContentLoaded',function(){
  if(typeof GSEA_DATA==='undefined'||typeof DESEQ_DATA==='undefined'){
    document.body.innerHTML='<div style="padding:3rem;text-align:center;font-family:sans-serif;color:#dc2626;"><h2>Data files not found</h2><p>Ensure deseq_data.js and gsea_data.js are in the same folder as index.html.</p></div>';return;
  }
  gseaPWs=GSEA_DATA.pathways;
  gseaPWs.forEach(p=>{pwLook[p.name]=p;});
  const dd=DESEQ_DATA.data;
  CID.forEach(c=>{deseqLook[c]={};(dd[c]||[]).forEach(g=>{deseqLook[c][g.g]=g;});});
  buildHM();buildNER('C8');buildPWTable();initSelects();
  setG('ERCC1');
});

function initSelects(){
  const vs=document.getElementById('v-comp');
  const ns=document.getElementById('ner-comp');
  const pcs=document.getElementById('pw-cmp');
  CID.forEach(c=>{
    const o1=document.createElement('option');o1.value=c;o1.textContent=c+': '+CLBL[c];vs.appendChild(o1);
    const o2=o1.cloneNode(true);ns.appendChild(o2);
    const o3=document.createElement('option');o3.value=c;o3.textContent='Significant in '+c;pcs.appendChild(o3);
  });
  vs.value='C8';vs.onchange=()=>renderVolcano();
  ns.value='C8';ns.onchange=()=>buildNER(ns.value);
  document.getElementById('v-search').addEventListener('keyup',e=>{if(e.key==='Enter')renderVolcano();});
  document.getElementById('g-search').addEventListener('keyup',e=>{if(e.key==='Enter')lookupGene();});
  renderVolcano();
}

// ---- HEATMAP ----
function buildHM(){
  const wrap=document.getElementById('hm-wrap');
  let html=`<div class="hm-grid" style="grid-template-columns:268px repeat(12,54px);">`;
  html+=`<div style="display:flex;align-items:flex-end;height:68px;font-size:.7rem;font-weight:700;color:var(--text2);padding-right:.4rem;">Pathway</div>`;
  CID.forEach(c=>{html+=`<div class="hm-col-hdr" style="color:${CCOL[c]};font-size:.64rem;">${c}</div>`;});
  let lg=null;
  KPW.forEach(kp=>{
    const p=pwLook[kp.n];if(!p)return;
    const sn=kp.n.replace(/^(KEGG_|REACTOME_|HALLMARK_|BENPORATH_|PECE_|KAN_)/,'').replace(/_/g,' ').toLowerCase().replace(/\b\w/,c=>c.toUpperCase()).substring(0,42);
    if(kp.g!==lg){html+=`<div class="grp-lbl" style="color:${GCOL[kp.g]||'#64748b'};grid-column:1/-1;">${kp.g}</div>`;lg=kp.g;}
    html+=`<div class="hm-label" title="${kp.n}">${sn}</div>`;
    p.nes.forEach((nes,i)=>{
      const fdr=p.fdr[i];
      const sig=Math.abs(nes||0)>1.5&&fdr!=null&&fdr<0.25;
      const ns=nes!=null?nes.toFixed(2):'';
      const fs=fdr!=null?(fdr<0.001?'<0.001':fdr.toFixed(3)):'NA';
      html+=`<div class="hm-cell ${sig?'sig':''}" style="background:${nesCol(nes)};"
        data-n="${kp.n}" data-i="${i}" data-ns="${ns}" data-fs="${fs}" data-c="C${i+1}"
        onmouseenter="showTip(event,this)" onmouseleave="hideTip()"
        onclick="openModal('${kp.n}',${i})">
        <span style="color:${Math.abs(nes||0)>1?'white':'#374151'};font-size:.66rem;">${ns}</span>
      </div>`;
    });
  });
  html+=`</div>`;wrap.innerHTML=html;
}

// ---- TOOLTIP ----
function showTip(e,el){
  const t=document.getElementById('hm-tip');
  t.innerHTML=`<strong>${el.dataset.n.replace(/_/g,' ')}</strong><br>${CLBL[el.dataset.c]||el.dataset.c}<br>NES: <strong>${el.dataset.ns}</strong> &nbsp; FDR: <strong>${el.dataset.fs}</strong>`;
  t.style.display='block';t.style.left=(e.clientX+12)+'px';t.style.top=(e.clientY-10)+'px';
}
function hideTip(){document.getElementById('hm-tip').style.display='none';}

// ---- MODAL ----
function openModal(pname,ci){
  const p=pwLook[pname];if(!p)return;
  document.getElementById('modal-back').classList.add('open');
  document.getElementById('m-title').textContent=pname.replace(/_/g,' ');
  const dbEl=document.getElementById('m-db');dbEl.textContent=p.db;dbEl.className='db-badge db-'+dbS(p.db);
  document.getElementById('m-sub').textContent='Click a row bar to see leading edge genes for that comparison.';
  let bh='';
  CID.forEach((c,i)=>{
    const nes=p.nes[i],fdr=p.fdr[i];
    const sig=Math.abs(nes||0)>1.5&&fdr!=null&&fdr<0.25;
    const ns=nes!=null?nes.toFixed(2):'NA';
    const fs=fdr!=null?(fdr<0.001?'<0.001':fdr.toFixed(3)):'NA';
    const bw=Math.min(50,Math.abs(nes||0)/3*50);
    const bp=(nes||0)>=0?`left:50%;width:${bw}%;background:#dc2626;`:`right:50%;width:${bw}%;background:#1d4ed8;`;
    bh+=`<div class="m-bar-row" style="cursor:pointer;" onclick="showLE('${pname}',${i})">
      <span style="width:72px;font-size:.7rem;font-weight:600;color:${CCOL[c]};flex-shrink:0;">${c}</span>
      <div class="m-bar-wrap"><div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#cbd5e1;"></div><div class="m-bar" style="${bp}"></div></div>
      <span style="width:48px;font-size:.7rem;text-align:right;font-family:'JetBrains Mono',monospace;${sig?'font-weight:700;color:var(--amber)':''}">${ns}</span>
      <span style="width:56px;font-size:.68rem;color:var(--text2);text-align:right;">${fs}</span>
      ${sig?'<span style="color:#f59e0b;font-size:.68rem;margin-left:.2rem;">&#9733;</span>':''}
    </div>`;
  });
  document.getElementById('m-bars').innerHTML=bh;
  document.getElementById('m-le').innerHTML='';
  if(ci!=null)showLE(pname,ci);
}
function showLE(pname,i){
  const p=pwLook[pname];if(!p)return;
  const le=p.le&&p.le[i]?p.le[i]:'';
  const c=CID[i];
  document.getElementById('m-le').innerHTML=le?`<div style="margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--border);"><strong style="font-size:.78rem;">${c} Leading Edge:</strong><p style="font-size:.78rem;color:var(--text2);margin-top:.2rem;">${le}</p></div>`:`<div style="margin-top:.7rem;font-size:.78rem;color:var(--text2);">No leading edge data for ${c}.</div>`;
}
function closeModal(e){if(e.target.id==='modal-back')closeModal2();}
function closeModal2(){document.getElementById('modal-back').classList.remove('open');}

// ---- VOLCANO ----
let curVC='C8';
function renderVolcano(){
  curVC=document.getElementById('v-comp').value;
  const gs=deseqLook[curVC]||{};
  const sNer=document.getElementById('v-ner').checked;
  const sStem=document.getElementById('v-stem').checked;
  const sArs=document.getElementById('v-ars').checked;
  const sInf=document.getElementById('v-inf').checked;
  const srch=(document.getElementById('v-search').value||'').trim().toUpperCase();
  const cats=[
    {k:'ner',show:sNer,col:'#1d4ed8',name:'NER/DNA Repair'},
    {k:'stem',show:sStem,col:'#db2777',name:'Stemness/EMT'},
    {k:'arsenic',show:sArs,col:'#16a34a',name:'Arsenic Response'},
    {k:'inflam',show:sInf,col:'#d97706',name:'Inflammatory'},
    {k:'other',show:true,col:'#94a3b8',name:'Other'},
  ];
  const byC={ner:[],stem:[],arsenic:[],inflam:[],other:[]};
  Object.entries(gs).forEach(([gn,gd])=>{
    if(gd.l==null||gd.p==null)return;
    const nlp=gd.p>0?-Math.log10(gd.p):6.5;
    byC[gCat(gn)].push({gn,l:gd.l,p:gd.p,f:gd.f,nlp});
  });
  const traces=[];
  cats.forEach(cd=>{
    if(!cd.show&&cd.k!=='other')return;
    const pts=byC[cd.k];if(!pts.length)return;
    const x=[],y=[],txt=[],col=[],sz=[];
    pts.forEach(pt=>{
      x.push(pt.l);y.push(pt.nlp);
      const fs=pt.f!=null?(pt.f<0.001?'<0.001':pt.f.toFixed(3)):'n/a';
      txt.push(`${pt.gn}<br>L2FC: ${pt.l!=null?pt.l.toFixed(3):''}<br>FDR: ${fs}`);
      const isSig=pt.f!=null&&pt.f<0.05;
      const isSrch=srch&&pt.gn===srch;
      col.push(isSrch?'#f59e0b':(isSig&&cd.k!=='other'?cd.col:(cd.k==='other'?'#d1d5db':'#93c5fd')));
      sz.push(isSrch?14:(isSig&&cd.k!=='other'?6:4));
    });
    traces.push({x,y,text:txt,mode:'markers',marker:{color:col,size:sz,opacity:0.82},name:cd.name,type:'scatter',hovertemplate:'%{text}<extra></extra>'});
  });
  const fL=-Math.log10(0.05);
  Plotly.newPlot('volcano-plot',traces,{
    xaxis:{title:'Shrunken log\u2082 fold change',zeroline:true,zerolinecolor:'#94a3b8'},
    yaxis:{title:'\u2212log\u2081\u2080(p-value)'},
    shapes:[
      {type:'line',x0:-8,x1:8,y0:fL,y1:fL,line:{color:'#ef4444',dash:'dot',width:1.5}},
      {type:'line',x0:-0.58,x1:-0.58,y0:0,y1:10,line:{color:'#94a3b8',dash:'dot',width:1}},
      {type:'line',x0:0.58,x1:0.58,y0:0,y1:10,line:{color:'#94a3b8',dash:'dot',width:1}},
    ],
    annotations:[{x:-8,y:fL,text:'FDR 0.05',showarrow:false,font:{size:10,color:'#ef4444'},xanchor:'left',yanchor:'bottom'}],
    legend:{orientation:'h',y:-0.18},margin:{l:55,r:20,t:40,b:90},height:490,
    title:{text:curVC+': '+CLBL[curVC].replace(' \u2605',''),font:{size:12}},
    plot_bgcolor:'#fafafa',paper_bgcolor:'#fff'
  },{responsive:true,displayModeBar:true,modeBarButtonsToRemove:['lasso2d','select2d']});
  const nS=Object.values(gs).filter(g=>g.f!=null&&g.f<0.05).length;
  document.getElementById('v-info').textContent=nS+' significant genes (FDR < 0.05). Positive L2FC = higher in numerator.';
}
['v-ner','v-stem','v-ars','v-inf'].forEach(id=>document.getElementById(id)&&(document.getElementById(id).onchange=renderVolcano));

// ---- GENE BROWSER ----
function setG(n){document.getElementById('g-search').value=n;lookupGene(n);}
function lookupGene(force){
  const n=(force||document.getElementById('g-search').value||'').trim().toUpperCase();
  if(!n)return;
  document.getElementById('g-search').value=n;
  const cat=gCat(n);
  let maxA=0;
  const vals=CID.map(c=>{const gd=deseqLook[c]&&deseqLook[c][n];const l=gd?gd.l:null;const f=gd?gd.f:null;if(l!=null)maxA=Math.max(maxA,Math.abs(l));return{c,l,f};});
  maxA=Math.max(maxA,0.5);
  const found=vals.some(v=>v.l!=null);
  if(!found){document.getElementById('g-result').innerHTML=`<div class="card"><p style="color:var(--text2);">Gene "<strong>${n}</strong>" not found. Try another symbol.</p></div>`;return;}
  let rows1='',rows2='';
  vals.forEach(({c,l,f},idx)=>{
    const pct=l!=null?Math.abs(l)/maxA*50:0;
    const isPos=l!=null&&l>=0;
    const sig=f!=null&&f<0.05;
    const fs=f==null?'n/a':(f<0.001?'<0.001':f.toFixed(3));
    const ls=l!=null?(l>=0?'+':'')+l.toFixed(3):'n/a';
    const row=`<div class="gl2fc-row">
      <span style="color:${CCOL[c]};font-weight:600;font-size:.77rem;">${c}</span>
      <div class="gl2fc-wrap">
        <div class="gl2fc-mid"></div>
        ${l!=null?`<div class="gl2fc-bar" style="background:${isPos?'#ef4444':'#3b82f6'};${isPos?`left:50%;right:calc(50% - ${pct}%)`:`right:50%;left:calc(50% - ${pct}%)`};opacity:${sig?1:.45};"></div>`:''}
      </div>
      <span class="gl2fc-val" style="color:${isPos?'#dc2626':'#1d4ed8'};font-weight:${sig?700:400};">${ls}</span>
    </div>`;
    if(idx<6)rows1+=row;else rows2+=row;
  });
  document.getElementById('g-result').innerHTML=`<div class="gene-card">
    <h3>${n} <span class="gtag gtag-${cat}">${CATLBL[cat]}</span></h3>
    <p style="font-size:.78rem;color:var(--text2);margin-bottom:.9rem;">Shrunken log\u2082FC across all 12 comparisons. Bold value = FDR &lt; 0.05. Positive = higher in numerator.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem 1.5rem;">${rows1}${rows2}</div>
  </div>`;
}

// ---- NER DIAGRAM ----
function buildNER(cid){
  const gs=deseqLook[cid]||{};
  function gd(name){const d=gs[name];return{l:d?d.l:null,f:d?d.f:null};}
  function gb(x,y,w,h,name,label){
    const d=gd(name);const bg=l2fCol(d.l);
    const tc=d.l!=null&&Math.abs(d.l)>0.75?'white':'#1e293b';
    const st=d.f!=null&&d.f<0.05?'#f59e0b':'#94a3b8';
    const sw=d.f!=null&&d.f<0.05?'2.5':'1';
    const da=d.f!=null&&d.f<0.05?'stroke-dasharray="5 2"':'';
    const lv=d.l!=null?(d.l>=0?'+':'')+d.l.toFixed(2):'';
    return `<g transform="translate(${x},${y})" style="cursor:pointer;" onclick="setG('${name}')">
      <title>${name}: L2FC=${lv||'n/a'}, FDR=${d.f!=null?(d.f<0.001?'<0.001':d.f.toFixed(3)):'n/a'} \u2014 Click for Gene Browser</title>
      <rect width="${w}" height="${h}" rx="5" fill="${bg}" stroke="${st}" stroke-width="${sw}" ${da}/>
      <text x="${w/2}" y="${h/2-(lv?5:0)}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="700" fill="${tc}">${name}</text>
      ${lv?`<text x="${w/2}" y="${h/2+8}" text-anchor="middle" dominant-baseline="middle" font-size="8.5" fill="${tc}" opacity=".9">${lv}</text>`:''}
    </g>`;
  }
  function cb(x,y,w,h,lbl,genes,cols=3){
    const bw=Math.floor((w-8)/cols)-2,bh=32;
    let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="${x+w/2}" y="${y+14}" text-anchor="middle" font-size="9" font-weight="700" fill="#475569">${lbl}</text>`;
    genes.forEach((g,i)=>{
      const col=i%cols,row=Math.floor(i/cols);
      s+=gb(x+4+col*(bw+2),y+20+row*(bh+3),bw,bh,g,g);
    });
    return s;
  }
  function arrow(x1,y1,x2,y2){return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#64748b" stroke-width="2" marker-end="url(#arr)" fill="none"/>"`;}

  const W=990,H=530;
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;font-family:Inter,sans-serif;" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker></defs>
  <rect x="8" y="8" width="298" height="195" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="157" y="27" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">GG-NER (Global Genome)</text>
  <rect x="8" y="212" width="298" height="130" rx="10" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="1.5"/>
  <text x="157" y="230" text-anchor="middle" font-size="11" font-weight="700" fill="#9d174d">TC-NER (Transcription Coupled)</text>
  <rect x="316" y="8" width="666" height="505" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
  <text x="649" y="27" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">Common NER Pathway</text>`;

  // GG-NER genes
  s+=cb(18,38,135,85,'UV-DDB Complex',['DDB1','DDB2'],2);
  s+=cb(163,38,135,85,'XPC Complex',['XPC','RAD23A','CETN2'],3);
  s+=cb(18,133,135,60,'COP9 Signalosome',['COPS3','COPS4','COPS5','COPS6'],4);
  s+=cb(163,133,135,60,'CRL4 Ubiquitin',['CUL4A','CUL4B'],2);

  // TC-NER genes
  s+=gb(22,242,80,42,'ERCC8','CSA');
  s+=gb(115,242,80,42,'ERCC6','CSB');
  s+=`<text x="157" y="296" text-anchor="middle" font-size="9" fill="#9d174d">RNA Pol II stalling \u2192 damage recognition</text>`;

  // Arrows from both NER arms
  s+=`<path d="M 307 88 L 326 88" stroke="#64748b" stroke-width="2" marker-end="url(#arr)" fill="none"/>`;
  s+=`<path d="M 307 263 Q 320 263 320 188 L 326 188" stroke="#64748b" stroke-width="2" marker-end="url(#arr)" fill="none"/>`;

  // TFIIH + XPA + RPA
  s+=cb(326,40,280,118,'TFIIH Complex (DNA Unwinding)',['CDK7','CCNH','MNAT1','GTF2H1','GTF2H4','GTF2H5'],3);
  s+=gb(616,55,68,44,'XPA','XPA');
  s+=cb(694,40,122,118,'RPA (ssDNA stabilization)',['RPA1','RPA2','RPA3'],1);

  // Arrow down to incision
  s+=`<path d="M 649 162 L 649 210" stroke="#64748b" stroke-width="2" marker-end="url(#arr)" fill="none"/>`;
  s+=`<text x="660" y="192" font-size="9" fill="#64748b">Damage verified</text>`;

  // Dual incision box
  s+=`<rect x="326" y="216" width="656" height="66" rx="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
  <text x="654" y="234" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">Dual Incision (\u223530 nt excised)</text>`;
  s+=gb(336,242,160,34,'ERCC1','ERCC1-XPF (5\u2019 cut)');
  s+=gb(510,242,140,34,'ERCC5','XPG (3\u2019 cut)');
  s+=`<text x="830" y="258" text-anchor="middle" font-size="9" fill="#92400e">Gap created</text>`;

  // Arrow to gap-filling
  s+=`<path d="M 649 284 L 649 316" stroke="#64748b" stroke-width="2" marker-end="url(#arr)" fill="none"/>`;

  // Gap-filling
  s+=cb(326,320,200,120,'PCNA-RFC Clamp Loader',['PCNA','RFC1','RFC2','RFC3','RFC4','RFC5'],3);
  s+=cb(536,320,200,120,'Gap-Fill Polymerases',['POLD1','POLD2','POLD3','POLE','POLE2','POLE3'],3);
  s+=gb(746,320,110,50,'LIG1','LIG1 (Ligation)');
  s+=gb(746,380,110,44,'PARP1','PARP1');
  s+=`<path d="M 736 355 L 756 350" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)" fill="none"/>`;

  // Legend
  s+=`<rect x="326" y="452" width="656" height="54" rx="6" fill="white" stroke="#e2e8f0"/>
  <text x="340" y="468" font-size="9" font-weight="600" fill="#64748b">Gene color = log\u2082FC (selected comparison). Dashed border = FDR &lt; 0.05. Click any gene to view in Gene Browser.</text>
  <text x="340" y="481" font-size="8.5" fill="#94a3b8">Scale: blue = suppressed \u2192 white = no change \u2192 red = induced (\u00b11.5 range)</text>`;
  const gp=[[-1.5,'#1d4ed8'],[-0.75,'#93c5fd'],[0,'#e5e7eb'],[0.75,'#fca5a5'],[1.5,'#dc2626']];
  gp.forEach(([v,c],i)=>{
    s+=`<rect x="${340+i*90}" y="490" width="90" height="10" fill="${c}"/>`;
    s+=`<text x="${340+i*90}" y="507" font-size="8" fill="#64748b">${v>=0?'+':''}${v}</text>`;
  });
  s+=`</svg>`;
  document.getElementById('ner-wrap').innerHTML=s;
}

// ---- PATHWAY TABLE ----
function buildPWTable(){allPWs=gseaPWs;filterPW();}
function filterPW(){
  const srch=(document.getElementById('pw-search').value||'').trim().toUpperCase();
  const db=document.getElementById('pw-db').value;
  const sigM=document.getElementById('pw-sig').value;
  const cmpF=document.getElementById('pw-cmp').value;
  const ci=cmpF?CID.indexOf(cmpF):-1;
  filtPWs=allPWs.filter(p=>{
    if(srch&&!p.name.toUpperCase().includes(srch))return false;
    if(db&&p.db!==db)return false;
    if(sigM==='sig'&&!p.sig.some(Boolean))return false;
    if(ci>=0&&!p.sig[ci])return false;
    return true;
  });
  curPg=0;renderPWPage();
  document.getElementById('pw-cnt').textContent=filtPWs.length+' pathways';
}
function renderPWPage(){
  const sl=filtPWs.slice(curPg*PG,curPg*PG+PG);
  let h='';
  sl.forEach(p=>{
    const sn=p.name.length>52?p.name.substring(0,50)+'\u2026':p.name;
    h+=`<tr><td title="${p.name}" style="max-width:310px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sn}</td><td><span class="db-badge db-${dbS(p.db)}">${p.db}</span></td>`;
    p.nes.forEach((nes,i)=>{
      const fdr=p.fdr[i],sig=Math.abs(nes||0)>1.5&&fdr!=null&&fdr<0.25;
      const ns=nes!=null?nes.toFixed(2):'';
      h+=`<td><div class="nes-cell ${sig?'sig-c':''}" style="background:${nesCol(nes,.88)};color:${Math.abs(nes||0)>1.2?'white':'#374151'};"
        onclick="openModal('${p.name}',${i})" title="${p.name} | ${CID[i]}: NES=${ns}, FDR=${fdr!=null?fdr.toFixed(3):'n/a'}">${ns}</div></td>`;
    });
    h+=`</tr>`;
  });
  document.getElementById('pw-tbody').innerHTML=h;
  const tot=Math.ceil(filtPWs.length/PG);
  document.getElementById('pw-pg-info').textContent=`Page ${curPg+1} of ${tot||1} (${curPg*PG+1}\u2013${Math.min((curPg+1)*PG,filtPWs.length)} of ${filtPWs.length})`;
}
function changePg(d){
  const max=Math.ceil(filtPWs.length/PG)-1;
  curPg=Math.max(0,Math.min(max,curPg+d));renderPWPage();
}

// Nav active
window.addEventListener('scroll',function(){
  const ids=['overview','heatmap','volcano','genes','ner','pathways'];
  let cur='';
  ids.forEach(id=>{const el=document.getElementById(id);if(el&&window.scrollY>=el.getBoundingClientRect().top+window.scrollY-120)cur=id;});
  document.querySelectorAll('nav .links a').forEach(a=>{
    const h=a.getAttribute('href').replace('#','');
    a.classList.toggle('nav-active',h===cur);
  });
});
</script>
</body>
</html>"""

with open('C:/Users/aubre/OneDrive/Desktop/Project1/index.html','w',encoding='utf-8') as f:
    f.write(HTML)

import os
sz = os.path.getsize('C:/Users/aubre/OneDrive/Desktop/Project1/index.html')
print(f'Done. index.html: {sz/1024:.0f} KB')
