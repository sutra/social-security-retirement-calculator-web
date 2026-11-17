import {
	computeRetirementPlan,
	getMinimumContributionByRegion,
	getNationalMinimumContributionMonthsByRetirementDate,
	getRetirementAgeByProfile,
	getStatutoryRetirementAgeByPolicy,
	monthsToAge
} from "./calculator.js";
import { applyStaticTranslations, getLocale, setLocale, t } from "./i18n.js";

const localeSelect = document.getElementById("locale-select");
const form = document.getElementById("calculator-form");
const resultBox = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const shareHeadline = document.getElementById("share-headline");
const shareSubtitle = document.getElementById("share-subtitle");
const shareGeneratedAt = document.getElementById("share-generated-at");
const resultShareDisclaimer = document.getElementById("result-share-disclaimer");
const resultAiDisclaimer = document.getElementById("result-ai-disclaimer");
const detailsList = document.getElementById("details");
const appAiNoticeText = document.getElementById("app-ai-notice-text");
const appAiUpdated = document.getElementById("app-ai-updated");
const policyAiNoticeText = document.getElementById("policy-ai-notice-text");
const policyAiUpdated = document.getElementById("policy-ai-updated");
const policyDisclaimer = document.getElementById("policy-disclaimer");
const retirementProfileInput = document.getElementById("retirementProfile");
const delayMonthsInput = document.getElementById("delayMonths");
const retirementAgeYearsInput = document.getElementById("retirementAgeYears");
const retirementAgeMonthsInput = document.getElementById("retirementAgeMonths");
const regionTemplateInput = document.getElementById("regionTemplate");
const regionAdjustmentMonthsInput = document.getElementById("regionAdjustmentMonths");
const minimumContributionMonthsInput = document.getElementById("minimumContributionMonths");
const copyButton = document.getElementById("copy-result");
const copyShareLinkButton = document.getElementById("copy-share-link");
const downloadButton = document.getElementById("download-result");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");
const stepsList = document.getElementById("steps");
const formNotice = document.getElementById("form-notice");
const confirmModal = document.getElementById("confirm-modal");
const confirmModalTitle = document.getElementById("confirm-modal-title");
const confirmModalMessage = document.getElementById("confirm-modal-message");
const confirmCancelButton = document.getElementById("confirm-cancel");
const confirmOkButton = document.getElementById("confirm-ok");

const HISTORY_KEY = "retirement-calculator-history-v1";
const HISTORY_LIMIT = 20;
const PROFILE_OPTIONS = ["male", "female-cadre", "female-worker", "custom"];
const REGION_TEMPLATE_OPTIONS = [
	"national-default",
	"beijing",
	"shanghai",
	"guangdong",
	"custom"
];

const COMPLIANCE_DATES = {
	appNoticeUpdatedDate: "2026-10-27",
	policyNoticeUpdatedDate: "2026-10-27"
};

let currentResultText = "";
let lastRenderedState = null;
let confirmAction = null;
let currentAsOfDateString = "";
let formNoticeTimer = null;

const modalDefaults = {
	initialFocus: "ok",
	onConfirm: null
};

function formatDate(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function formatNow() {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, "0");
	const d = String(now.getDate()).padStart(2, "0");
	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	return `${y}-${m}-${d} ${hh}:${mm}`;
}

function parseDateString(value) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
		return null;
	}
	const parsed = new Date(`${value}T00:00:00`);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toSafeNumber(value, fallback = 0) {
	const num = Number(value);
	return Number.isFinite(num) ? num : fallback;
}

