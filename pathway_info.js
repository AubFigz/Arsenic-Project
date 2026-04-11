// Pathway information database for interactive pop-ups
// Each entry: fullName, summary, studyContext, clinicalRelevance
window.PATHWAY_INFO = {

"KEGG_NUCLEOTIDE_EXCISION_REPAIR": {
  fullName: "Nucleotide Excision Repair (KEGG)",
  summary: "The primary repair pathway for bulky DNA lesions that distort the double helix — including UV-induced cyclobutane pyrimidine dimers (CPDs), 6-4 photoproducts, and bulky chemical adducts from environmental carcinogens like benzo[a]pyrene and arsenic-induced oxidative lesions. Comprises ~30 proteins acting in a precise sequential assembly from damage recognition through dual incision, gap-fill synthesis, and nick ligation.",
  studyContext: "THE primary finding of this paper. NES = −2.75, FDR = 0.18 in C8 (AA Stem vs. Parental Arsenic) — the most negative NES in the entire 48-run GSEA analysis. NES = +0.86 in C7 (NHW same conditions), demonstrating race-specific, stem-cell-specific, arsenic-dependent suppression. 16 leading edge genes in C8 (XPC, DDB1, CETN2, RAD23A, CDK7, ERCC3, GTF2H1, POLD2, POLE3, RFC1, RFC2, RPA2, RPA3, ERCC1, CCNH, and additional). Shared C8 & C12 genes: ERCC1, CCNH, RFC2, RPA3.",
  clinicalRelevance: "Suppressed NER in AA breast cancer stem cells under arsenic predicts elevated accumulation of unrepaired DNA lesions, increased mutagenesis rates, and potential chemotherapy resistance (ERCC1 is the key platinum-resistance biomarker). Population-level: millions of Americans drink arsenic-contaminated water, with disproportionate exposure in Southern states with elevated AA populations and advanced breast cancer rates."
},

"REACTOME_NUCLEOTIDE_EXCISION_REPAIR": {
  fullName: "Nucleotide Excision Repair (Reactome)",
  summary: "The Reactome NER gene set is broader than KEGG, incorporating the COP9 Signalosome (CSN) subunits as upstream regulators of CUL4-DDB2 ubiquitin ligase activity — a novel NER-adjacent connection. Reactome's hierarchical annotation captures both GG-NER and TC-NER sub-pathways with their unique initiating factors.",
  studyContext: "Also significant in C8. Notably, the Reactome NER leading edge in C8 includes all 8 COP9 Signalosome subunits (COPS3–COPS8) — a chromatin-remodeling regulatory complex not captured in the KEGG set. This extends the NER suppression signature beyond direct repair genes to include upstream epigenetic regulators.",
  clinicalRelevance: "CSN regulation of CUL4-DDB2 ubiquitin ligase (which ubiquitinates XPC at damage sites) represents a previously uncharacterized level of NER vulnerability in AA breast cancer stem cells under arsenic exposure."
},

"REACTOME_BASE_EXCISION_REPAIR": {
  fullName: "Base Excision Repair (Reactome)",
  summary: "BER removes small, non-helix-distorting base modifications — oxidized bases (8-oxoG), deaminated cytosines, and alkylated bases. Initiated by DNA glycosylases that flip damaged bases out of the helix. BER is the primary pathway for oxidative DNA damage repair.",
  studyContext: "NES = −2.43 in C7 (NHW Stem vs. Parental Arsenic) — interestingly, BER is suppressed in NHW stem cells under arsenic despite NER being maintained. This suggests arsenic impairs BER broadly but this is masked by NER suppression only in AA stem cells. Elevated in stem vs. parental comparisons generally, reflecting elevated DNA repair capacity of stem cells.",
  clinicalRelevance: "Given that arsenic generates reactive oxygen species (ROS) that primarily create oxidized base lesions (BER substrates), suppression of BER under arsenic exposure paradoxically increases the oxidative damage burden that cannot be repaired."
},

"KEGG_BASE_EXCISION_REPAIR": {
  fullName: "Base Excision Repair (KEGG)",
  summary: "KEGG's BER gene set captures the core BER enzymes: OGG1 (removes 8-oxoG), PARP1/2 (damage sensing), APE1 (AP site processing), Pol β (gap fill), and LIG3 (ligation). PARP1 is a direct arsenic target via zinc-finger displacement.",
  studyContext: "BER and NER share gap-filling factors (PCNA, RFC, Pol δ/ε, LIG1) — suppression of these shared components impairs both pathways simultaneously in AA stem cells.",
  clinicalRelevance: "PARP inhibitors (olaparib, niraparib) exploit BER defects in BRCA1/2-mutant cancers. The arsenic-BER interaction raises the question of whether PARP inhibitor sensitivity might be altered by arsenic exposure in AA breast cancer stem cells."
},

"REACTOME_MISMATCH_REPAIR": {
  fullName: "Mismatch Repair (Reactome)",
  summary: "MMR corrects base-pair mismatches and small insertion/deletion loops arising from replication errors. Key proteins: MLH1, MSH2, MSH6, PMS2. MMR deficiency causes Lynch syndrome (hereditary colorectal cancer) and creates microsatellite instability (MSI-high tumors).",
  studyContext: "MMR is broadly elevated in stem cell vs. parental comparisons (C5–C8), validating that stem cells maintain higher genome surveillance across all repair pathways. Elevated MMR in stem cells may reflect their need to protect the template strand during asymmetric division.",
  clinicalRelevance: "MSI-high tumors are predictive of pembrolizumab response regardless of tumor type (FDA pan-cancer approval). MSH2 is higher in NHW cells at baseline in this study."
},

"KEGG_MISMATCH_REPAIR": {
  fullName: "Mismatch Repair (KEGG)",
  summary: "KEGG MMR gene set. MMR shares PCNA, RFC, DNA Pol δ, and RPA with NER — suppression of these shared components in AA stem cells under arsenic impairs both pathways.",
  studyContext: "MMR upregulation in stem cells (C5–C8) is part of the broader pattern of elevated DNA repair capacity in the stem compartment. This makes the race-specific NER suppression in C8 particularly striking — while MMR/HR/BER are all elevated, NER alone is suppressed in AA stem cells under arsenic.",
  clinicalRelevance: "Shared gap-filling machinery (Pol δ, PCNA, RFC) means arsenic-mediated suppression of these factors likely impairs NER, BER, and MMR simultaneously in AA stem cells."
},

"KEGG_HOMOLOGOUS_RECOMBINATION": {
  fullName: "Homologous Recombination (KEGG)",
  summary: "HR repairs DNA double-strand breaks (DSBs) using the sister chromatid as template — the most accurate DSB repair pathway. Key proteins: BRCA1, BRCA2, RAD51, RPA, PALB2. Active in S/G2 phase when sister chromatids are available.",
  studyContext: "HR is elevated in stem cell vs. parental comparisons alongside MMR, BER, and other repair pathways — consistent with the high genome surveillance capacity of stem cells. The NER-specific suppression in AA stem cells under arsenic is especially remarkable given that all other repair pathways appear elevated.",
  clinicalRelevance: "BRCA1/2 germline mutations impair HR and confer high lifetime breast and ovarian cancer risk. BRCA1/2 somatic mutations drive triple-negative breast cancer, which has higher incidence in AA women."
},

"REACTOME_HDR_THROUGH_HOMOLOGOUS_RECOMBINATION_HRR": {
  fullName: "Homology Directed Repair via Homologous Recombination (Reactome)",
  summary: "Reactome's HR gene set with broader coverage of HR sub-pathways including synthesis-dependent strand annealing (SDSA) and break-induced replication (BIR).",
  studyContext: "Elevated in stem cell comparisons, confirming that the sorted CD24−/CD49f+/CD44+ breast cancer stem cells have elevated genome surveillance capacity broadly. The NER-specific suppression by arsenic in AA stem cells stands out against this background of elevated repair.",
  clinicalRelevance: "HR proficiency determines sensitivity to PARP inhibitors and platinum drugs — a clinically critical distinction for treatment selection in AA breast cancer patients."
},

"HALLMARK_G2M_CHECKPOINT": {
  fullName: "G2/M Cell Cycle Checkpoint (Hallmark)",
  summary: "Genes regulated at the G2/M transition including CDC2, CCNB1, and CDK1 targets. Reflects cells actively progressing through S/G2/M phases. Canonical marker of proliferating progenitor/stem cell populations.",
  studyContext: "NES = +2.76 in C5 (NHW Stem vs. Parental Vehicle) — one of the highest NES values in the dataset. Part of the stem cell validation evidence: sorted CD24−/CD49f+/CD44+ cells show strongly enriched cell cycle programs consistent with cancer stem cell active proliferation.",
  clinicalRelevance: "G2M checkpoint enrichment validates the sorted stem cell identity. CDK7 (TFIIH/CAK subunit) phosphorylates CDK1 to drive G2/M entry — CDK7 suppression in AA stem cells under arsenic may impair this checkpoint while also suppressing NER."
},

"HALLMARK_E2F_TARGETS": {
  fullName: "E2F Transcription Factor Targets (Hallmark)",
  summary: "Genes regulated by E2F transcription factors during S-phase and DNA replication. E2F targets include PCNA, RRM1/2, and DNA replication machinery genes. Reflects transcriptional programs associated with cell cycle entry and replication.",
  studyContext: "NES = +2.75 in C5 (NHW Stem vs. Parental Vehicle) — a core stem cell validation pathway. E2F target enrichment in both NHW and AA stem cells confirms that sorted cells are actively cycling, consistent with cancer stem cell identity.",
  clinicalRelevance: "E2F targets include PCNA, RFC, and RPA — shared NER components. E2F-driven replication programs in stem cells may compete with NER for these limiting shared factors, potentially explaining why stem cells are more vulnerable to NER suppression."
},

"HALLMARK_MYC_TARGETS_V1": {
  fullName: "MYC Target Genes V1 (Hallmark)",
  summary: "A curated set of MYC-regulated genes involved in ribosome biogenesis, nucleotide synthesis, and metabolic reprogramming. MYC is a master regulator of the proliferative transcriptional program.",
  studyContext: "NES = +2.05 in C9 (NHW Stem Arsenic vs. Vehicle) and +1.66 in C10 (AA Stem Arsenic vs. Vehicle). Arsenic paradoxically INDUCES MYC target programs in stem cells while suppressing NER — this pro-proliferative effect combined with DNA repair deficiency is the molecular basis of the 'double hit' hypothesis.",
  clinicalRelevance: "MYC drives cancer cell transcriptional addiction, making MYC-high cells sensitive to CDK7 inhibitors (THZ1) that block RNA Pol II pause-release — potentially targeting the arsenic-activated MYC program in stem cells."
},

"BENPORATH_ES_2": {
  fullName: "Ben-Porath Embryonic Stem Cell Signature 2 (CGP)",
  summary: "An empirically derived gene signature from human embryonic stem cells (Ben-Porath et al., 2008). Genes highly expressed in pluripotent ESCs that mark undifferentiated stem cell identity. Includes OCT4/SOX2/NANOG targets.",
  studyContext: "NES = +1.84 in C5 (NHW Stem vs. Parental Vehicle). Along with PECE_MAMMARY_STEM_CELL_UP and G2M/E2F Hallmarks, BenPorath ES2 enrichment validates that sorted CD24−/CD49f+/CD44+ cells carry genuine stem cell transcriptional identity — not just a surface marker artifact.",
  clinicalRelevance: "Pluripotency gene signatures in cancer cells predict poor prognosis, chemotherapy resistance, and high metastatic potential. Stem cell gene programs maintained under arsenic exposure suggest arsenic does not eliminate the stem cell phenotype — only impairs its DNA repair capacity."
},

"PECE_MAMMARY_STEM_CELL_UP": {
  fullName: "Pece Mammary Stem Cell Upregulated Genes (CGP)",
  summary: "Empirically derived gene set of genes upregulated in sorted human mammary stem cells (Pece et al., 2010). Specific to breast tissue stem cell biology — a more relevant stem cell signature for mammary cell lines than generic ESC signatures.",
  studyContext: "NES = +1.85 in C5 (NHW Stem vs. Parental Vehicle). The tissue-specific mammary stem cell signature enrichment provides the strongest evidence that sorted CD24−/CD49f+/CD44+ cells are bona fide mammary stem cells, validating the FACS sorting strategy.",
  clinicalRelevance: "The Pece mammary stem cell signature is the most clinically relevant stem cell validation for breast cancer research. Its enrichment confirms that findings in this study apply to the mammary stem cell compartment specifically."
},

"HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION": {
  fullName: "Epithelial-Mesenchymal Transition (Hallmark)",
  summary: "Genes upregulated during EMT — the developmental program where epithelial cells lose polarity/cell contacts and acquire migratory, invasive mesenchymal properties. Includes VIM, FN1, SNAI1/2, CDH2, ZEB1/2.",
  studyContext: "NES = −1.70 in C3 (NHW Arsenic vs. Vehicle Parental) — arsenic suppresses EMT in NHW parental cells acutely. This is consistent with published literature showing short-term arsenic suppresses EMT while chronic exposure may promote it. EMT is maintained in sorted stem cells.",
  clinicalRelevance: "EMT is a key driver of breast cancer metastasis and drug resistance. Understanding how arsenic modulates EMT differently across racial backgrounds and cell types has implications for cancer progression under environmental arsenic exposure."
},

"HALLMARK_HEDGEHOG_SIGNALING": {
  fullName: "Hedgehog Signaling Pathway (Hallmark)",
  summary: "Genes upregulated by active Hedgehog/GLI signaling. HH pathway drives self-renewal in normal and cancer stem cells. Activated by Smoothened (SMO) when Patched (PTCH1) is relieved of Sonic Hedgehog ligand binding.",
  studyContext: "NES = +2.00 in C3 (NHW Parental Arsenic) and +1.54 in C4 (AA Parental Arsenic) and +2.15 in C9 (NHW Stem) and +2.01 in C10 (AA Stem). Arsenic robustly activates Hedgehog signaling across all arsenic conditions. Arsenic may activate non-canonical GLI signaling, maintaining stem cell self-renewal while simultaneously suppressing NER in AA stem cells.",
  clinicalRelevance: "SMO inhibitors (vismodegib, sonidegib) target HH/GLI in cancer. Arsenic-driven Hedgehog activation may paradoxically maintain and expand cancer stem cell populations even as it suppresses their DNA repair, increasing the mutagenic stem cell pool."
},

"HALLMARK_NOTCH_SIGNALING": {
  fullName: "Notch Signaling Pathway (Hallmark)",
  summary: "Genes upregulated by Notch receptor cleavage and NICD/RBPJ transcriptional activation. Notch drives stem cell self-renewal, binary cell fate decisions, and T-cell development. HES1 is a canonical Notch target.",
  studyContext: "NES = +1.79 in C9 (NHW Stem Arsenic) and +1.70 in C10 (AA Stem Arsenic). Like Hedgehog, Notch is induced by arsenic specifically in stem cells. This dual Hedgehog/Notch induction under arsenic in the stem compartment reinforces the paradox: arsenic amplifies self-renewal programs while suppressing NER in AA stem cells.",
  clinicalRelevance: "Notch inhibitors (γ-secretase inhibitors) are in clinical trials for breast cancer. Arsenic-driven Notch induction in stem cells may maintain the cancer stem cell niche during arsenic exposure, preventing stem cell pool depletion while accumulating mutations."
},

"HALLMARK_WNT_BETA_CATENIN_SIGNALING": {
  fullName: "WNT/Beta-Catenin Signaling (Hallmark)",
  summary: "Genes upregulated by WNT/β-catenin transcriptional activity. WNT drives stem cell self-renewal in mammary gland development and cancer. β-catenin nuclear localization activates MYC, CCND1, and other proliferation/stemness genes.",
  studyContext: "Part of the key pathway panel. WNT/β-catenin along with Hedgehog and Notch constitutes the three canonical stem cell self-renewal pathways — all three are dysregulated under arsenic in stem cells.",
  clinicalRelevance: "WNT pathway activation drives triple-negative breast cancer stem cells — a subtype with higher incidence in AA women. CUL4A (suppressed in AA stem cells under arsenic) also ubiquitinates APC, a WNT pathway negative regulator."
},

"HALLMARK_INFLAMMATORY_RESPONSE": {
  fullName: "Inflammatory Response (Hallmark)",
  summary: "Genes involved in cellular response to inflammatory stimuli including cytokines, pattern recognition, and immune activation. Represents the downstream transcriptional output of TLR, IL-1R, TNF-R, and IFN-R signaling.",
  studyContext: "NES = −1.69 in C1 (higher in NHW Parental Vehicle) and −2.30 in C11 (higher in NHW Stem Vehicle). This counterintuitive finding — higher inflammatory tone in NHW cells despite clinical associations of inflammation with worse AA outcomes — is a key paradox of the study. The NHW inflammatory signature is dominated by immune surveillance genes (IFN, TLR, lymphocyte markers) rather than classical pro-tumor cytokines.",
  clinicalRelevance: "Understanding the race-specific inflammatory baseline may explain differential breast cancer outcomes. NHW inflammatory gene activation may represent active immune surveillance that is absent in AA cells — with implications for immunotherapy response."
},

"HALLMARK_TNFA_SIGNALING_VIA_NFKB": {
  fullName: "TNF-alpha Signaling via NF-kappaB (Hallmark)",
  summary: "Genes upregulated by TNFα through NF-κB activation — including anti-apoptotic genes (BCL2A1, BIRC3), inflammatory cytokines (IL6, CXCL8), and adhesion molecules (ICAM1, VCAM1).",
  studyContext: "NES = −1.57 in C1 and −1.76 in C2 (higher in NHW cells) — NHW cells have stronger NF-κB signaling at both baseline and under arsenic. This NF-κB advantage may drive NHW cell survival under arsenic while AA cells are more susceptible to arsenic-induced DNA damage accumulation.",
  clinicalRelevance: "NF-κB is a major driver of inflammatory breast cancer and treatment resistance. NF-κB inhibitors (bortezomib) are used clinically. The racial NF-κB bias identified here suggests differential responses to NF-κB-targeting therapies between AA and NHW patients."
},

"HALLMARK_INTERFERON_GAMMA_RESPONSE": {
  fullName: "Interferon Gamma Response (Hallmark)",
  summary: "Genes induced by IFN-γ including MHC class I/II, ICAM1, IRF1, and STAT1. IFN-γ coordinates adaptive immunity and is the primary cytokine signal for anti-tumor immune responses.",
  studyContext: "Part of the NHW-dominant inflammatory signature. Higher IFN-γ response in NHW cells could reflect better antigen presentation capacity, consistent with the immune surveillance interpretation of the racial inflammatory paradox.",
  clinicalRelevance: "IFN-γ signaling is critical for T-cell-mediated tumor killing and for the efficacy of immune checkpoint inhibitors (anti-PD-1/PD-L1). Racial differences in IFN-γ response may predict differential immunotherapy outcomes."
},

"HALLMARK_OXIDATIVE_PHOSPHORYLATION": {
  fullName: "Oxidative Phosphorylation (Hallmark)",
  summary: "Genes encoding mitochondrial electron transport chain (ETC) complexes I–V and ATP synthase. OxPhos drives the bulk of cellular ATP production from NADH oxidation. OxPhos generates superoxide as a byproduct that is converted to H₂O₂ and then hydroxyl radical (Fenton reaction) — the primary source of endogenous ROS.",
  studyContext: "Strikingly stable racial difference: AA cells have consistently higher OxPhos (C1: NES +1.68, C2: NES +1.26, C11: NES +1.77, C12: NES +1.72) across ALL conditions including stem vs. parental and arsenic vs. vehicle. This is the most stable pathway-level racial difference in the dataset.",
  clinicalRelevance: "Higher OxPhos in AA cells generates elevated endogenous ROS, creating a higher baseline oxidative DNA damage burden. Combined with arsenic-induced NER suppression in AA stem cells, this creates the 'double hit' of the mechanistic model: more damage + less repair = accelerated mutagenesis and cancer progression."
},

"HALLMARK_XENOBIOTIC_METABOLISM": {
  fullName: "Xenobiotic Metabolism (Hallmark)",
  summary: "Genes encoding enzymes that metabolize foreign compounds — CYPs, GSTs, UGTs, and sulfotransferases. Xenobiotic metabolism converts lipophilic toxins to water-soluble metabolites for excretion, but can also activate pro-carcinogens.",
  studyContext: "NES = −1.59 in C2 (higher in NHW Parental Arsenic) and −1.82 in C11 (higher in NHW Stem). NHW cells have stronger xenobiotic metabolism capacity, potentially detoxifying arsenic more efficiently at both bulk and stem cell levels.",
  clinicalRelevance: "Differential arsenic detoxification capacity between AA and NHW cells could amplify the disparity in arsenic-induced genomic damage. If NHW cells convert arsenite to less reactive methylated forms more efficiently, they would experience lower effective arsenic doses at the DNA level."
},

"HALLMARK_HYPOXIA": {
  fullName: "Hypoxia Response (Hallmark)",
  summary: "Genes upregulated in response to low oxygen tension via HIF1A transcriptional activation — glycolytic enzymes, angiogenic factors (VEGFA), and survival genes. Hypoxia signaling is activated by ROS even in normoxia (pseudohypoxia).",
  studyContext: "NES = +2.05 in C3 (NHW Parental Arsenic), +2.19 in C9 (NHW Stem), +2.35 in C10 (AA Stem — the strongest hypoxia NES in the dataset). Arsenic induces robust hypoxia/HIF1A signaling in stem cells, particularly in AA stem cells. Arsenic-generated ROS activate HIF1A in normoxia (pseudohypoxia), compounding the oxidative DNA damage burden.",
  clinicalRelevance: "HIF1A-driven hypoxia programs promote cancer stem cell maintenance, angiogenesis, and resistance to chemo/radiotherapy. The strongest hypoxia induction in AA stem cells under arsenic (C10: NES +2.35) may maintain the stem cell niche capacity while simultaneously suppressing NER."
},

"HALLMARK_APOPTOSIS": {
  fullName: "Apoptosis (Hallmark)",
  summary: "Genes involved in programmed cell death — caspases, BCL2 family members, cytochrome c release, and death receptor signaling. Apoptosis is the primary mechanism of cytotoxic drug action.",
  studyContext: "Apoptosis pathway enrichment in the stem cell comparisons (C5–C8) — but notably, no apoptosis activation is observed specifically in AA stem cells under arsenic. This implies that arsenic-exposed AA stem cells maintain survival despite NER suppression, consistent with the Hedgehog/Notch self-renewal maintenance finding.",
  clinicalRelevance: "Failure to activate apoptosis despite DNA repair deficiency is a hallmark of cancer stem cells. The maintained survival of AA stem cells under arsenic combined with NER suppression is the key feature driving the mutagenic 'double hit'."
},

"HALLMARK_DNA_REPAIR": {
  fullName: "DNA Repair (Hallmark)",
  summary: "A curated Hallmark gene set covering multiple DNA repair pathways including NER, BER, MMR, HR, and NHEJ. Broader than individual pathway KEGG/Reactome sets — captures the overall DNA repair capacity of a cell.",
  studyContext: "Elevated in stem cell vs. parental comparisons broadly, confirming higher genome surveillance in stem cells. The race-specific NER suppression (KEGG/Reactome NER sets) is therefore embedded within an otherwise elevated DNA repair backdrop — making it pathway-specific, not a pan-repair effect.",
  clinicalRelevance: "Overall DNA repair capacity is a key determinant of chemotherapy sensitivity and carcinogen-induced mutagenesis. The pathway-specificity of arsenic-induced NER suppression (not all repair, just NER) in AA stem cells has implications for predicting cancer risk from specific exposures."
},

"KAN_RESPONSE_TO_ARSENIC_TRIOXIDE": {
  fullName: "Kan Arsenic Trioxide Response Signature (CGP)",
  summary: "Empirically derived gene signature of transcriptional changes induced by arsenic trioxide treatment — from the Kan et al. study measuring the transcriptional response to As₂O₃. Genes in this set were up- or down-regulated by arsenic in the original study.",
  studyContext: "NES = −1.54 in C1 (NHW baseline shows pre-existing arsenic-response-like signature — NHW cells are transcriptionally 'primed' for arsenic response), −1.63 in C4 (AA parental arsenic response), −1.69 in C11 (NHW stem), −1.65 in C12 (AA stem arsenic, racial comparison). The negative NES means NHW cells express more of this signature than AA cells — NHW cells have a stronger canonical arsenic response across all conditions.",
  clinicalRelevance: "The KAN arsenic signature being higher in NHW cells at baseline suggests NHW cells are transcriptionally pre-adapted to mount an arsenic response, potentially explaining their resilience to arsenic-induced NER suppression."
},

"HALLMARK_G2M_CHECKPOINT": {
  fullName: "G2/M Cell Cycle Checkpoint (Hallmark)",
  summary: "Genes upregulated in cells progressing through G2/M — CDC20, AURKA/B, PLK1, CCNB1/2, and checkpoint kinases. Canonical marker of dividing stem/progenitor cells.",
  studyContext: "NES = +2.76 in C5 — strongest stem validation pathway. Confirms active cycling of sorted stem cells.",
  clinicalRelevance: "CDK7 (suppressed in AA stem cells) is required for G2/M checkpoint function via CDK1 activation — CDK7 loss in AA stem cells may impair the G2/M checkpoint while also suppressing NER."
}
};
