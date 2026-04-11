// Gene information database for interactive pop-ups
// Each entry: fullName, category, summary, cancerLink, stemLink, arsenicLink
window.GENE_INFO = {

/* ═══════════════ NER — GLOBAL GENOME (GG-NER) ═══════════════ */

ERCC1: {
  fullName: "Excision Repair Cross-Complementation Group 1",
  category: "ner",
  summary: "Forms an obligate heterodimer with XPF (ERCC4) to perform the critical 5′ incision during NER. Rate-limiting for the entire repair pathway — no ERCC1, no excision.",
  cancerLink: "High ERCC1 expression confers resistance to platinum chemotherapy (cisplatin, carboplatin, oxaliplatin) in lung, ovarian, gastric, and breast cancers. Conversely, low ERCC1 predicts elevated sensitivity to arsenic-induced DNA damage. ERCC1 is suppressed in all four AA breast cancer stem cell comparisons in this study — the paper's primary candidate gene.",
  stemLink: "Consistently downregulated in AA cancer stem cells across C5, C6, C8, and C10 comparisons. Shared leading edge gene in both C8 (AA Stem vs. Parental Arsenic) and C12 (AA vs. NHW Stem Arsenic), making it the most reproducible NER suppression marker in this dataset.",
  arsenicLink: "Arsenic trioxide impairs ERCC1-XPF recruitment to damage sites by displacing zinc from XPA zinc-finger domains and suppressing p53-mediated NER gene transcription. This study shows that NER suppression is race- and stem-cell-specific — not a pan-cellular arsenic effect."
},

ERCC2: {
  fullName: "Excision Repair Cross-Complementation Group 2 (XPD)",
  category: "ner",
  summary: "3′→5′ DNA helicase subunit of TFIIH. Unwinds the DNA duplex around the lesion site. Mutations cause three distinct syndromes: xeroderma pigmentosum (XP), Cockayne syndrome, and trichothiodystrophy.",
  cancerLink: "Germline variants associated with risk of bladder, lung, head & neck, and breast cancers. High ERCC2 activity predicted as protective against environmental carcinogen exposure. Elevated in AA cells at baseline in this study.",
  stemLink: "Part of TFIIH which is essential for both NER and transcription by RNA Pol II — loss disproportionately impacts highly transcribing stem cells.",
  arsenicLink: "Arsenic-mediated inhibition of TFIIH function (via XPD and XPB) is a key mechanism by which arsenic blocks NER unwinding, trapping damage in DNA."
},

ERCC3: {
  fullName: "Excision Repair Cross-Complementation Group 3 (XPB)",
  category: "ner",
  summary: "5′→3′ DNA helicase subunit of TFIIH. Essential for DNA unwinding during both NER and transcription initiation. Its ATPase activity, not helicase activity, opens the transcription bubble.",
  cancerLink: "Mutations cause xeroderma pigmentosum/Cockayne syndrome overlap. XPB is the target of the anticancer compound spironolactone (which degrades XPB). Found in C8 leading edge in this study.",
  stemLink: "TFIIH requirement for RNA Pol II transcription makes ERCC3 essential in rapidly proliferating stem cell populations with high transcriptional output.",
  arsenicLink: "Part of TFIIH complex suppressed in AA stem cells under arsenic exposure (C8 leading edge)."
},

ERCC4: {
  fullName: "Excision Repair Cross-Complementation Group 4 (XPF)",
  category: "ner",
  summary: "Structure-specific endonuclease that makes the 5′ incision ~20 nucleotides upstream of the lesion. Requires obligate heterodimerization with ERCC1 for stability and activity.",
  cancerLink: "Low XPF associated with increased UV-induced mutagenesis and skin cancer risk. ERCC4 mutations cause XP, Fanconi anemia, and premature aging syndromes.",
  stemLink: "As the enzymatic partner of ERCC1, XPF suppression has equivalent functional consequences to ERCC1 loss in stem cells.",
  arsenicLink: "Indirectly inhibited by arsenic through impairment of ERCC1, its obligate partner. No independent zinc-finger domain targeted by arsenic."
},

ERCC5: {
  fullName: "Excision Repair Cross-Complementation Group 5 (XPG)",
  category: "ner",
  summary: "Structure-specific endonuclease making the 3′ incision ~6 nucleotides downstream of the lesion. Stabilizes the open DNA bubble during repair. Also interacts with TFIIH.",
  cancerLink: "Polymorphisms linked to altered cancer susceptibility. XPG mutations cause severe XP with Cockayne syndrome features. The XPG/ERCC5 3′ cut completes excision of the ~30-nucleotide damage-containing oligomer.",
  stemLink: "XPG stabilizes the TFIIH-DNA complex at damage sites — loss causes collapse of the entire pre-incision complex.",
  arsenicLink: "Arsenic-induced NER suppression affects XPG indirectly through disruption of the upstream assembly steps (XPC recognition, TFIIH loading)."
},

ERCC6: {
  fullName: "Excision Repair Cross-Complementation Group 6 (CSB)",
  category: "ner",
  summary: "Transcription-coupled NER initiator. CSB detects RNA Pol II stalled at a DNA lesion and recruits the TC-NER machinery. SWI/SNF-like ATPase that remodels chromatin at lesion sites.",
  cancerLink: "Mutations cause Cockayne syndrome characterized by UV sensitivity and neurodegeneration. CSB loss impairs TC-NER in transcriptionally active cancer stem cell genes.",
  stemLink: "Highly expressed in transcriptionally active stem cells. Downregulated in both BRL-23 (L2FC −0.29, FDR 0.01) and BRL-24 (L2FC −0.53, FDR <0.001) under arsenic — with stronger suppression in AA cells.",
  arsenicLink: "Differentially downregulated by arsenic between AA (stronger effect) and NHW cells — contributing to TC-NER vulnerability specifically in AA breast cancer stem cells."
},

ERCC8: {
  fullName: "Excision Repair Cross-Complementation Group 8 (CSA)",
  category: "ner",
  summary: "WD40-repeat protein that forms a DDB1-CUL4-CSA E3 ubiquitin ligase complex in TC-NER. Ubiquitinates CSB and histones to open chromatin around stalled RNA Pol II.",
  cancerLink: "Mutations cause Cockayne syndrome. CSA-mediated chromatin remodeling is necessary for efficient TC-NER in actively transcribed oncogenes and tumor suppressor genes.",
  stemLink: "TC-NER sub-pathway gene. Stem cells with active transcription programs depend on TC-NER to protect genes required for self-renewal.",
  arsenicLink: "Part of TC-NER module in this study's NER pathway diagram. Arsenic preferentially suppresses NER in AA stem cells where TC-NER capacity may already be reduced."
},

XPC: {
  fullName: "Xeroderma Pigmentosum Complementation Group C",
  category: "ner",
  summary: "Initiator of Global Genome NER. Recognizes helical distortions caused by bulky DNA lesions and recruits TFIIH to begin repair. Stabilized at damage sites by RAD23A/B and CETN2.",
  cancerLink: "XPC mutations cause xeroderma pigmentosum — a syndrome of extreme UV sensitivity and >2,000-fold elevated skin cancer risk. Low XPC expression in tumors correlates with poor prognosis and cisplatin resistance.",
  stemLink: "Leading edge gene in C8 (AA Stem vs. Parental Arsenic), L2FC = −0.45, FDR = 0.016. Paradoxically induced by arsenic in AA parental cells (L2FC +0.78, FDR <0.001) — suggesting a compensatory response that fails to protect in the stem compartment.",
  arsenicLink: "Arsenic reduces XPC protein levels by promoting its proteasomal degradation. The XPC induction in AA parental cells (vs. no response in NHW: L2FC +0.03) represents a race-specific transcriptional response to arsenic stress that is lost in stem cells."
},

DDB1: {
  fullName: "Damage Specific DNA Binding Protein 1",
  category: "ner",
  summary: "Scaffold protein of the DDB1-DDB2 (UV-DDB) damage recognition complex and CUL4-based E3 ubiquitin ligases. UV-DDB scans chromatin for UV photoproducts and hands off lesions to XPC.",
  cancerLink: "DDB1 is essential for GG-NER in chromatin context. Amplified in some cancers; its ubiquitin ligase scaffolding role extends to ubiquitination of CDT1, CDC25A, and other cell cycle regulators. Higher in NHW baseline cells in this study.",
  stemLink: "Leading edge gene in C8 (L2FC = −0.33, FDR = 0.035). DDB1-CUL4 complexes regulate stem cell epigenetic landscapes by controlling histone H2A and H3 ubiquitination.",
  arsenicLink: "DDB1 protein expression is reduced by arsenic exposure. Suppression in AA stem cells under arsenic (C8) represents part of the coordinated GG-NER damage recognition failure."
},

DDB2: {
  fullName: "Damage Specific DNA Binding Protein 2 (XPE)",
  category: "ner",
  summary: "XPE protein — directly binds UV-induced 6-4 photoproducts and cyclobutane pyrimidine dimers in chromatin. Partners with DDB1 in the UV-DDB complex.",
  cancerLink: "Mutations cause XP group E, the mildest XP form. DDB2 is a p53 target gene — its expression is induced by p53 after UV damage. Arsenic suppresses p53, which reduces DDB2 induction.",
  stemLink: "DDB2 is the lesion-recognition subunit that enables NER in silent chromatin — critical for genome-wide repair across the stem cell epigenome.",
  arsenicLink: "Arsenic trioxide directly reduces DDB2 expression levels, impairing UV-DDB complex function and GG-NER initiation."
},

CETN2: {
  fullName: "Centrin 2",
  category: "ner",
  summary: "Calcium-binding protein that stabilizes XPC at DNA damage sites, dramatically enhancing XPC's damage-recognition affinity. Part of the trimeric XPC-RAD23B-CETN2 complex.",
  cancerLink: "CETN2 overexpression correlates with improved NER capacity in cancer cells. Loss of CETN2 destabilizes the XPC damage-detection complex, impairing GG-NER genome-wide.",
  stemLink: "Leading edge gene in C8 (L2FC = −0.47, FDR = 0.014). Co-suppressed with XPC and RAD23A in AA breast cancer stem cells under arsenic, indicating coordinated destabilization of the XPC initiation complex.",
  arsenicLink: "CETN2 suppression in AA stem cells under arsenic amplifies the NER initiation defect initiated by XPC downregulation — each subunit loss compounds the others."
},

RAD23A: {
  fullName: "RAD23 Homolog A, Nucleotide Excision Repair Protein",
  category: "ner",
  summary: "Ubiquitin-binding shuttle protein that stabilizes XPC and delivers ubiquitinated substrates to the 26S proteasome. Bridges DNA damage recognition with the ubiquitin-proteasome system.",
  cancerLink: "RAD23A loss sensitizes cells to UV and chemical carcinogens. Its ubiquitin receptor activity links NER to proteostasis — relevant in cancers with elevated proteasome activity.",
  stemLink: "Leading edge gene in C8 (L2FC = −0.46, FDR = 0.016). Coordinate suppression with XPC and CETN2 in AA stem cells indicates the entire XPC initiation complex is simultaneously impaired by arsenic.",
  arsenicLink: "Part of the XPC complex suppressed in AA breast cancer stem cells under arsenic. RAD23A's dual NER/proteasome role may make stem cells with high protein turnover particularly vulnerable."
},

RAD23B: {
  fullName: "RAD23 Homolog B, Nucleotide Excision Repair Protein",
  category: "ner",
  summary: "Functional paralog of RAD23A. Primary stabilizer of XPC in the trimeric XPC-RAD23B-CETN2 complex. Dominant partner under normal conditions; RAD23A steps in when RAD23B is limiting.",
  cancerLink: "RAD23B loss impairs NER and increases mutagenic burden. Variants associated with altered cancer susceptibility after UV or chemical carcinogen exposure.",
  stemLink: "Co-expressed with XPC in NER-active cells. Suppression in stem cell context further destabilizes GG-NER initiation.",
  arsenicLink: "Arsenic-induced XPC complex suppression affects RAD23A/B as co-regulatory partners of the key damage-recognition hub."
},

GTF2H1: {
  fullName: "General Transcription Factor IIH Subunit 1 (p62)",
  category: "ner",
  summary: "p62 subunit of TFIIH — the scaffold that anchors the CAK kinase module (CDK7-CCNH-MNAT1) to the core TFIIH complex. Coordinates NER unwinding with transcription initiation.",
  cancerLink: "TFIIH is essential for RNA Pol II transcription; GTF2H1 mutations impair both NER and basal transcription. Suppression in cancer stem cells with high transcriptional demand has dual consequences.",
  stemLink: "Leading edge gene in C8 (AA stem cells under arsenic). TFIIH suppression in stem cells impairs both their transcriptional programs and their DNA repair capacity simultaneously.",
  arsenicLink: "Part of the TFIIH complex coordinately suppressed in AA breast cancer stem cells under arsenic — contributes to the compound NER deficiency."
},

GTF2H4: {
  fullName: "General Transcription Factor IIH Subunit 4 (p52)",
  category: "ner",
  summary: "p52 subunit of TFIIH core. Stimulates XPB ATPase activity required for DNA opening during NER and transcription. Essential structural component holding TFIIH together.",
  cancerLink: "Integral to TFIIH integrity. Mutations destabilize the entire complex, impairing both NER and transcription.",
  stemLink: "TFIIH dependency for stem cell transcriptional programs makes GTF2H4 essential for stem cell identity maintenance.",
  arsenicLink: "Co-suppressed with other TFIIH subunits in the arsenic-exposed AA stem cell NER suppression signature."
},

GTF2H5: {
  fullName: "General Transcription Factor IIH Subunit 5 (TTDA/TFIIHp8)",
  category: "ner",
  summary: "Smallest TFIIH subunit (8 kDa). Stabilizes the entire TFIIH complex at DNA damage sites. Mutations cause a mild form of trichothiodystrophy.",
  cancerLink: "GTF2H5 stabilizes TFIIH after it is recruited to lesion sites — without it, NER stalls at the damage verification step.",
  stemLink: "Part of TFIIH suppressed in AA breast cancer stem cells. Even subtle reductions in TFIIH stability can impair NER efficiency.",
  arsenicLink: "Included in the TFIIH suppression signature observed in AA breast cancer stem cells under arsenic (C8 leading edge)."
},

CDK7: {
  fullName: "Cyclin-Dependent Kinase 7",
  category: "ner",
  summary: "CAK (CDK-Activating Kinase) subunit of TFIIH. A triple-function kinase: (1) activates CDK1/2/4/6 to drive the cell cycle, (2) phosphorylates RNA Pol II CTD for transcription initiation, and (3) phosphorylates XPB to facilitate NER DNA opening.",
  cancerLink: "CDK7 inhibitors (THZ1, SY-1365, CT7001/Samuraciclib) are in clinical trials for triple-negative breast cancer — a subtype with disproportionately higher incidence and mortality in AA women. CDK7 inhibition exploits transcriptional addiction of cancer cells.",
  stemLink: "Consistently downregulated across all 4 stem cell comparisons (L2FC −0.39 to −0.61, C5–C8). The most consistently suppressed TFIIH subunit in this dataset. CDK7 suppression simultaneously impairs cell cycle entry, transcription of stemness genes, and NER.",
  arsenicLink: "CDK7 downregulation in AA breast cancer stem cells under arsenic (C8 L2FC = −0.61, FDR = 0.0003) represents a critical node — its triple role means loss has compound consequences on DNA repair, transcription, and proliferation."
},

CCNH: {
  fullName: "Cyclin H",
  category: "ner",
  summary: "Regulatory cyclin that activates CDK7 within the CAK complex of TFIIH. Cyclin H levels control CAK kinase activity and, thereby, both cell cycle progression and NER efficiency.",
  cancerLink: "CCNH expression correlates with CDK7 activity and transcriptional output in cancer cells. Shared leading edge gene in both C8 and C12 — one of the four most reproducible NER suppression markers.",
  stemLink: "Shared C8 and C12 leading edge (most reproducible NER markers). CCNH suppression amplifies CDK7 inactivation, compounding the triple-function CDK7/TFIIH defect in AA stem cells.",
  arsenicLink: "Co-suppressed with CDK7 in AA stem cells under arsenic. The CDK7-CCNH dimer is the functional CAK unit — loss of either subunit disables both."
},

MNAT1: {
  fullName: "Menage A Trois 1, CDK-Activating Kinase Assembly Factor",
  category: "ner",
  summary: "RING finger protein (MAT1) that assembles the CDK7-CCNH-MNAT1 CAK trimer and anchors it to core TFIIH via GTF2H1. Also promotes CDK7's preference for RNA Pol II CTD as substrate.",
  cancerLink: "MNAT1/MAT1 is a critical assembly factor — cells lacking MAT1 cannot assemble functional CAK, losing CDK7 activity. Proposed oncogene in some contexts due to its transcriptional activation role.",
  stemLink: "Suppressed in stem cell NER signature. MNAT1 loss destabilizes the entire CAK trimer within TFIIH.",
  arsenicLink: "Part of the coordinated TFIIH/CAK suppression in AA breast cancer stem cells exposed to arsenic."
},

XPA: {
  fullName: "Xeroderma Pigmentosum Complementation Group A",
  category: "ner",
  summary: "DNA damage verification factor. After TFIIH unwinds the duplex, XPA confirms the lesion is present and stabilizes the pre-incision complex. Has a zinc-finger domain critical for DNA binding.",
  cancerLink: "Mutations cause the most severe form of XP with high skin cancer risk and neurological degeneration. XPA is rate-limiting for efficient NER in many tissues.",
  stemLink: "Central coordinator of the pre-incision complex — XPA loss disables NER even when all other factors are present and functional.",
  arsenicLink: "XPA contains a zinc-finger domain directly targeted by arsenic trioxide. Arsenic displaces zinc from the XPA Cys4 zinc-finger, unfolding the domain and preventing XPA from binding DNA. This is one of the best-characterized direct mechanisms of arsenic-mediated NER inhibition."
},

RPA1: {
  fullName: "Replication Protein A Subunit 1 (p70)",
  category: "ner",
  summary: "Large subunit of the heterotrimeric Replication Protein A (RPA) complex. Coats the undamaged single-stranded DNA strand after TFIIH unwinding, positioning the endonucleases for precise incision.",
  cancerLink: "RPA complex is essential for NER, replication, and homologous recombination. RPA1 is a hub for DNA damage checkpoint signaling through ATR kinase activation.",
  stemLink: "RPA stabilizes the ssDNA intermediate during NER — a critical step bridging damage recognition and dual incision.",
  arsenicLink: "RPA function is impaired when upstream NER factors (XPA, XPC) are inhibited by arsenic. Part of the gap-filling machinery suppressed in the AA stem cell arsenic exposure signature."
},

RPA2: {
  fullName: "Replication Protein A Subunit 2 (p32)",
  category: "ner",
  summary: "Middle subunit of RPA. Phosphorylated by multiple kinases (CDK2, ATM, ATR, DNA-PK) in response to DNA damage, regulating RPA's switch from replication to repair mode.",
  cancerLink: "RPA2 phosphorylation is a marker of replication stress in cancer cells. Shared leading edge in C8 and C12 — one of four most reproducible NER suppression markers in AA stem cells.",
  stemLink: "Leading edge in both C8 and C12. RPA2 suppression in AA stem cells under arsenic reduces the ssDNA-binding capacity needed for efficient NER and may impair replication fork protection.",
  arsenicLink: "RPA2 is suppressed in AA breast cancer stem cells under arsenic. Its CDK2 phosphorylation site links RPA function to CDK7-mediated cell cycle control, creating a feed-forward vulnerability when CDK7 is also suppressed."
},

RPA3: {
  fullName: "Replication Protein A Subunit 3 (p14)",
  category: "ner",
  summary: "Small subunit of RPA. Stabilizes the RPA heterotrimer and contributes to protein-protein interactions with NER factors, DNA polymerases, and checkpoint proteins.",
  cancerLink: "RPA3, as part of the RPA trimer, is essential for genome integrity. Shared C8 and C12 leading edge — among the four most reproducible NER suppression markers.",
  stemLink: "One of the four genes shared between C8 (AA Stem Arsenic) and C12 (AA vs. NHW Stem Arsenic) leading edges, highlighting its reproducibility as a marker of race-specific NER suppression.",
  arsenicLink: "Co-suppressed with RPA2 in AA stem cells under arsenic. The entire RPA trimer stability depends on all three subunits — loss of RPA3 destabilizes the complex."
},

PCNA: {
  fullName: "Proliferating Cell Nuclear Antigen",
  category: "ner",
  summary: "Homotrimeric DNA sliding clamp. Loaded onto DNA by RFC after NER incision to recruit and processivate gap-fill polymerases (Pol δ and Pol ε). Also coordinates NER completion with chromatin restoration.",
  cancerLink: "PCNA is a canonical proliferation marker used clinically in tumor grading. Its role as a hub for >200 protein interactions makes it central to DNA replication, repair, and cell cycle control in cancer cells.",
  stemLink: "C12 leading edge gene. PCNA expression is linked to stem cell proliferative capacity. PCNA suppression in AA stem cells (racial comparison under arsenic) indicates impaired gap-fill synthesis in the NER final steps.",
  arsenicLink: "Part of the gap-filling machinery suppressed in C12 (AA vs. NHW Stem cells under Arsenic). Arsenic-mediated NER suppression in AA stem cells encompasses both the recognition/incision steps (C8) and the repair synthesis/ligation steps (C12)."
},

LIG1: {
  fullName: "DNA Ligase 1",
  category: "ner",
  summary: "Seals the final nick after gap-filling polymerization completes NER. Also ligates Okazaki fragments during DNA replication. Recruited to NER sites by PCNA.",
  cancerLink: "LIG1 activity is required for both DNA repair and replication — cancers with high replication stress are dependent on LIG1. C12 leading edge (L2FC = −0.74, a notably large suppression).",
  stemLink: "C12 leading edge with substantial suppression (L2FC = −0.74). LIG1 is elevated in NHW stem cells under vehicle (C7: L2FC = +0.99, FDR <0.001), suggesting NHW cells actively upregulate the NER ligation step in stem cells — a capacity lost in AA cells under arsenic.",
  arsenicLink: "LIG1 suppression in AA stem cells (C12) suggests the final ligation step of NER is impaired in the racial comparison under arsenic. Combined with ERCC1 suppression (incision step), NER is blocked at both ends."
},

RFC1: { fullName: "Replication Factor C Subunit 1", category: "ner",
  summary: "Large subunit of the RFC clamp-loader complex. RFC opens PCNA ring and loads it onto primer-template junctions after NER incision, enabling processive gap-fill synthesis.",
  cancerLink: "RFC1 is essential for both replication and repair. Variants in RFC1 are associated with cerebellar ataxia and neuropathy.",
  stemLink: "Part of PCNA clamp-loading machinery suppressed in C12 (AA vs. NHW stem arsenic comparison).",
  arsenicLink: "RFC1 suppression contributes to the gap-filling step deficiency in AA breast cancer stem cells under arsenic." },

RFC2: { fullName: "Replication Factor C Subunit 2", category: "ner",
  summary: "Small subunit of RFC clamp loader. Shared leading edge in both C8 and C12 — one of the four most reproducible NER suppression markers in this study.",
  cancerLink: "RFC2 is amplified in some cancers and required for both leading-strand replication and NER gap-filling. Among the most reproducible racial NER markers.",
  stemLink: "Shared C8 and C12 leading edge — second only to ERCC1 in reproducibility across AA stem cell arsenic comparisons. RFC2 suppression impairs PCNA loading and stalls the final repair synthesis step.",
  arsenicLink: "Co-suppressed with ERCC1, CCNH, and RPA3 in both C8 and C12 leading edges. This four-gene signature represents the most robustly detected NER suppression fingerprint." },

RFC3: { fullName: "Replication Factor C Subunit 3", category: "ner",
  summary: "RFC small subunit. Part of the ring-shaped RFC complex that threads PCNA onto DNA at the 3′ end of the NER gap.",
  cancerLink: "Required for efficient gap-filling in NER and replication fork stability.",
  stemLink: "C12 leading edge (gap-filling machinery suppressed in AA vs. NHW stem cells under arsenic).",
  arsenicLink: "Part of the RFC complex suppressed in the racial stem cell comparison under arsenic." },

RFC4: { fullName: "Replication Factor C Subunit 4", category: "ner",
  summary: "RFC small subunit with ATP-binding activity. Coordinates PCNA ring opening with RFC1 during clamp loading.",
  cancerLink: "Essential clamp loader subunit for both replication and repair.",
  stemLink: "C12 leading edge gene in this study.",
  arsenicLink: "Suppressed in AA stem cell racial comparison under arsenic." },

RFC5: { fullName: "Replication Factor C Subunit 5", category: "ner",
  summary: "Small RFC subunit that completes the pentameric clamp-loader ring. All five RFC subunits are required for productive PCNA loading.",
  cancerLink: "RFC5 mutations cause defects in both NER and mismatch repair due to PCNA loading failure.",
  stemLink: "C12 leading edge gene alongside RFC3 and RFC4.",
  arsenicLink: "Part of the coordinated gap-filling machinery suppression in AA stem cells vs. NHW stem cells under arsenic." },

POLD1: { fullName: "DNA Polymerase Delta Subunit 1 (Catalytic)", category: "ner",
  summary: "Catalytic subunit of DNA Polymerase δ. Performs the bulk of gap-fill synthesis during NER, using PCNA as a processivity clamp. Also proofreads newly synthesized DNA.",
  cancerLink: "POLD1 mutations cause the PPAP (polymerase proofreading-associated polyposis) cancer syndrome. L2FC = −1.42 in NHW stem under vehicle (C7, FDR <0.001) — NHW cells strongly upregulate Pol δ in the stem compartment.",
  stemLink: "C12 leading edge. POLD1 upregulation in NHW stem cells (C7: L2FC +1.42) and suppression relative to NHW in AA stem cells under arsenic (C12) represents a major mechanistic difference in repair synthesis capacity.",
  arsenicLink: "Suppressed in C12 (AA vs. NHW stem arsenic). The strong NHW induction (C7) that does not occur in AA stem cells represents a racial difference in the last step of NER gap filling." },

POLD2: { fullName: "DNA Polymerase Delta Subunit 2", category: "ner",
  summary: "Regulatory subunit of Pol δ. Stabilizes the catalytic POLD1 subunit and mediates interactions with PCNA and checkpoint proteins.",
  cancerLink: "Part of Pol δ holoenzyme. C8 leading edge gene in AA stem cells under arsenic.",
  stemLink: "C8 leading edge gene. Pol δ suppression in AA stem cells under arsenic contributes to failure of NER gap-fill synthesis.",
  arsenicLink: "Included in the NER gap-filling suppression signature in AA breast cancer stem cells (C8 leading edge)." },

POLD3: { fullName: "DNA Polymerase Delta Subunit 3", category: "ner",
  summary: "Small subunit of Pol δ. Required for Pol δ complex stability and full polymerase activity. Also implicated in break-induced replication.",
  cancerLink: "C12 leading edge. Part of the gap-filling machinery racially suppressed in AA stem cells under arsenic.",
  stemLink: "C12 leading edge gene alongside POLD1.",
  arsenicLink: "Co-suppressed with POLD1 in the racial stem cell comparison under arsenic." },

POLE: { fullName: "DNA Polymerase Epsilon Catalytic Subunit", category: "ner",
  summary: "Catalytic subunit of DNA Pol ε. Contributes to NER gap-fill synthesis alongside Pol δ, particularly in GG-NER. Leading-strand replicative polymerase with proofreading 3′→5′ exonuclease.",
  cancerLink: "POLE hotspot mutations cause ultramutated colorectal and endometrial cancers with exceptional immunotherapy response. In NER, POLE suppression impairs gap-fill synthesis.",
  stemLink: "C12 leading edge (racial comparison of stem cells under arsenic). POLE suppression in AA stem cells relative to NHW highlights a coordinated failure of the gap-filling step.",
  arsenicLink: "Part of the gap-filling polymerase suppression in AA stem cells under arsenic (C12 leading edge)." },

POLE2: { fullName: "DNA Polymerase Epsilon Subunit 2", category: "ner",
  summary: "B-subunit of Pol ε. Required for assembly of the Pol ε holoenzyme and for normal S-phase progression.",
  cancerLink: "POLE2 is essential for leading-strand replication. Suppression impairs both replication and NER repair synthesis.",
  stemLink: "C12 leading edge in the racial comparison of stem cells under arsenic.",
  arsenicLink: "Co-suppressed with POLE in the AA vs. NHW stem cell arsenic comparison, highlighting coordinated Pol ε downregulation." },

POLE3: { fullName: "DNA Polymerase Epsilon Subunit 3", category: "ner",
  summary: "Histone-fold subunit of Pol ε. Contributes to Pol ε complex assembly and stimulates Pol ε activity.",
  cancerLink: "Supporting subunit of Pol ε complex. C8 leading edge gene.",
  stemLink: "C8 leading edge — Pol ε small subunit suppressed in AA breast cancer stem cells under arsenic.",
  arsenicLink: "Part of the NER gap-filling suppression in AA stem cells (C8 leading edge)." },

CUL4A: { fullName: "Cullin 4A", category: "ner",
  summary: "Scaffold of CRL4 (Cullin-RING Ligase 4) E3 ubiquitin ligase complexes. CRL4-DDB2 ubiquitinates histones H2A, H3, H4 at UV damage sites to open chromatin for GG-NER.",
  cancerLink: "CUL4A is amplified in breast and lung cancers. Its E3 ligase activity controls substrate turnover including XPC ubiquitination (which counterintuitively stabilizes XPC binding to damage). Located in GG-NER box in NER diagram.",
  stemLink: "CRL4A-DDB2 chromatin remodeling is required for GG-NER access to lesions in heterochromatic stem cell genome regions.",
  arsenicLink: "Arsenic-mediated changes in CUL4A ubiquitin ligase activity affect XPC stability at damage sites. Part of the NER suppression landscape in AA stem cells." },

CUL4B: { fullName: "Cullin 4B", category: "ner",
  summary: "Paralog of CUL4A. Forms similar CRL4B E3 ligase complexes. Both CUL4A and CUL4B participate in UV-induced histone ubiquitination enabling GG-NER.",
  cancerLink: "CUL4B mutations cause X-linked intellectual disability. CUL4B also regulates WNT/β-catenin by ubiquitinating APC.",
  stemLink: "Co-expressed with CUL4A in GG-NER chromatin remodeling. Part of stem cell epigenetic regulation via H2A ubiquitination.",
  arsenicLink: "Part of the GG-NER ubiquitin ligase machinery affected in the AA stem cell arsenic response." },

COPS3: { fullName: "COP9 Signalosome Subunit 3", category: "ner",
  summary: "Subunit 3 of the COP9 Signalosome (CSN). The CSN de-neddylates cullin-RING E3 ligases (including CUL4A/B), controlling their activity cycles in DNA repair and beyond.",
  cancerLink: "CSN regulates the DDB1-CUL4 ubiquitin ligase that ubiquitinates XPC at damage sites, which paradoxically STABILIZES XPC at lesions (a required step for GG-NER handoff to TFIIH). CSN subunits 3–8 are all in the C8 leading edge.",
  stemLink: "All 8 COP9 signalosome subunits found in the Reactome NER pathway leading edge for C8 — representing a new and previously uncharacterized connection between CSN suppression and NER deficiency in AA breast cancer stem cells.",
  arsenicLink: "COP9 signalosome suppression in AA stem cells under arsenic extends the NER deficiency beyond direct NER genes to include the chromatin-remodeling ubiquitin ligase regulatory network." },

COPS4: { fullName: "COP9 Signalosome Subunit 4", category: "ner",
  summary: "CSN subunit 4. Contains a PCI domain for CSN assembly. Part of the isopeptidase complex that removes NEDD8 from cullins.",
  cancerLink: "CSN4 regulates multiple E3 ligases via deneddylation. Suppressed in AA breast cancer stem cells under arsenic (C8 Reactome NER leading edge).",
  stemLink: "C8 Reactome NER leading edge. CSN4 regulates CUL4A activity needed for XPC stabilization during GG-NER in stem cells.",
  arsenicLink: "Part of the COP9 signalosome suppression signature in AA stem cells under arsenic." },

COPS5: { fullName: "COP9 Signalosome Subunit 5 (JAB1)", category: "ner",
  summary: "Catalytic subunit of the CSN — contains a JAB1/MPN metalloprotease domain that cleaves NEDD8 from cullins. Also regulates p53 degradation, AP-1 signaling, and nuclear export of cyclin E.",
  cancerLink: "COPS5/JAB1 is overexpressed in many cancers and promotes tumor progression by activating the AP-1 pathway, degrading p27Kip1, and inactivating p53. Its suppression in AA stem cells under arsenic is paradoxically protective against COPS5 oncogenic activity — but disruptive to NER.",
  stemLink: "Dual oncogenic/NER regulatory role in stem cells. Suppressed in AA breast cancer stem cells under arsenic (C8 leading edge).",
  arsenicLink: "JAB1/COPS5 suppression in AA stem cells alters CUL4A neddylation state, impacting GG-NER through reduced XPC ubiquitination and handoff." },

COPS6: { fullName: "COP9 Signalosome Subunit 6", category: "ner",
  summary: "CSN subunit with an MPN domain. Required for CSN complex assembly and cullin deneddylation activity.",
  cancerLink: "CSN6 is overexpressed in human cancers and stabilizes MDM2, promoting p53 degradation — linking CSN to p53 tumor suppressor regulation.",
  stemLink: "Part of CSN complex suppressed in AA breast cancer stem cells under arsenic (C8 Reactome NER leading edge).",
  arsenicLink: "COPS6 suppression in AA stem cells contributes to CSN-mediated NER regulatory failure." },

COPS7A: { fullName: "COP9 Signalosome Subunit 7A", category: "ner",
  summary: "PCI-domain CSN subunit. Required for COP9 complex stability and function.",
  cancerLink: "Part of CSN complex that regulates multiple tumor suppressor and oncogene pathways. Suppressed in AA breast cancer stem cells under arsenic.",
  stemLink: "C8 Reactome NER leading edge — part of the newly identified CSN/NER connection in AA breast cancer stem cells.",
  arsenicLink: "Co-suppressed with COPS3-6 and COPS8 in the arsenic-exposed AA stem cell COP9 signature." },

COPS8: { fullName: "COP9 Signalosome Subunit 8 (CSN8)", category: "ner",
  summary: "Smallest CSN subunit. Essential for COP9 complex assembly; without it the complex is non-functional.",
  cancerLink: "COPS8 is required for B-cell development and immune surveillance. Loss destabilizes the entire CSN, impairing all cullin-RING ligase regulation.",
  stemLink: "Part of the COP9 signalosome suppression in AA breast cancer stem cells under arsenic (C8 Reactome NER leading edge).",
  arsenicLink: "Co-suppressed with other CSN subunits — the entire COP9 complex appears coordinately downregulated in AA breast cancer stem cells under arsenic exposure." },

PARP1: { fullName: "Poly(ADP-Ribose) Polymerase 1", category: "ner",
  summary: "DNA nick sensor that adds poly-ADP-ribose chains to chromatin proteins at damage sites, triggering DNA repair. Functions in both BER and NER. Contains two zinc-finger domains critical for DNA binding.",
  cancerLink: "PARP inhibitors (olaparib, niraparib, rucaparib) are approved for BRCA1/2-mutant cancers. Higher PARP1 expression in NHW cells at baseline in this study.",
  stemLink: "PARP1 promotes chromatin relaxation at DNA damage sites needed for NER access. Higher in NHW vs. AA cells — potentially contributing to NHW advantage in DNA repair.",
  arsenicLink: "Arsenic directly displaces zinc from both PARP1 zinc-finger domains (Cys3His zinc fingers), blocking PARP1 DNA binding and catalytic activity. This is a key direct mechanism of arsenic-mediated DNA repair suppression alongside XPA targeting." },

PARP2: { fullName: "Poly(ADP-Ribose) Polymerase 2", category: "ner",
  summary: "Functional paralog of PARP1. Contributes to DNA damage sensing, particularly at nicked DNA ends. Heterodimers with PARP1 for full activity at complex damage sites.",
  cancerLink: "PARP2 contributes to PARP-mediated trapping at damage sites. Included in NER gene set alongside PARP1.",
  stemLink: "Part of the NER-associated gene set in this study.",
  arsenicLink: "Arsenic targeting of zinc-finger domains affects PARP2 as well as PARP1, given their shared zinc-finger architecture." },

/* ═══════════════ STEMNESS / EMT ═══════════════ */

SNAI2: { fullName: "Snail Family Transcriptional Repressor 2 (SLUG)", category: "stem",
  summary: "E-box binding transcription factor. Represses E-cadherin expression to drive epithelial-mesenchymal transition (EMT). Confers stem cell properties by repressing differentiation programs.",
  cancerLink: "SNAI2/SLUG overexpression is associated with breast cancer metastasis, chemotherapy resistance, and cancer stem cell expansion. Its repression of p53-mediated apoptosis makes SLUG-high cells resistant to genotoxic stress.",
  stemLink: "Higher in NHW cells at baseline. A key regulator of the mammary stem cell state. SLUG-high cells co-express CD44 and CD49f — markers used to sort the stem population in this study.",
  arsenicLink: "EMT program including SNAI2 is suppressed by acute arsenic treatment in NHW parental cells (C3) but maintained in the stem compartment, suggesting EMT markers are stable in sorted stem populations independent of arsenic." },

VIM: { fullName: "Vimentin", category: "stem",
  summary: "Type III intermediate filament protein expressed in cells of mesenchymal origin. A canonical mesenchymal/EMT marker upregulated during cancer cell invasion and metastasis.",
  cancerLink: "VIM expression is a marker of aggressive, mesenchymal breast cancer phenotypes. Associated with triple-negative breast cancer, high recurrence, and worse prognosis. Higher in NHW cells at baseline.",
  stemLink: "Vimentin expression marks mesenchymal stem cells and correlates with breast cancer stem cell identity. Higher NHW baseline expression may reflect a more mesenchymal-primed state.",
  arsenicLink: "Part of the EMT signature differentially expressed between AA and NHW cells, with arsenic modulating EMT programs differently across racial backgrounds." },

ALDH1A3: { fullName: "Aldehyde Dehydrogenase 1 Family Member A3", category: "stem",
  summary: "Metabolic enzyme that converts aldehydes to carboxylic acids. ALDH1A3 activity (measured by ALDEFLUOR assay) is a functional marker of cancer stem cells — particularly aggressive, treatment-resistant cells.",
  cancerLink: "ALDH1A3 is overexpressed in breast cancer stem cells and associates with tumor-initiating capacity, drug resistance, and metastatic potential. Higher in AA baseline cells (reversed under arsenic).",
  stemLink: "Higher in AA cells at baseline (before arsenic), then reversed under arsenic treatment. ALDH1A3 activity is used clinically to identify cancer stem cell populations; its regulation by arsenic may alter stem cell pool dynamics between AA and NHW cells.",
  arsenicLink: "ALDH1A3 expression is reversed by arsenic in AA cells — initially higher in AA parental cells, arsenic suppresses this advantage. The biological consequence for stem cell pool size in AA women exposed to environmental arsenic is an open question." },

BMI1: { fullName: "BMI1 Proto-Oncogene, Polycomb Ring Finger", category: "stem",
  summary: "Polycomb group protein. Component of PRC1 complex that monoubiquitinates histone H2A to epigenetically silence target genes including the CDKN2A/p16 locus. Master regulator of stem cell self-renewal.",
  cancerLink: "BMI1 is overexpressed in many cancers and confers cancer stem cell properties by silencing p16-mediated senescence and p53-mediated apoptosis. A therapeutic target for stem cell-driven malignancies.",
  stemLink: "Canonical stem cell self-renewal factor. BMI1 represses p16/INK4a to allow unlimited self-renewal divisions — a key property of cancer stem cells in this study's sorted population.",
  arsenicLink: "Polycomb complex regulation is altered by arsenic-induced chromatin remodeling, potentially affecting the stem cell epigenetic landscape in AA vs. NHW cells." },

SMO: { fullName: "Smoothened, Frizzled Class Receptor", category: "stem",
  summary: "GPCR-like receptor in the Hedgehog signaling pathway. SMO is inhibited by PTCH1 in the absence of HH ligand; activation allows SMO to promote GLI transcription factor nuclear entry.",
  cancerLink: "SMO inhibitors (vismodegib, sonidegib) are approved for basal cell carcinoma. Hedgehog/SMO pathway drives cancer stem cell self-renewal across multiple tumor types.",
  stemLink: "Hedgehog signaling (HALLMARK_HEDGEHOG_SIGNALING) is strongly induced by arsenic in both NHW and AA stem cells (C9: NES +2.15, C10: NES +2.01). Arsenic may activate Hedgehog through non-canonical GLI activation, expanding stem cell populations.",
  arsenicLink: "Arsenic paradoxically activates Hedgehog signaling while simultaneously suppressing NER — maintaining stem cell self-renewal capacity while increasing mutagenic burden. This combination is particularly dangerous in AA stem cells." },

ALDH1A1: { fullName: "Aldehyde Dehydrogenase 1 Family Member A1", category: "stem",
  summary: "Canonical breast cancer stem cell marker measured by the ALDEFLUOR assay. Involved in retinoic acid synthesis and drug detoxification.",
  cancerLink: "ALDH1A1-high cells have high tumor-initiating capacity, are chemotherapy-resistant, and predict poor prognosis in breast cancer. Lower ALDH1A1 expression correlates with better outcomes.",
  stemLink: "A primary functional marker of breast cancer stem cells alongside CD44+/CD24− phenotype. Part of the stemness gene set in this study.",
  arsenicLink: "Aldehyde metabolism by ALDH enzymes may detoxify arsenic-induced aldehyde byproducts of lipid peroxidation. ALDH1 activity alteration by arsenic could affect stem cell redox homeostasis." },

MYC: { fullName: "MYC Proto-Oncogene, BHLH Transcription Factor", category: "stem",
  summary: "Pleiotropic transcription factor regulating ~15% of the genome. Drives cell cycle entry, ribosome biogenesis, metabolic reprogramming, and stem cell pluripotency. One of the four Yamanaka reprogramming factors.",
  cancerLink: "MYC is amplified or overexpressed in >50% of human cancers. MYC targets (HALLMARK_MYC_TARGETS_V1) are induced under arsenic in stem cells (C9: NES +2.05, C10: NES +1.66), suggesting arsenic promotes MYC-driven transcriptional programs in stem cells.",
  stemLink: "MYC drives stem cell self-renewal and is a core pluripotency factor. MYC target induction under arsenic in both NHW and AA stem cells implies arsenic amplifies the MYC transcriptional program specifically in the stem compartment.",
  arsenicLink: "Arsenic induces MYC target gene programs in both NHW and AA stem cells (C9 NES +2.05, C10 NES +1.66). This paradoxically pro-growth effect alongside NER suppression represents the 'double hit' — more cell division + less repair = higher mutation rate." },

HIF1A: { fullName: "Hypoxia Inducible Factor 1 Subunit Alpha", category: "stem",
  summary: "Master regulator of hypoxic gene expression. HIF1A drives metabolic adaptation, angiogenesis, and stem cell maintenance under low-oxygen conditions.",
  cancerLink: "HIF1A is stabilized in many cancers due to pseudohypoxia. HALLMARK_HYPOXIA is strongly induced by arsenic in both NHW parental (C3: NES +2.05) and stem cells (C9: NES +2.19, C10: NES +2.35).",
  stemLink: "Hypoxia signaling maintains cancer stem cell niches. Arsenic-driven hypoxia pathway induction (C10: NES +2.35 is the strongest) may reinforce stem cell identity while simultaneously creating oxidative stress that damages DNA.",
  arsenicLink: "Arsenic activates HIF1A through reactive oxygen species, creating pseudohypoxia signaling. This HIF1A-driven ROS production compounds the oxidative DNA damage burden in AA stem cells that already have suppressed NER." },

/* ═══════════════ ARSENIC RESPONSE ═══════════════ */

HMOX1: { fullName: "Heme Oxygenase 1", category: "arsenic",
  summary: "Rate-limiting enzyme in heme catabolism. HMOX1 is a canonical NRF2-driven cytoprotective gene induced by oxidative stress, heavy metals, and inflammatory signals. Produces CO and biliverdin as anti-inflammatory mediators.",
  cancerLink: "HMOX1 is paradoxically both cytoprotective and pro-tumorigenic — its induction helps cancer cells survive oxidative stress while CO and biliverdin suppress anti-tumor immune responses. Among the most strongly induced arsenic-response genes.",
  stemLink: "HMOX1 induction in arsenic-exposed cells buffers reactive oxygen species. Its differential induction between AA and NHW cells contributes to the racial transcriptional response to arsenic.",
  arsenicLink: "HMOX1 is a canonical arsenic-response gene — one of the strongest arsenic-induced transcripts across cell types. NRF2 activation by arsenic-induced ROS drives HMOX1 expression as part of the antioxidant response (C4 leading edge in this study)." },

SLC7A11: { fullName: "Solute Carrier Family 7 Member 11 (xCT)", category: "arsenic",
  summary: "Cystine/glutamate antiporter. Imports extracellular cystine for glutathione synthesis — critical for cellular antioxidant defense. A key regulator of ferroptosis sensitivity.",
  cancerLink: "SLC7A11 is overexpressed in many cancers to fuel glutathione production against oxidative stress. High SLC7A11 confers ferroptosis resistance, potentially protecting cancer cells from oxidative damage including arsenic-induced ROS.",
  stemLink: "Cancer stem cells often express high SLC7A11 to maintain their reduced redox state. Arsenic-induced SLC7A11 expression may help AA cells buffer oxidative damage — but insufficient to compensate for the NER deficiency.",
  arsenicLink: "SLC7A11 is a canonical arsenic-response gene. Arsenic-induced oxidative stress activates NRF2 → SLC7A11 transcription to import cystine for glutathione synthesis. Included in the C4 (AA arsenic) leading edge." },

NFE2L2: { fullName: "Nuclear Factor Erythroid 2-Related Factor 2 (NRF2)", category: "arsenic",
  summary: "Master transcription factor of the antioxidant response. Under oxidative stress, NRF2 escapes KEAP1-mediated degradation, enters the nucleus, and activates >200 cytoprotective genes via ARE elements.",
  cancerLink: "NRF2 gain-of-function mutations occur in 15–25% of lung cancers, conferring chemotherapy resistance. Arsenic activates NRF2 antioxidant axis (NQO1, HMOX1, SLC7A11, AKR1C1) as a cytoprotective response — but this response is overwhelmed in AA stem cells with suppressed NER.",
  stemLink: "NRF2 drives antioxidant programs in cancer stem cells, helping maintain redox balance needed for self-renewal. The NRF2 antioxidant response is activated by arsenic in both AA and NHW cells.",
  arsenicLink: "Arsenic trioxide activates NRF2 by multiple mechanisms: (1) ROS-mediated oxidation of KEAP1 cysteines, (2) direct arsenic binding to KEAP1 thiols. The NRF2/KEAP1 axis is the primary sensor of arsenic exposure in mammalian cells." },

HMOX1: { fullName: "Heme Oxygenase 1", category: "arsenic",
  summary: "Rate-limiting heme catabolism enzyme and canonical NRF2 target. Induced by oxidative stress and arsenic.",
  cancerLink: "Canonical arsenic-response gene. Among strongest induced transcripts.",
  stemLink: "Differential induction between AA/NHW contributes to racial arsenic response.",
  arsenicLink: "NRF2-driven gene strongly induced by arsenic (C4 leading edge)." },

NQO1: { fullName: "NAD(P)H Quinone Oxidoreductase 1", category: "arsenic",
  summary: "Cytosolic two-electron reductase. Detoxifies quinones to prevent redox cycling and ROS generation. A canonical NRF2 antioxidant target gene.",
  cancerLink: "NQO1 activity is reduced by the common C609T polymorphism (NQO1*2), affecting detoxification capacity and cancer risk. NQO1 is used as a biomarker of NRF2 pathway activation.",
  stemLink: "NQO1 maintains cellular redox balance in cancer stem cells with high metabolic activity. Part of the arsenic-response gene set in this study.",
  arsenicLink: "NQO1 is robustly induced by arsenic via NRF2. Its induction in arsenic-exposed cells represents a compensatory detoxification response." },

AKR1C1: { fullName: "Aldo-Keto Reductase Family 1 Member C1", category: "arsenic",
  summary: "Metabolizes steroid hormones, prostaglandins, and xenobiotics. An NRF2 target gene involved in reductive detoxification of carbonyl compounds generated by lipid peroxidation.",
  cancerLink: "AKR1C1 expression correlates with hormone-independent breast cancer. Part of the arsenic-response leading edge in AA parental cells (C4) in this study.",
  stemLink: "Detoxification role in metabolically active cancer stem cells.",
  arsenicLink: "Arsenic-induced lipid peroxidation generates aldehyde byproducts detoxified by AKR1C1 — part of the C4 arsenic-response leading edge." },

ATF3: { fullName: "Activating Transcription Factor 3", category: "arsenic",
  summary: "Stress-induced bZIP transcription factor. A hub of the integrated stress response — induced by DNA damage, oxidative stress, hypoxia, and inflammatory signals.",
  cancerLink: "ATF3 has dual roles: tumor suppressive in normal cells (inducing apoptosis) but oncogenic in cancer cells (promoting invasiveness and survival under stress). Part of the arsenic stress-response signature.",
  stemLink: "ATF3 drives adaptive transcriptional responses in cancer stem cells under genotoxic stress. Its induction helps cells reprogram gene expression to survive arsenic exposure.",
  arsenicLink: "ATF3 is a rapid and robust arsenic-response gene. It mediates transcriptional reprogramming downstream of arsenic-induced integrated stress response signaling." },

CXCL8: { fullName: "C-X-C Motif Chemokine Ligand 8 (IL-8)", category: "arsenic",
  summary: "Potent neutrophil chemoattractant and angiogenic factor. Secreted in response to inflammatory signals and genotoxic stress. A canonical NF-κB target gene.",
  cancerLink: "IL-8 promotes tumor angiogenesis, invasion, and cancer stem cell self-renewal. High CXCL8 in tumor microenvironment correlates with poor prognosis. Part of the arsenic/inflammatory response and C11 racial leading edge in this study.",
  stemLink: "CXCL8/IL-8 promotes cancer stem cell expansion via CXCR1/CXCR2 receptors — an autocrine loop that may be differentially activated in AA vs. NHW stem cells.",
  arsenicLink: "CXCL8 induction is part of the arsenic-driven inflammatory response. Differential CXCL8 regulation between racial backgrounds may contribute to distinct immune microenvironment differences in arsenic-exposed tissues." },

HSPB1: { fullName: "Heat Shock Protein Family B (Small) Member 1 (HSP27)", category: "arsenic",
  summary: "Small heat shock protein with chaperone activity. Protects cells from proteotoxic and oxidative stress. Inhibits apoptosis by sequestering pro-apoptotic factors.",
  cancerLink: "HSP27/HSPB1 overexpression drives chemotherapy resistance in multiple cancer types. Inhibition of HSPB1 sensitizes cancer cells to treatment — a therapeutic strategy under investigation.",
  stemLink: "Stress chaperone in cancer stem cells. HSPB1 protects against protein aggregation under arsenic-induced oxidative stress conditions.",
  arsenicLink: "HSPB1 is induced by arsenite as part of the heat shock/proteotoxic stress response, helping cells manage arsenic-induced protein damage." },

/* ═══════════════ INFLAMMATORY ═══════════════ */

ICAM1: { fullName: "Intercellular Adhesion Molecule 1 (CD54)", category: "inflam",
  summary: "Cell surface glycoprotein mediating leukocyte adhesion to endothelium and antigen-presenting cells. Induced by IFN-γ, TNF-α, and IL-1. Core element of the racial inflammatory baseline signature.",
  cancerLink: "ICAM1 on tumor cells enhances immune surveillance (NK cell killing, T cell adhesion) but also promotes tumor-leukocyte interactions that can be pro-tumorigenic. Part of the core 7-gene inflammatory signature shared between C1 and C11 (racial comparisons) in this study.",
  stemLink: "Shared leading edge in racial parental (C1) and racial stem (C11) comparisons — baseline racial difference in ICAM1 is preserved across both parental and stem compartments.",
  arsenicLink: "ICAM1 is part of the NHW-dominant inflammatory baseline signature. This racial inflammatory bias is counterintuitively higher in NHW cells despite clinical associations of inflammation with worse AA breast cancer outcomes." },

IL1A: { fullName: "Interleukin 1 Alpha", category: "inflam",
  summary: "Pleiotropic pro-inflammatory cytokine. Acts locally as an alarmin released from damaged cells and systemically as a fever-inducing agent. Master regulator of the acute inflammatory response.",
  cancerLink: "IL-1α promotes tumor invasiveness, angiogenesis, and immune evasion. Part of the core inflammatory signature higher in NHW cells at baseline in this study.",
  stemLink: "IL-1α signaling can drive cancer stem cell expansion and maintain an inflammatory niche. Part of both C1 and C11 leading edges.",
  arsenicLink: "Part of the NHW-dominant inflammatory baseline. Understanding why NHW cells express higher inflammatory cytokines yet have better NER capacity is a key paradox of this study." },

NFKBIA: { fullName: "NFKB Inhibitor Alpha (IkB-alpha)", category: "inflam",
  summary: "Cytoplasmic inhibitor of NF-κB transcription factors. IκBα sequesters NF-κB dimers in the cytoplasm until degraded by IKK-mediated phosphorylation. Paradoxically, high NFKBIA can indicate high NF-κB throughput.",
  cancerLink: "NFKBIA mutations cause constitutive NF-κB activation in diffuse large B-cell lymphoma. In this study, NFKBIA is gained in C11 vs. C1 leading edge (amplified in stem cells), suggesting NF-κB signaling increases in the stem compartment.",
  stemLink: "NFKBIA induction in NHW stem cells (C11 leading edge) suggests NF-κB flux is elevated in the NHW stem compartment — potentially driving self-renewal through NF-κB target genes.",
  arsenicLink: "NF-κB/IκBα signaling is a key inflammatory regulator altered by arsenic. NHW cells show more robust NF-κB-linked inflammatory signatures under arsenic conditions." },

STAT3: { fullName: "Signal Transducer and Activator of Transcription 3", category: "inflam",
  summary: "Transcription factor activated by cytokine receptors (JAK-STAT pathway), particularly IL-6 and IL-10. STAT3 drives cancer stem cell self-renewal, immune evasion, and anti-apoptotic gene programs.",
  cancerLink: "Constitutive STAT3 activation is found in ~70% of breast cancers. STAT3 inhibitors are in clinical development. STAT3 promotes cancer stem cell identity by driving OCT4, NANOG, and SOX2 expression.",
  stemLink: "Critical mediator of IL-6-driven cancer stem cell expansion. STAT3 signaling links the inflammatory microenvironment to cancer stem cell self-renewal programs.",
  arsenicLink: "Arsenic can activate STAT3 through reactive oxygen species and NF-κB cross-talk. STAT3 activation in arsenic-exposed stem cells may maintain self-renewal capacity despite NER suppression." },

NFKB1: { fullName: "Nuclear Factor Kappa B Subunit 1 (p50)", category: "inflam",
  summary: "p50 subunit of NF-κB transcription factor complexes. Forms heterodimers with p65 (RELA) or p52 to regulate inflammatory, immune, and survival gene expression.",
  cancerLink: "NF-κB p50/p65 drives inflammatory gene programs that promote cancer cell survival, invasion, and drug resistance. NF-κB-mediated inflammatory tone is higher in NHW cells in this study.",
  stemLink: "NF-κB promotes cancer stem cell self-renewal and EMT. The NF-κB amplification observed in NHW stem cells (C11) may explain their maintained self-renewal under arsenic.",
  arsenicLink: "Arsenic activates NF-κB by multiple mechanisms including IKK activation and direct oxidative modification of IκBα. This contributes to the arsenic-driven inflammatory response." },

TNF: { fullName: "Tumor Necrosis Factor Alpha", category: "inflam",
  summary: "Pleiotropic cytokine with dual roles: at low levels promotes inflammation and immune surveillance; at high levels induces apoptosis. Canonical NF-κB activator.",
  cancerLink: "TNF in the tumor microenvironment can both suppress (immune surveillance) and promote (chronic inflammation) tumor growth. TNFα signaling via NF-κB (HALLMARK_TNFA_SIGNALING_VIA_NFKB) is higher in NHW cells at both baseline (C1: NES = −1.57) and under arsenic (C2: NES = −1.76).",
  stemLink: "TNF-driven NF-κB signaling maintains cancer stem cell survival. NHW cells' higher TNFα/NF-κB tone may support a more inflammatory stem cell niche.",
  arsenicLink: "Arsenic activates TNF/NF-κB signaling, contributing to the inflammatory gene programs differentially expressed between AA and NHW cells." },

CCL2: { fullName: "C-C Motif Chemokine Ligand 2 (MCP-1)", category: "inflam",
  summary: "Monocyte chemoattractant protein-1. Recruits monocytes, T cells, and dendritic cells to sites of inflammation. Gained in C11 (vs. C1) racial leading edge — amplified in the NHW stem cell compartment.",
  cancerLink: "CCL2 promotes immunosuppressive tumor microenvironments by recruiting M2 macrophages and MDSCs. Part of the NHW-dominant inflammatory signature gained in the stem cell compartment.",
  stemLink: "Gained in C11 (stem racial comparison) vs. C1 (parental racial comparison) leading edge — part of the enriched inflammatory signaling in NHW stem cells.",
  arsenicLink: "Part of the arsenic-amplified inflammatory gene set that differentiates NHW from AA stem cells under arsenic conditions." }
};