function applyComplianceCopy() {
	if (appAiNoticeText) {
		appAiNoticeText.textContent = t("app.aiNoticeText");
	}
	if (appAiUpdated) {
		appAiUpdated.textContent = t("app.aiUpdated", {
			date: COMPLIANCE_DATES.appNoticeUpdatedDate
		});
	}
	if (policyAiNoticeText) {
		policyAiNoticeText.textContent = t("policy.aiNoticeText");
	}
	if (policyAiUpdated) {
		policyAiUpdated.textContent = t("policy.aiUpdated", {
			date: COMPLIANCE_DATES.policyNoticeUpdatedDate
		});
	}
	if (resultShareDisclaimer) {
		resultShareDisclaimer.textContent = t("result.shareDisclaimer");
	}
	if (resultAiDisclaimer) {
		resultAiDisclaimer.textContent = t("result.aiDisclaimer");
	}
	if (policyDisclaimer) {
		policyDisclaimer.textContent = t("policy.disclaimer");
	}
}

function buildShareQueryString() {
	const params = new URLSearchParams();
	params.set("birthDate", document.getElementById("birthDate").value);
	params.set("profile", retirementProfileInput.value);
	params.set("delayMonths", String(toSafeNumber(delayMonthsInput.value, 0)));
	params.set("regionTemplate", regionTemplateInput.value);
	params.set("regionAdjustmentMonths", String(toSafeNumber(regionAdjustmentMonthsInput.value, 0)));
	params.set("contributedMonths", String(toSafeNumber(document.getElementById("contributedMonths").value, 0)));
	params.set("retirementAgeYears", String(toSafeNumber(retirementAgeYearsInput.value, 0)));
	params.set("retirementAgeMonths", String(toSafeNumber(retirementAgeMonthsInput.value, 0)));
	params.set(
		"minimumContributionMonths",
		String(toSafeNumber(minimumContributionMonthsInput.value, 0))
	);
	params.set("asOf", currentAsOfDateString || formatDate(new Date()));
	params.set("lang", getLocale());
	return params.toString();
}

function updateUrlWithCurrentInputs() {
	const query = buildShareQueryString();
	const newUrl = `${window.location.pathname}?${query}`;
	window.history.replaceState({}, "", newUrl);
}

function applyInputsFromUrlIfPresent() {
	const params = new URLSearchParams(window.location.search);
	const birthDate = params.get("birthDate");
	if (!birthDate) {
		return false;
	}

	const parsedBirthDate = parseDateString(birthDate);
	if (!parsedBirthDate) {
		return false;
	}

	document.getElementById("birthDate").value = birthDate;

	const profile = params.get("profile");
	retirementProfileInput.value = PROFILE_OPTIONS.includes(profile) ? profile : "male";
	delayMonthsInput.value = String(toSafeNumber(params.get("delayMonths"), 0));

	const regionTemplate = params.get("regionTemplate");
	regionTemplateInput.value = REGION_TEMPLATE_OPTIONS.includes(regionTemplate)
		? regionTemplate
		: "national-default";
	regionAdjustmentMonthsInput.value = String(toSafeNumber(params.get("regionAdjustmentMonths"), 0));
	document.getElementById("contributedMonths").value = String(
		toSafeNumber(params.get("contributedMonths"), 0)
	);

	applyRetirementAgePreset();
	applyRegionTemplatePreset();

	if (retirementProfileInput.value === "custom") {
		retirementAgeYearsInput.value = String(toSafeNumber(params.get("retirementAgeYears"), 60));
		retirementAgeMonthsInput.value = String(toSafeNumber(params.get("retirementAgeMonths"), 0));
	}

	if (regionTemplateInput.value === "custom") {
		minimumContributionMonthsInput.value = String(
			toSafeNumber(params.get("minimumContributionMonths"), 180)
		);
	}

	const asOf = params.get("asOf");
	if (asOf && parseDateString(asOf)) {
		currentAsOfDateString = asOf;
	}

	return true;
}

function formatDuration(months) {
	const safeMonths = Math.max(0, Math.floor(months));
	if (safeMonths < 12) {
		return t("unit.monthsOnly", { months: safeMonths });
	}

	const age = monthsToAge(safeMonths);
	if (age.months === 0) {
		return t("unit.yearsOnly", { years: age.years });
	}
	return t("unit.yearsMonths", { years: age.years, months: age.months });
}

