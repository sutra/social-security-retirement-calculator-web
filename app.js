import {
	computeRetirementPlan,
	getMinimumContributionByRegion,
	getNationalMinimumContributionMonthsByRetirementDate,
	getRetirementAgeByProfile,
	getStatutoryRetirementAgeByPolicy,
	monthsToAge
} from "./calculator.js";

const form = document.getElementById("calculator-form");
const resultBox = document.getElementById("result");
const detailsList = document.getElementById("details");
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

let currentResultText = "";
let currentAsOfDateString = "";

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
		return `${safeMonths} 个月`;
	}

	const age = monthsToAge(safeMonths);
	if (age.months === 0) {
		return `${age.years} 年`;
	}
	return `${age.years} 年 ${age.months} 个月`;
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
	return `${age.years} 岁 ${age.months} 个月`;
}

function getProfileText(profile) {
	if (profile === "male") {
		return "男职工";
	}
	if (profile === "female-cadre") {
		return "女干部";
	}
	if (profile === "female-worker") {
		return "女工人";
	}
	return "自定义";
}

function getRegionTemplateText(regionTemplate) {
	if (regionTemplate === "national-default") {
		return "全国常见基线";
	}
	if (regionTemplate === "beijing") {
		return "北京模板";
	}
	if (regionTemplate === "shanghai") {
		return "上海模板";
	}
	if (regionTemplate === "guangdong") {
		return "广东模板";
	}
	return "自定义";
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
		throw new Error("请选择出生日期");
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
		? "达到法定退休年龄时缴费月数不足，需要继续缴纳后再退休。"
		: "达到法定退休年龄时，缴费月数预计已满足最低要求。";
	return [
		"社保退休缴费月数计算结果",
		`计算时间：${formatNow()}`,
		`出生日期：${formatDate(payload.birthDate)}`,
		`退休规则：${getProfileText(payload.retirementProfile)}`,
		`弹性延迟退休：${formatDuration(payload.delayMonths)}`,
		`地区模板：${getRegionTemplateText(payload.regionTemplate)}`,
		`地方调整：${formatDuration(Math.abs(payload.regionAdjustmentMonths))}${payload.regionAdjustmentMonths < 0 ? "（减少）" : "（增加）"}`,
		`退休年龄：${payload.retirementAgeYears} 岁 ${payload.retirementAgeMonths} 个月`,
		policyRetirement
			? `政策顺延：${formatDuration(policyRetirement.policyDelayMonths)}`
			: "政策顺延：自定义",
		`已累计缴费：${formatDuration(payload.contributedMonths)}`,
		`最低缴费要求：${formatDuration(payload.minimumContributionMonths)}${Number.isFinite(policyMinimumContributionMonths) ? `（国家基线 ${formatDuration(policyMinimumContributionMonths)}）` : ""}`,
		`预计达到法定退休年龄日期：${formatDate(plan.retirementDate)}`,
		`距离法定退休年龄：${formatDuration(plan.monthsUntilAge)}`,
		`距离最低缴费月数：${formatDuration(plan.monthsToMinContribution)}`,
		`按连续缴纳预计满足最低缴费日期：${formatDate(plan.minimumContributionReachDate)}（当时年龄：${formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate)}）`,
		`还需继续缴纳社保：${formatDuration(plan.monthsUntilEligible)}`,
		`届时累计缴费月数：${formatDuration(plan.projectedContributionMonths)}`,
		delayedNote,
		"",
		"计算步骤：",
		`1) 按人员类型与出生年月确定政策退休年龄（含政策顺延）并叠加个人延迟月数，得到 ${payload.retirementAgeYears} 岁 ${payload.retirementAgeMonths} 个月。`,
		`2) 用出生日期推算退休日期：${formatDate(plan.retirementDate)}。`,
		`3) 按退休年份计算国家最低缴费要求${Number.isFinite(policyMinimumContributionMonths) ? `（国家基线 ${formatDuration(policyMinimumContributionMonths)}）` : ""}，并与地区模板配置取较高值，得到 ${formatDuration(payload.minimumContributionMonths)}。`,
		`4) 计算 A=距退休年龄 ${formatDuration(plan.monthsUntilAge)}，B=距最低缴费 ${formatDuration(plan.monthsToMinContribution)}，按连续缴纳推算到达日期为 ${formatDate(plan.minimumContributionReachDate)}（当时年龄 ${formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate)}）。`,
		`5) 取 max(A, B) = ${formatDuration(plan.monthsUntilEligible)}。`
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
		historyList.innerHTML = "<li class=\"history-item\"><p>暂无记录</p></li>";
		return;
	}

	historyList.innerHTML = items
		.map((item, index) => {
			return `
				<li class="history-item">
					<p>${item.time} | ${item.profileText} | 还需 ${formatDuration(item.monthsUntilEligible)}</p>
					<div class="history-actions">
						<button type="button" class="secondary" data-action="restore" data-index="${index}">恢复这条输入</button>
						<button type="button" class="secondary" data-action="delete" data-index="${index}">删除</button>
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

	const policyRetireAgeText = `${payload.retirementAgeYears} 岁 ${payload.retirementAgeMonths} 个月`;
	const policyDelayText = policyRetirement
		? formatDuration(policyRetirement.policyDelayMonths)
		: "自定义";

	stepsList.innerHTML = `
		<li>第 1 步：按最新退休政策与人员类型确定基础退休年龄，并计算政策顺延（月）。本次为 <strong>${policyRetireAgeText}</strong>（政策顺延：${policyDelayText}）。</li>
		<li>第 2 步：根据出生日期 + 退休年龄，得到预计退休日期：<strong>${formatDate(plan.retirementDate)}</strong>。</li>
		<li>第 3 步：按退休年份套用最低缴费年限规则（2030 年起每年 +6 个月，最高 20 年），并与地区模板值取较高值。本次最低要求：<strong>${formatDuration(payload.minimumContributionMonths)}</strong>${Number.isFinite(policyMinimumContributionMonths) ? `（国家基线 ${formatDuration(policyMinimumContributionMonths)}）` : ""}。</li>
		<li>第 4 步：计算两个等待量：A=距退休年龄 <strong>${formatDuration(plan.monthsUntilAge)}</strong>，B=缴费差额 <strong>${formatDuration(plan.monthsToMinContribution)}</strong>，并按连续缴纳推算满足最低缴费日期为 <strong>${formatDate(plan.minimumContributionReachDate)}</strong>（当时年龄 <strong>${formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate)}</strong>）。</li>
		<li>第 5 步：取 max(A, B)，得到还需继续缴纳社保：<strong>${formatDuration(plan.monthsUntilEligible)}</strong>。</li>
	`;
}

function renderResult(payload, plan, policyRetirement, policyMinimumContributionMonths) {
	resultBox.hidden = false;

	const delayedNote = plan.needsDelayedRetirementForContribution
		? "达到法定退休年龄时缴费月数不足，需要继续缴纳后再退休。"
		: "达到法定退休年龄时，缴费月数预计已满足最低要求。";

	detailsList.innerHTML = `
		<li>预计达到法定退休年龄日期：<strong>${formatDate(plan.retirementDate)}</strong></li>
		<li>退休规则：<strong>${getProfileText(payload.retirementProfile)}</strong>（个人延迟 ${formatDuration(payload.delayMonths)}）</li>
		<li>地区模板：<strong>${getRegionTemplateText(payload.regionTemplate)}</strong>（调整 ${payload.regionAdjustmentMonths} 个月）</li>
		<li>政策最低缴费要求：<strong>${formatDuration(payload.minimumContributionMonths)}</strong>${Number.isFinite(policyMinimumContributionMonths) ? `（国家基线 ${formatDuration(policyMinimumContributionMonths)}）` : ""}</li>
		<li>距离法定退休年龄：<strong>${formatDuration(plan.monthsUntilAge)}</strong></li>
		<li>距离最低缴费月数：<strong>${formatDuration(plan.monthsToMinContribution)}</strong></li>
		<li>按连续缴纳预计满足最低缴费日期：<strong>${formatDate(plan.minimumContributionReachDate)}</strong>（当时年龄：<strong>${formatAgeAtDate(payload.birthDate, plan.minimumContributionReachDate)}</strong>）</li>
		<li>还需继续缴纳社保：<strong>${formatDuration(plan.monthsUntilEligible)}</strong></li>
		<li>届时累计缴费月数：<strong>${formatDuration(plan.projectedContributionMonths)}</strong></li>
		<li>${delayedNote}</li>
	`;

	renderSteps(payload, plan, policyRetirement, policyMinimumContributionMonths);
	currentResultText = getResultText(payload, plan, policyRetirement, policyMinimumContributionMonths);
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

retirementProfileInput.addEventListener("change", applyRetirementAgePreset);
delayMonthsInput.addEventListener("input", applyRetirementAgePreset);
document.getElementById("birthDate").addEventListener("change", applyRetirementAgePreset);
regionTemplateInput.addEventListener("change", applyRegionTemplatePreset);
regionAdjustmentMonthsInput.addEventListener("input", applyRegionTemplatePreset);

copyButton.addEventListener("click", async () => {
	if (!currentResultText) {
		detailsList.innerHTML = "<li class=\"error\">请先完成一次计算。</li>";
		resultBox.hidden = false;
		return;
	}

	try {
		await navigator.clipboard.writeText(currentResultText);
		alert("结果已复制到剪贴板。");
	} catch (error) {
		alert("复制失败，请检查浏览器权限。");
	}
});

copyShareLinkButton.addEventListener("click", async () => {
	if (!currentAsOfDateString) {
		currentAsOfDateString = formatDate(new Date());
	}
	updateUrlWithCurrentInputs();

	try {
		await navigator.clipboard.writeText(window.location.href);
		alert("分享链接已复制。对方打开后可直接看到输入参数与计算结果。");
	} catch (error) {
		alert("复制分享链接失败，请检查浏览器权限。");
	}
});

downloadButton.addEventListener("click", async () => {
	if (resultBox.hidden) {
		detailsList.innerHTML = "<li class=\"error\">请先完成一次计算。</li>";
		resultBox.hidden = false;
		return;
	}

	if (typeof window.html2canvas !== "function") {
		alert("截图组件未加载，请刷新页面后重试。");
		return;
	}

	const canvas = await window.html2canvas(resultBox, {
		backgroundColor: "#ffffff",
		scale: Math.min(2, window.devicePixelRatio || 1)
	});
	const link = document.createElement("a");
	link.download = `retirement-result-${Date.now()}.png`;
	link.href = canvas.toDataURL("image/png");
	link.click();
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
		items.splice(index, 1);
		saveHistory(items);
		renderHistory();
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
	localStorage.removeItem(HISTORY_KEY);
	renderHistory();
});

applyRetirementAgePreset();
applyRegionTemplatePreset();
renderHistory();

if (applyInputsFromUrlIfPresent()) {
	form.requestSubmit();
}
