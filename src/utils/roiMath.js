/**
 * ROI Math Engine
 * Source: Original ROI Calculator <script>
 * NOTE: Logic is NOT modified – only refactored for React usage
 */

/* -------------------------------------------------------
 * Templates (conservative defaults)
 * ----------------------------------------------------- */
export const templateDefs = {
  custom: {
    note: "Custom: choose pathway and provide minimal numbers."
  },
  leakage: {
    note: "Leakage: avoided loss. Conservative defaults applied.",
    mode: "new",
    capex: 60000,
    opexMonthly: 4000
  },
  fraud: {
    note: "Fraud: avoided paid loss. Conservative defaults applied.",
    mode: "new",
    capex: 75000,
    opexMonthly: 5000
  },
  conversion: {
    note: "Conversion: incremental profit. Conservative defaults applied.",
    mode: "new",
    capex: 80000,
    opexMonthly: 6000
  },
  ops: {
    note: "Ops: cost reduction. Conservative defaults applied.",
    mode: "existing",
    capex: 65000,
    opexMonthly: 3500,
    reductionPct: 25
  }
};

/* -------------------------------------------------------
 * Insurance relevance gate
 * ----------------------------------------------------- */
const INSURANCE_KEYWORDS = [
  "insurance","carrier","mga","broker","underwriting","underwriter",
  "claims","fnol","adjuster","policy","endorsement","premium","quote",
  "bind","renewal","submission","acord","loss ratio","fraud","leakage",
  "subrogation","triage","intake","bordereau","rating","compliance",
  "doi","naic","cat","reinsurance","tpa","claims ops","policy admin","uw"
];

const IRRELEVANT_KEYWORDS = [
  "train","railway","locomotive","rocket","spacecraft",
  "bridge design","mining rig","fashion brand","restaurant","airport"
];

const normalize = (t = "") =>
  t.toLowerCase().replace(/\s+/g, " ").trim();

export const relevanceCheck = (usecase) => {
  const t = normalize(usecase);

  if (!t) {
    return {
      status: "warn",
      message:
        "Describe an insurance workflow (claims, underwriting, policy, fraud, leakage, conversion)."
    };
  }

  const hasIrrelevant = IRRELEVANT_KEYWORDS.some(k => t.includes(k));
  const hasInsurance = INSURANCE_KEYWORDS.some(k => t.includes(k));

  if (hasIrrelevant && !hasInsurance) {
    return {
      status: "block",
      message:
        "This does not appear to be an insurance AI use case. Please reframe using insurance workflows."
    };
  }

  const tooShort = t.length < 18;
  const hasVerb = /(reduce|improve|automate|detect|extract|classify|triage|audit)/.test(t);

  if (tooShort || !hasVerb) {
    return {
      status: "warn",
      message:
        "Use case unclear. Add workflow + volume + target delta (e.g. reduce FNOL touch time by 25%)."
    };
  }

  return { status: "ok" };
};

/* -------------------------------------------------------
 * Evidence haircut
 * ----------------------------------------------------- */
export const haircutFactor = (evidence) => {
  if (evidence === "assumption") return 0.7;
  if (evidence === "pilot") return 0.85;
  return 1.0;
};

/* -------------------------------------------------------
 * Discount helpers
 * ----------------------------------------------------- */
const monthlyDiscountFactor = (annualPct) => {
  const r = (annualPct || 0) / 100;
  return (m) => 1 / Math.pow(1 + r, m / 12);
};

/* -------------------------------------------------------
 * Break-even month
 * ----------------------------------------------------- */
export const findBreakEvenMonth = (cumProfit = []) => {
  for (let i = 0; i < cumProfit.length; i++) {
    if (cumProfit[i] >= 0) return i + 1;
  }
  return null;
};

/* -------------------------------------------------------
 * Core ROI computation
 * ----------------------------------------------------- */
export const computeROI = (input, applyHaircut = false) => {
  const {
    mode,
    monthlyCost,
    reductionPct,
    monthlyUplift,
    capex,
    opexMonthly = 0,
    horizonMonths = 36,
    rampType = "linear",
    npvToggle = "off",
    discountRate = 0,
    evidence
  } = input;

  if (!capex || capex <= 0) {
    return { ok: false, err: "CapEx must be greater than 0." };
  }

  if (opexMonthly < 0) {
    return { ok: false, err: "OpEx cannot be negative." };
  }

  let grossBase = 0;

  if (mode === "existing") {
    if (!monthlyCost || !reductionPct) {
      return { ok: false, err: "Baseline cost and reduction % required." };
    }
    grossBase = monthlyCost * (reductionPct / 100);
  } else {
    if (!monthlyUplift) {
      return { ok: false, err: "Monthly uplift required." };
    }
    grossBase = monthlyUplift;
  }

  const hf = applyHaircut ? haircutFactor(evidence) : 1;
  const gross = grossBase * hf;

  const months = Math.max(12, Math.min(36, Number(horizonMonths)));
  const netSeries = [];

  for (let i = 0; i < months; i++) {
    let value = gross;
    if (rampType === "linear") {
      value = gross * (1 + i / 12);
    }
    netSeries.push(value - opexMonthly);
  }

  const netAvg3 =
    (netSeries[0] + netSeries[1] + netSeries[2]) / 3;

  const payback =
    netAvg3 <= 0 ? Infinity : capex / netAvg3;

  const net12 =
    netSeries.slice(0, 12).reduce((a, b) => a + b, 0);

  const roiAnnualNet = (net12 / capex) * 100;

  let running = 0;
  const cumProfit = netSeries.map(v => {
    running += v;
    return running - capex;
  });

  let npv = null;
  if (npvToggle === "on") {
    const df = monthlyDiscountFactor(discountRate);
    let pv = -capex;
    netSeries.forEach((v, i) => {
      pv += v * df(i + 1);
    });
    npv = pv;
  }

  return {
    ok: true,
    hf,
    netAvg3,
    payback,
    roiAnnualNet,
    netProfit: running - capex,
    netSeries,
    cumProfit,
    npv,
    months
  };
};

/* -------------------------------------------------------
 * Recommendation logic
 * ----------------------------------------------------- */
export const recommendROI = (input, adj) => {
  if (!isFinite(adj.payback) || adj.netAvg3 <= 0) {
    return {
      level: "error",
      label: "Not Recommended",
      detail:
        "Risk-adjusted net benefit is not positive. Reduce OpEx or improve measurable uplift."
    };
  }

  if (
    adj.roiAnnualNet >= input.roiThreshold &&
    adj.payback <= input.paybackThreshold
  ) {
    return {
      level: "success",
      label: "Recommended",
      detail: "Meets decision thresholds under risk adjustment."
    };
  }

  if (
    adj.roiAnnualNet >= input.roiThreshold * 0.7 &&
    adj.payback <= input.paybackThreshold * 1.2
  ) {
    return {
      level: "warning",
      label: "Borderline",
      detail: "Close to thresholds. Validate with pilot data."
    };
  }

  return {
    level: "error",
    label: "Not Recommended",
    detail: "Does not meet ROI or payback thresholds."
  };
};