function formatAgeAtDate(birthDate, targetDate) {
	if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
		return "-";
	}
	if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) {
		return "-";
	}

	let totalMonths =
		(targetDate.getFullYear() - birthDate.getFullYear()) * 12 +
		(targetDate.getMonth() - birthDate.getMonth());

	if (targetDate.getDate() < birthDate.getDate()) {
		totalMonths -= 1;
	}

	const age = monthsToAge(Math.max(0, totalMonths));
	return t("unit.age", { years: age.years, months: age.months });
}

function getProfileText(profile) {
	if (profile === "male") {
		return t("profile.male");
	}
	if (profile === "female-cadre") {
		return t("profile.female-cadre");
	}
	if (profile === "female-worker") {
		return t("profile.female-worker");
	}
	return t("profile.custom");
}

function getRegionTemplateText(regionTemplate) {
	if (regionTemplate === "national-default") {
		return t("region.national-default");
	}
	if (regionTemplate === "beijing") {
		return t("region.beijing");
	}
	if (regionTemplate === "shanghai") {
		return t("region.shanghai");
	}
	if (regionTemplate === "guangdong") {
		return t("region.guangdong");
	}
	return t("region.custom");
}

function openConfirmModal(message, options = {}) {
	const {
		title = t("modal.title"),
		okText = t("modal.confirm"),
		cancelText = t("modal.cancel"),
		showCancel = true,
		okIsDanger = false,
		initialFocus = modalDefaults.initialFocus,
		onConfirm = modalDefaults.onConfirm
	} = options;

	confirmAction = onConfirm;
	confirmModalTitle.textContent = title;
	confirmModalMessage.textContent = message;
	confirmOkButton.textContent = okText;
	confirmCancelButton.textContent = cancelText;
	confirmCancelButton.hidden = !showCancel;
	confirmOkButton.classList.toggle("danger", Boolean(okIsDanger));
	confirmModal.hidden = false;

	const shouldFocusCancel =
		showCancel &&
		initialFocus === "cancel" &&
		!confirmCancelButton.hidden;
	if (shouldFocusCancel) {
		confirmCancelButton.focus();
		return;
	}
	confirmOkButton.focus();
}

function closeConfirmModal() {
	confirmModal.hidden = true;
	confirmModalTitle.textContent = t("modal.title");
	confirmOkButton.textContent = t("modal.confirm");
	confirmCancelButton.textContent = t("modal.cancel");
	confirmCancelButton.hidden = false;
	confirmOkButton.classList.remove("danger");
	confirmAction = null;
}

function openNoticeModal(message, options = {}) {
	const { title = t("modal.noticeTitle"), okText = t("modal.noticeOk") } = options;
	openConfirmModal(message, {
		title,
		okText,
		showCancel: false,
		onConfirm: null
	});
}

function showFormNotice(message, duration = 1800) {
	if (!formNotice) {
		return;
	}
	if (formNoticeTimer) {
		clearTimeout(formNoticeTimer);
	}
	formNotice.textContent = message;
	formNotice.hidden = false;
	formNoticeTimer = window.setTimeout(() => {
		formNotice.hidden = true;
		formNotice.textContent = "";
	}, duration);
}

function applyRetirementAgePreset() {
	const profile = retirementProfileInput.value;
	const delayMonths = Number(delayMonthsInput.value);
	const birthDateValue = document.getElementById("birthDate").value;

	const isCustom = profile === "custom";
	retirementAgeYearsInput.readOnly = !isCustom;
	retirementAgeMonthsInput.readOnly = !isCustom;

	if (isCustom) {
		return;
	}

	let age;
	if (birthDateValue) {
		const birthDate = new Date(`${birthDateValue}T00:00:00`);
		const statutory = getStatutoryRetirementAgeByPolicy(profile, birthDate);
		age = monthsToAge(statutory.totalAgeMonths + Math.max(0, Math.floor(delayMonths)));
	} else {
		age = getRetirementAgeByProfile(profile, delayMonths);
	}
	retirementAgeYearsInput.value = String(age.years);
	retirementAgeMonthsInput.value = String(age.months);
}

