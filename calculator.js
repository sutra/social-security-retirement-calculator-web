const MONTHS_IN_YEAR = 12;

const RETIREMENT_PROFILE_BASE_MONTHS = {
	male: 60 * MONTHS_IN_YEAR,
	"female-cadre": 55 * MONTHS_IN_YEAR,
	"female-worker": 50 * MONTHS_IN_YEAR
};

const RETIREMENT_POLICY = {
	male: {
		anchorBirthMonth: { year: 1965, month: 1 },
		birthWindowMonths: 4,
		maxDelayMonths: 36
	},
	"female-cadre": {
		anchorBirthMonth: { year: 1970, month: 1 },
		birthWindowMonths: 4,
		maxDelayMonths: 36
	},
	"female-worker": {
		anchorBirthMonth: { year: 1975, month: 1 },
		birthWindowMonths: 2,
		maxDelayMonths: 60
	}
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

function monthIndex(year, month) {
	return year * MONTHS_IN_YEAR + (month - 1);
}

function getBirthDelayMonthsByPolicy(profile, birthDate) {
	const policy = RETIREMENT_POLICY[profile];
	if (!policy) {
		return 0;
	}

	const birthMonth = monthIndex(birthDate.getFullYear(), birthDate.getMonth() + 1);
	const anchorMonth = monthIndex(policy.anchorBirthMonth.year, policy.anchorBirthMonth.month);
	if (birthMonth < anchorMonth) {
		return 0;
	}

	const diff = birthMonth - anchorMonth;
	const delayMonths = Math.floor(diff / policy.birthWindowMonths) + 1;
	return Math.max(0, Math.min(policy.maxDelayMonths, delayMonths));
}

export function getStatutoryRetirementAgeByPolicy(profile, birthDate) {
	if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
		throw new Error("birthDate is invalid");
	}
	const baseMonths = RETIREMENT_PROFILE_BASE_MONTHS[profile];
	if (!baseMonths) {
		throw new Error("unsupported retirement profile");
	}

	const policyDelayMonths = getBirthDelayMonthsByPolicy(profile, birthDate);
	const totalAgeMonths = baseMonths + policyDelayMonths;
	return {
		...monthsToAge(totalAgeMonths),
		totalAgeMonths,
		policyDelayMonths
	};
}

export function getMinimumContributionByRegion(regionTemplate, adjustmentMonths = 0) {
	const baseMonths = REGION_TEMPLATE_BASE_MONTHS[regionTemplate];
	if (!Number.isFinite(baseMonths)) {
		throw new Error("unsupported region template");
	}

	const safeAdjustmentMonths = Math.floor(Number(adjustmentMonths) || 0);
	return Math.max(0, baseMonths + safeAdjustmentMonths);
}

export function getNationalMinimumContributionMonthsByRetirementDate(retirementDate) {
	if (!(retirementDate instanceof Date) || Number.isNaN(retirementDate.getTime())) {
		throw new Error("retirementDate is invalid");
	}

	const year = retirementDate.getFullYear();
	if (year <= 2029) {
		return 180;
	}

	// From 2030, minimum contribution rises by 6 months per year to a cap of 20 years.
	const increasedMonths = (year - 2029) * 6;
	return Math.min(240, 180 + increasedMonths);
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
	const safeCurrentDate =
		currentDate instanceof Date && !Number.isNaN(currentDate.getTime()) ? currentDate : new Date();

	const retirementDate = addMonths(birthDate, retirementAgeTotalMonths);
	const monthsUntilAge = monthsUntilDate(safeCurrentDate, retirementDate);
	const monthsToMinContribution = Math.max(
		0,
		safeMinimumContributionMonths - safeContributedMonths
	);
	// Assume contribution is paid continuously month by month from current date.
	const minimumContributionReachDate = addMonths(safeCurrentDate, monthsToMinContribution);

	const monthsUntilEligible = Math.max(monthsUntilAge, monthsToMinContribution);

	return {
		retirementDate,
		minimumContributionReachDate,
		monthsUntilAge,
		monthsToMinContribution,
		monthsUntilEligible,
		projectedContributionMonths: safeContributedMonths + monthsUntilEligible,
		needsDelayedRetirementForContribution: monthsToMinContribution > monthsUntilAge
	};
}
