const MONTHS_IN_YEAR = 12;

const RETIREMENT_PROFILE_BASE_MONTHS = {
  male: 60 * MONTHS_IN_YEAR,
  "female-cadre": 55 * MONTHS_IN_YEAR,
  "female-worker": 50 * MONTHS_IN_YEAR
};

export const REGION_TEMPLATE_BASE_MONTHS = {
  "national-default": 180,
  beijing: 180,
  shanghai: 180,
  guangdong: 180
};

function addMonths(date, months) {
  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + months);
  return result;
}

export function ageToMonths(years, months) {
  const safeYears = Number.isFinite(years) ? years : 0;
  const safeMonths = Number.isFinite(months) ? months : 0;
  return safeYears * MONTHS_IN_YEAR + safeMonths;
}

export function monthsToAge(totalMonths) {
  const safeMonths = Math.max(0, Math.floor(totalMonths));
  return {
    years: Math.floor(safeMonths / MONTHS_IN_YEAR),
    months: safeMonths % MONTHS_IN_YEAR
  };
}

export function getRetirementAgeByProfile(profile, delayMonths = 0) {
  const baseMonths = RETIREMENT_PROFILE_BASE_MONTHS[profile];
  if (!baseMonths) {
    throw new Error("unsupported retirement profile");
  }

  const safeDelayMonths = Math.max(0, Math.floor(delayMonths));
  return monthsToAge(baseMonths + safeDelayMonths);
}

export function getMinimumContributionByRegion(regionTemplate, adjustmentMonths = 0) {
  const baseMonths = REGION_TEMPLATE_BASE_MONTHS[regionTemplate];
  if (!Number.isFinite(baseMonths)) {
    throw new Error("unsupported region template");
  }

  const safeAdjustmentMonths = Math.floor(Number(adjustmentMonths) || 0);
  return Math.max(0, baseMonths + safeAdjustmentMonths);
}

export function monthsUntilDate(fromDate, toDate) {
  if (!(fromDate instanceof Date) || Number.isNaN(fromDate.getTime())) {
    throw new Error("fromDate is invalid");
  }
  if (!(toDate instanceof Date) || Number.isNaN(toDate.getTime())) {
    throw new Error("toDate is invalid");
  }

  if (toDate <= fromDate) {
    return 0;
  }

  let months =
    (toDate.getFullYear() - fromDate.getFullYear()) * MONTHS_IN_YEAR +
    (toDate.getMonth() - fromDate.getMonth());

  if (toDate.getDate() > fromDate.getDate()) {
    months += 1;
  }

  return Math.max(0, months);
}

export function computeRetirementPlan({
  birthDate,
  retirementAgeYears,
  retirementAgeMonths,
  contributedMonths,
  minimumContributionMonths,
  currentDate = new Date()
}) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    throw new Error("birthDate is invalid");
  }

  const retirementAgeTotalMonths = ageToMonths(retirementAgeYears, retirementAgeMonths);
  if (retirementAgeTotalMonths <= 0) {
    throw new Error("retirement age must be greater than 0");
  }

  const safeContributedMonths = Math.max(0, Math.floor(contributedMonths));
  const safeMinimumContributionMonths = Math.max(0, Math.floor(minimumContributionMonths));

  const retirementDate = addMonths(birthDate, retirementAgeTotalMonths);
  const monthsUntilAge = monthsUntilDate(currentDate, retirementDate);
  const monthsToMinContribution = Math.max(
    0,
    safeMinimumContributionMonths - safeContributedMonths
  );

  const monthsUntilEligible = Math.max(monthsUntilAge, monthsToMinContribution);

  return {
    retirementDate,
    monthsUntilAge,
    monthsToMinContribution,
    monthsUntilEligible,
    projectedContributionMonths: safeContributedMonths + monthsUntilEligible,
    needsDelayedRetirementForContribution: monthsToMinContribution > monthsUntilAge
  };
}