function applyRegionTemplatePreset() {
	const regionTemplate = regionTemplateInput.value;
	const adjustmentMonths = Number(regionAdjustmentMonthsInput.value);

	const isCustom = regionTemplate === "custom";
	minimumContributionMonthsInput.readOnly = !isCustom;
	regionAdjustmentMonthsInput.readOnly = isCustom;

	if (isCustom) {
		return;
	}

	const minimumMonths = getMinimumContributionByRegion(regionTemplate, adjustmentMonths);
	minimumContributionMonthsInput.value = String(minimumMonths);
}

function readFormData() {
	const birthDateValue = document.getElementById("birthDate").value;
	const retirementAgeYears = Number(retirementAgeYearsInput.value);
	const retirementAgeMonths = Number(retirementAgeMonthsInput.value);
	const contributedMonths = Number(document.getElementById("contributedMonths").value);
	const minimumContributionMonths = Number(minimumContributionMonthsInput.value);

	if (!birthDateValue) {
		throw new Error(t("error.birthDateRequired"));
	}

	const asOfDate = parseDateString(currentAsOfDateString) || new Date();
	currentAsOfDateString = formatDate(asOfDate);

	return {
		birthDate: new Date(`${birthDateValue}T00:00:00`),
		retirementProfile: retirementProfileInput.value,
		delayMonths: Number(delayMonthsInput.value),
		regionTemplate: regionTemplateInput.value,
		regionAdjustmentMonths: Number(regionAdjustmentMonthsInput.value),
		retirementAgeYears,
		retirementAgeMonths,
		contributedMonths,
		minimumContributionMonths,
		currentDate: asOfDate
	};
}

function buildPlanWithPolicy(payload) {
	let policyRetirement = null;
	let policyMinimumContributionMonths = null;

	if (payload.retirementProfile !== "custom") {
		policyRetirement = getStatutoryRetirementAgeByPolicy(payload.retirementProfile, payload.birthDate);
		const personalDelayMonths = Math.max(0, Math.floor(payload.delayMonths));
		const finalRetirementAgeMonths = policyRetirement.totalAgeMonths + personalDelayMonths;
		const finalRetirementAge = monthsToAge(finalRetirementAgeMonths);
		payload.retirementAgeYears = finalRetirementAge.years;
		payload.retirementAgeMonths = finalRetirementAge.months;
	}

	// Need retirement date before finalizing minimum contribution rule for 2030+ ramp-up.
	const previewPlan = computeRetirementPlan(payload);
	policyMinimumContributionMonths = getNationalMinimumContributionMonthsByRetirementDate(
		previewPlan.retirementDate
	);

	// Preserve region template feature, but never below national policy floor.
	payload.minimumContributionMonths = Math.max(
		payload.minimumContributionMonths,
		policyMinimumContributionMonths
	);

	const plan = computeRetirementPlan(payload);
	return {
		plan,
		policyRetirement,
		policyMinimumContributionMonths
	};
}

function getResultText(payload, plan, policyRetirement, policyMinimumContributionMonths) {
	const delayedNote = plan.needsDelayedRetirementForContribution
		? t("result.delayedNote")
		: t("result.onTimeNote");
	const baseline = Number.isFinite(policyMinimumContributionMonths)
		? t("result.nationalBaseline", { duration: formatDuration(policyMinimumContributionMonths) })
		: "";
	const retirementAgeText = t("unit.age", {
		years: payload.retirementAgeYears,
		months: payload.retirementAgeMonths
	});
	const policyDelayText = policyRetirement
		? formatDuration(policyRetirement.policyDelayMonths)
		: t("profile.custom");
	const reachDateText = formatDate(plan.minimumContributionReachDate);
	const ageAtReachText = formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate);

	return [
		t("copyText.heading"),
		t("copyText.time", { time: formatNow() }),
		t("copyText.birthDate", { date: formatDate(payload.birthDate) }),
		t("copyText.profile", { profile: getProfileText(payload.retirementProfile) }),
		t("copyText.delay", { duration: formatDuration(payload.delayMonths) }),
		t("copyText.region", { region: getRegionTemplateText(payload.regionTemplate) }),
		t("copyText.adjustment", {
			duration: formatDuration(Math.abs(payload.regionAdjustmentMonths)),
			dir:
				payload.regionAdjustmentMonths < 0
					? t("copyText.adjustmentDecrease")
					: t("copyText.adjustmentIncrease")
		}),
		t("copyText.retirementAge", { age: retirementAgeText }),
		t("copyText.policyDelay", { delay: policyDelayText }),
		t("copyText.contributed", { duration: formatDuration(payload.contributedMonths) }),
		t("copyText.minContribution", {
			duration: formatDuration(payload.minimumContributionMonths),
			baseline
		}),
		t("copyText.retirementDate", { date: formatDate(plan.retirementDate) }),
		t("copyText.untilAge", { duration: formatDuration(plan.monthsUntilAge) }),
		t("copyText.untilMin", { duration: formatDuration(plan.monthsToMinContribution) }),
		t("copyText.reachDate", { date: reachDateText, age: ageAtReachText }),
		t("copyText.remaining", { duration: formatDuration(plan.monthsUntilEligible) }),
		t("copyText.projected", { duration: formatDuration(plan.projectedContributionMonths) }),
		delayedNote,
		t("result.aiDisclaimer"),
		"",
		t("copyText.stepsTitle"),
		t("copyText.step1", { age: retirementAgeText }),
		t("copyText.step2", { date: formatDate(plan.retirementDate) }),
		t("copyText.step3", {
			baseline,
			minContribution: formatDuration(payload.minimumContributionMonths)
		}),
		t("copyText.step4", {
			untilAge: formatDuration(plan.monthsUntilAge),
			untilMin: formatDuration(plan.monthsToMinContribution),
			reachDate: reachDateText,
			ageAtReach: ageAtReachText
		}),
		t("copyText.step5", { remaining: formatDuration(plan.monthsUntilEligible) })
	].join("\n");
}

function readHistory() {
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
}

function saveHistory(historyItems) {
	localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems.slice(0, HISTORY_LIMIT)));
}

function renderHistory() {
	const items = readHistory();
	if (items.length === 0) {
		historyList.innerHTML = `<li class="history-item"><p>${t("history.empty")}</p></li>`;
		return;
	}

	historyList.innerHTML = items
		.map((item, index) => {
			const profileText = item.retirementProfile
				? getProfileText(item.retirementProfile)
				: item.profileText;
			const summary = t("history.itemSummary", {
				time: item.time,
				profile: profileText,
				remaining: formatDuration(item.monthsUntilEligible)
			});
			return `
				<li class="history-item">
					<p>${summary}</p>
					<div class="history-actions">
						<button type="button" class="secondary" data-action="restore" data-index="${index}">${t("history.restore")}</button>
						<button type="button" class="secondary danger" data-action="delete" data-index="${index}">${t("history.delete")}</button>
					</div>
				</li>
			`;
		})
		.join("");
}

function pushHistory(payload, plan) {
	const items = readHistory();
	items.unshift({
		time: formatNow(),
		profileText: getProfileText(payload.retirementProfile),
		birthDate: formatDate(payload.birthDate),
		retirementProfile: payload.retirementProfile,
		delayMonths: payload.delayMonths,
		regionTemplate: payload.regionTemplate,
		regionAdjustmentMonths: payload.regionAdjustmentMonths,
		retirementAgeYears: payload.retirementAgeYears,
		retirementAgeMonths: payload.retirementAgeMonths,
		contributedMonths: payload.contributedMonths,
		minimumContributionMonths: payload.minimumContributionMonths,
		monthsUntilEligible: plan.monthsUntilEligible
	});
	saveHistory(items);
	renderHistory();
}

function renderSteps(payload, plan, policyRetirement, policyMinimumContributionMonths) {
	if (!stepsList) {
		return;
	}

	const policyRetireAgeText = t("unit.age", {
		years: payload.retirementAgeYears,
		months: payload.retirementAgeMonths
	});
	const policyDelayText = policyRetirement
		? formatDuration(policyRetirement.policyDelayMonths)
		: t("profile.custom");
	const baseline = Number.isFinite(policyMinimumContributionMonths)
		? t("result.nationalBaseline", { duration: formatDuration(policyMinimumContributionMonths) })
		: "";

	stepsList.innerHTML = `
		<li>${t("steps.1", { age: policyRetireAgeText, delay: policyDelayText })}</li>
		<li>${t("steps.2", { date: formatDate(plan.retirementDate) })}</li>
		<li>${t("steps.3", { minContribution: formatDuration(payload.minimumContributionMonths), baseline })}</li>
		<li>${t("steps.4", {
			untilAge: formatDuration(plan.monthsUntilAge),
			untilMin: formatDuration(plan.monthsToMinContribution),
			reachDate: formatDate(plan.minimumContributionReachDate),
			ageAtReach: formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate)
		})}</li>
		<li>${t("steps.5", { remaining: formatDuration(plan.monthsUntilEligible) })}</li>
	`;
}

function renderResult(payload, plan, policyRetirement, policyMinimumContributionMonths, shouldFocus = true) {
	lastRenderedState = { payload, plan, policyRetirement, policyMinimumContributionMonths };
	resultBox.hidden = false;
	const asOfDateText = currentAsOfDateString || formatDate(new Date());
	resultTitle.textContent = t("result.titleAsOf", { date: asOfDateText });
	shareHeadline.textContent = t("result.shareHeadline", {
		birthDate: formatDate(payload.birthDate),
		retirementDate: formatDate(plan.retirementDate),
		remaining: formatDuration(plan.monthsUntilEligible)
	});
	shareSubtitle.textContent = t("result.shareSubtitle", {
		profile: getProfileText(payload.retirementProfile),
		region: getRegionTemplateText(payload.regionTemplate),
		minContribution: formatDuration(payload.minimumContributionMonths)
	});
	shareGeneratedAt.textContent = t("result.generatedAt", { time: formatNow() });

	const delayedNote = plan.needsDelayedRetirementForContribution
		? t("result.delayedNote")
		: t("result.onTimeNote");
	const baseline = Number.isFinite(policyMinimumContributionMonths)
		? t("result.nationalBaseline", { duration: formatDuration(policyMinimumContributionMonths) })
		: "";

	detailsList.innerHTML = `
		<li>${t("result.detail.birthDate")}<strong>${formatDate(payload.birthDate)}</strong></li>
		<li>${t("result.detail.retirementDate")}<strong>${formatDate(plan.retirementDate)}</strong></li>
		<li>${t("result.detail.profile")}<strong>${getProfileText(payload.retirementProfile)}</strong>${t("result.detail.personalDelay", { duration: formatDuration(payload.delayMonths) })}</li>
		<li>${t("result.detail.regionTemplate")}<strong>${getRegionTemplateText(payload.regionTemplate)}</strong>${t("result.detail.regionAdjustment", { months: payload.regionAdjustmentMonths })}</li>
		<li>${t("result.detail.minRequirement")}<strong>${formatDuration(payload.minimumContributionMonths)}</strong>${baseline}</li>
		<li>${t("result.detail.monthsUntilAge")}<strong>${formatDuration(plan.monthsUntilAge)}</strong></li>
		<li>${t("result.detail.monthsToMin")}<strong>${formatDuration(plan.monthsToMinContribution)}</strong></li>
		<li>${t("result.detail.reachDate")}<strong>${formatDate(plan.minimumContributionReachDate)}</strong>${t("result.detail.ageAtReach", { age: formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate) })}</li>
		<li>${t("result.detail.remaining")}<strong>${formatDuration(plan.monthsUntilEligible)}</strong></li>
		<li>${t("result.detail.projected")}<strong>${formatDuration(plan.projectedContributionMonths)}</strong></li>
		<li>${delayedNote}</li>
	`;

	renderSteps(payload, plan, policyRetirement, policyMinimumContributionMonths);
	currentResultText = getResultText(payload, plan, policyRetirement, policyMinimumContributionMonths);
	// Move focus to result heading for keyboard and screen-reader users after calculation.
	if (shouldFocus && resultTitle) {
		resultTitle.focus();
	}
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	try {
		if (!currentAsOfDateString) {
			currentAsOfDateString = formatDate(new Date());
		}
		const payload = readFormData();
		const { plan, policyRetirement, policyMinimumContributionMonths } =
			buildPlanWithPolicy(payload);
		renderResult(payload, plan, policyRetirement, policyMinimumContributionMonths);
		pushHistory(payload, plan);
		updateUrlWithCurrentInputs();
	} catch (error) {
		resultBox.hidden = false;
		detailsList.innerHTML = `<li class="error">${error.message}</li>`;
	}
});

form.addEventListener("reset", () => {
	// Wait for native form reset to restore default values before syncing dependent fields.
	window.setTimeout(() => {
		currentAsOfDateString = "";
		currentResultText = "";
		lastRenderedState = null;
		resultBox.hidden = true;
		detailsList.innerHTML = "";
		stepsList.innerHTML = "";
		shareHeadline.textContent = "";
		shareSubtitle.textContent = "";
		shareGeneratedAt.textContent = "";
		window.history.replaceState({}, "", window.location.pathname);
		applyRetirementAgePreset();
		applyRegionTemplatePreset();
		showFormNotice(t("form.resetNotice"));
	});
});

retirementProfileInput.addEventListener("change", applyRetirementAgePreset);
delayMonthsInput.addEventListener("input", applyRetirementAgePreset);
document.getElementById("birthDate").addEventListener("change", applyRetirementAgePreset);
regionTemplateInput.addEventListener("change", applyRegionTemplatePreset);
regionAdjustmentMonthsInput.addEventListener("input", applyRegionTemplatePreset);

copyButton.addEventListener("click", async () => {
	if (!currentResultText) {
		detailsList.innerHTML = `<li class="error">${t("error.calculateFirst")}</li>`;
		resultBox.hidden = false;
		return;
	}

	try {
		await navigator.clipboard.writeText(currentResultText);
		openNoticeModal(t("modal.copyResultSuccess"), { title: t("modal.copySuccessTitle") });
	} catch (error) {
		openNoticeModal(t("modal.copyResultFail"), { title: t("modal.copyFailTitle") });
	}
});

copyShareLinkButton.addEventListener("click", async () => {
	if (!currentAsOfDateString) {
		currentAsOfDateString = formatDate(new Date());
	}
	updateUrlWithCurrentInputs();

	try {
		await navigator.clipboard.writeText(window.location.href);
		openNoticeModal(t("modal.copyLinkSuccess"), {
			title: t("modal.copySuccessTitle")
		});
	} catch (error) {
		openNoticeModal(t("modal.copyLinkFail"), { title: t("modal.copyFailTitle") });
	}
});

downloadButton.addEventListener("click", async () => {
	if (resultBox.hidden) {
		detailsList.innerHTML = `<li class="error">${t("error.calculateFirst")}</li>`;
		resultBox.hidden = false;
		return;
	}

	if (typeof window.html2canvas !== "function") {
		openNoticeModal(t("modal.screenshotUnavailable"), { title: t("modal.screenshotFailTitle") });
		return;
	}

	const actionsBar = resultBox.querySelector(".actions");
	const originalDisplay = actionsBar ? actionsBar.style.display : null;
	if (actionsBar) {
		actionsBar.style.display = "none";
	}

	try {
		const canvas = await window.html2canvas(resultBox, {
			backgroundColor: "#ffffff",
			scale: Math.min(2, window.devicePixelRatio || 1)
		});
		const link = document.createElement("a");
		link.download = `retirement-result-${Date.now()}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	} finally {
		if (actionsBar) {
			actionsBar.style.display = originalDisplay;
		}
	}
});

historyList.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof HTMLButtonElement)) {
		return;
	}

	const index = Number(target.dataset.index);
	const action = target.dataset.action;
	if (!Number.isInteger(index) || index < 0) {
		return;
	}

	const items = readHistory();
	if (action === "delete") {
		openConfirmModal(t("modal.deleteOne"), {
			title: t("modal.title"),
			okText: t("modal.confirmDelete"),
			showCancel: true,
			okIsDanger: true,
			initialFocus: "cancel",
			onConfirm: () => {
				items.splice(index, 1);
				saveHistory(items);
				renderHistory();
			}
		});
		return;
	}

	const item = items[index];
	if (!item) {
		return;
	}

	document.getElementById("birthDate").value = item.birthDate;
	retirementProfileInput.value = item.retirementProfile;
	delayMonthsInput.value = String(item.delayMonths);
	applyRetirementAgePreset();
	regionTemplateInput.value = item.regionTemplate || "custom";
	regionAdjustmentMonthsInput.value = String(item.regionAdjustmentMonths || 0);
	applyRegionTemplatePreset();
	retirementAgeYearsInput.value = String(item.retirementAgeYears);
	retirementAgeMonthsInput.value = String(item.retirementAgeMonths);
	document.getElementById("contributedMonths").value = String(item.contributedMonths);
	minimumContributionMonthsInput.value = String(item.minimumContributionMonths);
	currentAsOfDateString = formatDate(new Date());

	form.requestSubmit();
});

clearHistoryButton.addEventListener("click", () => {
	openConfirmModal(t("modal.clearAll"), {
		title: t("modal.title"),
		okText: t("modal.confirmDelete"),
		showCancel: true,
		okIsDanger: true,
		initialFocus: "cancel",
		onConfirm: () => {
			localStorage.removeItem(HISTORY_KEY);
			renderHistory();
		}
	});
});

confirmCancelButton.addEventListener("click", closeConfirmModal);

confirmOkButton.addEventListener("click", () => {
	if (typeof confirmAction === "function") {
		confirmAction();
	}
	closeConfirmModal();
});

confirmModal.addEventListener("click", (event) => {
	const target = event.target;
	if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
		closeConfirmModal();
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && !confirmModal.hidden) {
		closeConfirmModal();
	}
});

function refreshLocalizedUi() {
	applyStaticTranslations();
	applyComplianceCopy();
	renderHistory();
	if (lastRenderedState && !resultBox.hidden) {
		renderResult(
			lastRenderedState.payload,
			lastRenderedState.plan,
			lastRenderedState.policyRetirement,
			lastRenderedState.policyMinimumContributionMonths,
			false
		);
	}
}

if (localeSelect) {
	localeSelect.addEventListener("change", () => {
		setLocale(localeSelect.value);
		refreshLocalizedUi();
		if (document.getElementById("birthDate").value) {
			updateUrlWithCurrentInputs();
		}
	});
}

applyRetirementAgePreset();
applyRegionTemplatePreset();
refreshLocalizedUi();

if (applyInputsFromUrlIfPresent()) {
	form.requestSubmit();
}
