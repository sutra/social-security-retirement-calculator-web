const LOCALE_STORAGE_KEY = "retirement-calculator-locale-v1";
export const SUPPORTED_LOCALES = ["zh-CN", "en"];
export const DEFAULT_LOCALE = "zh-CN";

const TRANSLATIONS = {
	"zh-CN": {
		"doc.title": "社保退休缴费月数计算器 | 估算还需缴纳多少个月",
		"app.title": "社保退休缴费月数计算器",
		"app.languageLabel": "语言",
		"app.intro": "输入出生日期、退休规则和已缴费月数，快速估算还需继续缴纳多少个月社保才能退休。",
		"app.aiBadge": "AI 辅助",
		"app.aiNoticeText":
			"本页面功能、交互与文案由 AI 辅助生成与整理，内容仅供参考，不构成法律、政策或办事建议。涉及社保办理与个人决策，请以国家及地方主管部门最新正式文件和窗口答复为准，并进行人工复核。",
		"app.aiUpdated": "声明更新：{date}",

		"form.retirementProfile": "退休规则预设",
		"form.delayMonths": "延迟退休（月）",
		"form.birthDate": "出生日期",
		"form.retirementAgeYears": "法定退休年龄（岁）",
		"form.retirementAgeMonths": "退休年龄（额外月）",
		"form.contributedMonths": "累计缴费月数",
		"form.regionTemplate": "地区模板",
		"form.regionAdjustmentMonths": "地方调整（月，可正可负）",
		"form.minimumContributionMonths": "退休最低缴费要求（月）",
		"form.submit": "开始计算",
		"form.reset": "重置表单",
		"form.resetNotice": "已重置",

		"profile.maleOption": "男职工（60岁）",
		"profile.femaleCadreOption": "女干部（55岁）",
		"profile.femaleWorkerOption": "女工人（50岁）",
		"profile.customOption": "自定义年龄",
		"profile.male": "男职工",
		"profile.female-cadre": "女干部",
		"profile.female-worker": "女工人",
		"profile.custom": "自定义",

		"region.nationalDefaultOption": "全国常见基线（180）",
		"region.beijingOption": "北京模板（180）",
		"region.shanghaiOption": "上海模板（180）",
		"region.guangdongOption": "广东模板（180）",
		"region.customOption": "自定义最低缴费月数",
		"region.national-default": "全国常见基线",
		"region.beijing": "北京模板",
		"region.shanghai": "上海模板",
		"region.guangdong": "广东模板",
		"region.custom": "自定义",

		"result.title": "计算结果",
		"result.titleAsOf": "社保退休测算结果（截至 {date}）",
		"result.shareHeadline":
			"出生日期：{birthDate} | 预计退休日期：{retirementDate} | 还需继续缴纳：{remaining}",
		"result.shareSubtitle":
			"退休规则：{profile} | 地区模板：{region} | 最低缴费要求：{minContribution}",
		"result.generatedAt": "生成时间：{time}",
		"result.shareDisclaimer":
			"说明：本结果基于用户输入参数进行估算，仅供参考，请以当地社保部门政策口径为准。",
		"result.aiDisclaimer":
			"AI 声明：本计算结果与下载截图由 AI 辅助生成，仅供参考，不构成法律、政策或办事建议。用于办理或决策前请人工复核，并以官方口径为准。",
		"result.stepsHeading": "计算步骤",
		"result.copy": "复制结果",
		"result.copyLink": "复制分享链接",
		"result.download": "下载结果截图",
		"result.delayedNote": "达到法定退休年龄时缴费月数不足，需要继续缴纳后再退休。",
		"result.onTimeNote": "达到法定退休年龄时，缴费月数预计已满足最低要求。",
		"result.nationalBaseline": "（国家基线 {duration}）",

		"result.detail.birthDate": "出生日期：",
		"result.detail.retirementDate": "预计达到法定退休年龄日期：",
		"result.detail.profile": "退休规则：",
		"result.detail.personalDelay": "（个人延迟 {duration}）",
		"result.detail.regionTemplate": "地区模板：",
		"result.detail.regionAdjustment": "（调整 {months} 个月）",
		"result.detail.minRequirement": "政策最低缴费要求：",
		"result.detail.monthsUntilAge": "距离法定退休年龄：",
		"result.detail.monthsToMin": "距离最低缴费月数：",
		"result.detail.reachDate": "按连续缴纳预计满足最低缴费日期：",
		"result.detail.ageAtReach": "（当时年龄：{age}）",
		"result.detail.remaining": "还需继续缴纳社保：",
		"result.detail.projected": "届时累计缴费月数：",

		"steps.1":
			"第 1 步：按最新退休政策与人员类型确定基础退休年龄，并计算政策顺延（月）。本次为 <strong>{age}</strong>（政策顺延：{delay}）。",
		"steps.2":
			"第 2 步：根据出生日期 + 退休年龄，得到预计退休日期：<strong>{date}</strong>。",
		"steps.3":
			"第 3 步：按退休年份套用最低缴费年限规则（2030 年起每年 +6 个月，最高 20 年），并与地区模板值取较高值。本次最低要求：<strong>{minContribution}</strong>{baseline}。",
		"steps.4":
			"第 4 步：计算两个等待量：A=距退休年龄 <strong>{untilAge}</strong>，B=缴费差额 <strong>{untilMin}</strong>，并按连续缴纳推算满足最低缴费日期为 <strong>{reachDate}</strong>（当时年龄 <strong>{ageAtReach}</strong>）。",
		"steps.5":
			"第 5 步：取 max(A, B)，得到还需继续缴纳社保：<strong>{remaining}</strong>。",

		"copyText.heading": "社保退休缴费月数计算结果",
		"copyText.time": "计算时间：{time}",
		"copyText.birthDate": "出生日期：{date}",
		"copyText.profile": "退休规则：{profile}",
		"copyText.delay": "弹性延迟退休：{duration}",
		"copyText.region": "地区模板：{region}",
		"copyText.adjustment": "地方调整：{duration}{dir}",
		"copyText.adjustmentDecrease": "（减少）",
		"copyText.adjustmentIncrease": "（增加）",
		"copyText.retirementAge": "退休年龄：{age}",
		"copyText.policyDelay": "政策顺延：{delay}",
		"copyText.contributed": "已累计缴费：{duration}",
		"copyText.minContribution": "最低缴费要求：{duration}{baseline}",
		"copyText.retirementDate": "预计达到法定退休年龄日期：{date}",
		"copyText.untilAge": "距离法定退休年龄：{duration}",
		"copyText.untilMin": "距离最低缴费月数：{duration}",
		"copyText.reachDate": "按连续缴纳预计满足最低缴费日期：{date}（当时年龄：{age}）",
		"copyText.remaining": "还需继续缴纳社保：{duration}",
		"copyText.projected": "届时累计缴费月数：{duration}",
		"copyText.stepsTitle": "计算步骤：",
		"copyText.step1":
			"1) 按人员类型与出生年月确定政策退休年龄（含政策顺延）并叠加个人延迟月数，得到 {age}。",
		"copyText.step2": "2) 用出生日期推算退休日期：{date}。",
		"copyText.step3":
			"3) 按退休年份计算国家最低缴费要求{baseline}，并与地区模板配置取较高值，得到 {minContribution}。",
		"copyText.step4":
			"4) 计算 A=距退休年龄 {untilAge}，B=距最低缴费 {untilMin}，按连续缴纳推算到达日期为 {reachDate}（当时年龄 {ageAtReach}）。",
		"copyText.step5": "5) 取 max(A, B) = {remaining}。",

		"history.title": "历史记录",
		"history.clear": "清空历史",
		"history.empty": "暂无记录",
		"history.itemSummary": "{time} | {profile} | 还需 {remaining}",
		"history.restore": "恢复这条输入",
		"history.delete": "删除",

		"policy.title": "中国社保政策变化（养老相关）",
		"policy.aiBadge": "AI整理内容",
		"policy.aiNoticeText": "本区为 AI 基于公开资料自动整理，已做显式标识，请以官方原文核验后使用。",
		"policy.aiUpdated": "整理日期：{date}",
		"policy.meta": "里程碑时间线（简版）：聚焦每一轮政策的核心变化与制度意义。",
		"policy.tag.guofa": "国发",
		"policy.legend.guofa": "国务院文件",
		"policy.tag.guobanfa": "国办发",
		"policy.legend.guobanfa": "国务院办公厅文件",
		"policy.tag.ministry": "部门规章",
		"policy.legend.ministry": "部委规范文件",
		"policy.tag.plan": "改革方案",
		"policy.legend.plan": "改革配套方案",
		"policy.tag.decision": "决定类",
		"policy.legend.decision": "全国人大常委会决定",
		"policy.tag.pilot": "试点",
		"policy.legend.pilot": "先行先试安排",
		"policy.disclaimer":
			"本时间线由 AI 基于公开信息自动整理，仅用于政策脉络理解，不构成法律、政策或办事建议。请在发布或决策使用前进行人工复核。具体适用条件、执行口径和地方细则，请以国家及地方人社、医保、税务等部门最新正式文件为准。",

		"modal.title": "确认操作",
		"modal.defaultMessage": "确定执行该操作吗？",
		"modal.cancel": "取消",
		"modal.confirm": "确认",
		"modal.confirmDelete": "确认删除",
		"modal.noticeTitle": "提示",
		"modal.noticeOk": "知道了",
		"modal.deleteOne": "确定删除这条历史记录吗？",
		"modal.clearAll": "确定要清空所有历史记录吗？此操作无法撤销。",
		"modal.copySuccessTitle": "复制成功",
		"modal.copyFailTitle": "复制失败",
		"modal.copyResultSuccess": "结果已复制到剪贴板。",
		"modal.copyResultFail": "复制失败，请检查浏览器权限。",
		"modal.copyLinkSuccess": "分享链接已复制。对方打开后可直接看到输入参数与计算结果。",
		"modal.copyLinkFail": "复制分享链接失败，请检查浏览器权限。",
		"modal.screenshotFailTitle": "截图失败",
		"modal.screenshotUnavailable": "截图组件未加载，请刷新页面后重试。",

		"error.birthDateRequired": "请选择出生日期",
		"error.calculateFirst": "请先完成一次计算。",

		"unit.monthsOnly": "{months} 个月",
		"unit.yearsOnly": "{years} 年",
		"unit.yearsMonths": "{years} 年 {months} 个月",
		"unit.age": "{years} 岁 {months} 个月",

		"footer.ai": "AI 辅助估算",
		"footer.reference": "仅供参考",
		"footer.official": "以官方政策为准",
		"footer.disclaimer":
			"具体事项请以当地社保部门发布的正式文件为准，不构成法律、政策或办事建议。"
	},
	en: {
		"doc.title": "Social Security Retirement Contribution Calculator",
		"app.title": "Social Security Retirement Contribution Calculator",
		"app.languageLabel": "Language",
		"app.intro":
			"Enter your birth date, retirement rule, and contributed months to estimate how many more months of social security contributions are needed before retirement.",
		"app.aiBadge": "AI Assisted",
		"app.aiNoticeText":
			"Features, interactions, and copy on this page are AI-assisted for reference only and do not constitute legal, policy, or administrative advice. Please verify against official national and local regulations.",
		"app.aiUpdated": "Updated: {date}",

		"form.retirementProfile": "Retirement Rule Preset",
		"form.delayMonths": "Flexible Delay (Months)",
		"form.birthDate": "Birth Date",
		"form.retirementAgeYears": "Statutory Retirement Age (Years)",
		"form.retirementAgeMonths": "Retirement Age (Extra Months)",
		"form.contributedMonths": "Accumulated Contribution (Months)",
		"form.regionTemplate": "Region Template",
		"form.regionAdjustmentMonths": "Local Adjustment (Months, +/-)",
		"form.minimumContributionMonths": "Minimum Required Contribution (Months)",
		"form.submit": "Calculate",
		"form.reset": "Reset Form",
		"form.resetNotice": "Form reset",

		"profile.maleOption": "Male Employee (Age 60)",
		"profile.femaleCadreOption": "Female Cadre (Age 55)",
		"profile.femaleWorkerOption": "Female Worker (Age 50)",
		"profile.customOption": "Custom Age",
		"profile.male": "Male Employee",
		"profile.female-cadre": "Female Cadre",
		"profile.female-worker": "Female Worker",
		"profile.custom": "Custom",

		"region.nationalDefaultOption": "National Baseline (180)",
		"region.beijingOption": "Beijing Template (180)",
		"region.shanghaiOption": "Shanghai Template (180)",
		"region.guangdongOption": "Guangdong Template (180)",
		"region.customOption": "Custom Minimum Months",
		"region.national-default": "National Baseline",
		"region.beijing": "Beijing Template",
		"region.shanghai": "Shanghai Template",
		"region.guangdong": "Guangdong Template",
		"region.custom": "Custom",

		"result.title": "Calculation Result",
		"result.titleAsOf": "Retirement Contribution Estimate (As of {date})",
		"result.shareHeadline":
			"Birth Date: {birthDate} | Est. Retirement Date: {retirementDate} | Remaining Needed: {remaining}",
		"result.shareSubtitle":
			"Rule: {profile} | Region: {region} | Minimum Required: {minContribution}",
		"result.generatedAt": "Generated: {time}",
		"result.shareDisclaimer":
			"Note: This estimate is based on your inputs for reference only. Please follow local social security bureau policies.",
		"result.aiDisclaimer":
			"AI Notice: Results and exported screenshots are AI-assisted for reference only and do not constitute legal or policy advice. Verify with official sources before making decisions.",
		"result.stepsHeading": "Calculation Steps",
		"result.copy": "Copy Result",
		"result.copyLink": "Copy Share Link",
		"result.download": "Download Screenshot",
		"result.delayedNote":
			"Contributions at statutory retirement age are below the minimum; additional contributions are needed before retirement.",
		"result.onTimeNote":
			"Expected contributions will meet the minimum requirement by statutory retirement age.",
		"result.nationalBaseline": " (National floor: {duration})",

		"result.detail.birthDate": "Birth Date: ",
		"result.detail.retirementDate": "Estimated Statutory Retirement Date: ",
		"result.detail.profile": "Retirement Rule: ",
		"result.detail.personalDelay": " (Personal delay: {duration})",
		"result.detail.regionTemplate": "Region Template: ",
		"result.detail.regionAdjustment": " (Adjustment: {months} mo)",
		"result.detail.minRequirement": "Minimum Required Contribution: ",
		"result.detail.monthsUntilAge": "Remaining Until Retirement Age: ",
		"result.detail.monthsToMin": "Remaining Until Min Contribution: ",
		"result.detail.reachDate": "Est. Date to Meet Min Contribution: ",
		"result.detail.ageAtReach": " (Age then: {age})",
		"result.detail.remaining": "Additional Contribution Needed: ",
		"result.detail.projected": "Projected Total Contribution at Eligibility: ",

		"steps.1":
			"Step 1: Determine statutory retirement age by profile and birth month, plus personal delay, yielding <strong>{age}</strong> (Policy delay: {delay}).",
		"steps.2":
			"Step 2: Calculate estimated statutory retirement date from birth date + retirement age: <strong>{date}</strong>.",
		"steps.3":
			"Step 3: Apply the national minimum contribution rule by retirement year (+6 months/year starting 2030, up to 20 years) and take the higher value with the region template: <strong>{minContribution}</strong>{baseline}.",
		"steps.4":
			"Step 4: Compute two waits: A = until retirement age <strong>{untilAge}</strong>, B = contribution gap <strong>{untilMin}</strong>; continuous contributions reach the minimum on <strong>{reachDate}</strong> (age <strong>{ageAtReach}</strong>).",
		"steps.5":
			"Step 5: Take max(A, B) to get remaining social security contributions needed: <strong>{remaining}</strong>.",

		"copyText.heading": "Social Security Retirement Contribution Estimate",
		"copyText.time": "Calculated At: {time}",
		"copyText.birthDate": "Birth Date: {date}",
		"copyText.profile": "Retirement Rule: {profile}",
		"copyText.delay": "Flexible Delay: {duration}",
		"copyText.region": "Region Template: {region}",
		"copyText.adjustment": "Local Adjustment: {duration}{dir}",
		"copyText.adjustmentDecrease": " (Decrease)",
		"copyText.adjustmentIncrease": " (Increase)",
		"copyText.retirementAge": "Retirement Age: {age}",
		"copyText.policyDelay": "Policy Delay: {delay}",
		"copyText.contributed": "Accumulated Contribution: {duration}",
		"copyText.minContribution": "Minimum Required: {duration}{baseline}",
		"copyText.retirementDate": "Est. Statutory Retirement Date: {date}",
		"copyText.untilAge": "Until Retirement Age: {duration}",
		"copyText.untilMin": "Until Min Contribution: {duration}",
		"copyText.reachDate": "Est. Date to Meet Min Contribution: {date} (Age: {age})",
		"copyText.remaining": "Additional Contribution Needed: {duration}",
		"copyText.projected": "Projected Total Contribution: {duration}",
		"copyText.stepsTitle": "Calculation Steps:",
		"copyText.step1":
			"1) Determine statutory retirement age (with policy delay) + personal delay = {age}.",
		"copyText.step2": "2) Compute retirement date from birth date: {date}.",
		"copyText.step3":
			"3) Compute national minimum contribution{baseline} and take the higher with region template = {minContribution}.",
		"copyText.step4":
			"4) Compute A = {untilAge} until age, B = {untilMin} gap; continuous contributions reach minimum on {reachDate} (age {ageAtReach}).",
		"copyText.step5": "5) Take max(A, B) = {remaining}.",

		"history.title": "History",
		"history.clear": "Clear History",
		"history.empty": "No records yet",
		"history.itemSummary": "{time} | {profile} | Remaining: {remaining}",
		"history.restore": "Restore Inputs",
		"history.delete": "Delete",

		"policy.title": "China Social Security Policy Timeline (Pension)",
		"policy.aiBadge": "AI Summary",
		"policy.aiNoticeText":
			"This section was automatically summarized by AI from public materials. Please verify against official documents.",
		"policy.aiUpdated": "Compiled: {date}",
		"policy.meta": "Milestone timeline (brief): key changes and institutional significance of each reform round.",
		"policy.tag.guofa": "State Council",
		"policy.legend.guofa": "State Council Document",
		"policy.tag.guobanfa": "General Office",
		"policy.legend.guobanfa": "General Office Document",
		"policy.tag.ministry": "Ministry Rule",
		"policy.legend.ministry": "Ministerial Regulation",
		"policy.tag.plan": "Reform Plan",
		"policy.legend.plan": "Supporting Reform Plan",
		"policy.tag.decision": "NPCSC Decision",
		"policy.legend.decision": "NPCSC Decision",
		"policy.tag.pilot": "Pilot",
		"policy.legend.pilot": "Pilot Program",
		"policy.disclaimer":
			"This timeline is AI-compiled from public information for policy context only and does not constitute legal or administrative advice. Please refer to official documents from national and local authorities.",

		"modal.title": "Confirm Action",
		"modal.defaultMessage": "Are you sure you want to proceed?",
		"modal.cancel": "Cancel",
		"modal.confirm": "Confirm",
		"modal.confirmDelete": "Confirm Delete",
		"modal.noticeTitle": "Notice",
		"modal.noticeOk": "OK",
		"modal.deleteOne": "Delete this history record?",
		"modal.clearAll": "Clear all history records? This cannot be undone.",
		"modal.copySuccessTitle": "Copied",
		"modal.copyFailTitle": "Copy Failed",
		"modal.copyResultSuccess": "Result copied to clipboard.",
		"modal.copyResultFail": "Failed to copy. Please check browser permissions.",
		"modal.copyLinkSuccess":
			"Share link copied. Recipients will see the pre-filled inputs and calculation result.",
		"modal.copyLinkFail": "Failed to copy share link. Please check browser permissions.",
		"modal.screenshotFailTitle": "Screenshot Failed",
		"modal.screenshotUnavailable": "Screenshot library failed to load. Please refresh and try again.",

		"error.birthDateRequired": "Please select your birth date.",
		"error.calculateFirst": "Please run a calculation first.",

		"unit.monthsOnly": "{months} mo",
		"unit.yearsOnly": "{years} yr",
		"unit.yearsMonths": "{years} yr {months} mo",
		"unit.age": "{years} yr {months} mo",

		"footer.ai": "AI-Assisted Estimate",
		"footer.reference": "For Reference Only",
		"footer.official": "Official Policies Prevail",
		"footer.disclaimer":
			"For official procedures, please refer to formal documents issued by local social security authorities. Not legal or policy advice."
	}
};

function normalizeLocale(locale) {
	if (!locale || typeof locale !== "string") {
		return DEFAULT_LOCALE;
	}
	if (SUPPORTED_LOCALES.includes(locale)) {
		return locale;
	}
	const lower = locale.toLowerCase();
	if (lower.startsWith("en")) {
		return "en";
	}
	if (lower.startsWith("zh")) {
		return "zh-CN";
	}
	return DEFAULT_LOCALE;
}

function detectInitialLocale() {
	const params = new URLSearchParams(window.location.search);
	const fromUrl = params.get("lang");
	if (fromUrl) {
		return normalizeLocale(fromUrl);
	}
	try {
		const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
		if (saved) {
			return normalizeLocale(saved);
		}
	} catch (error) {
		// Ignore storage errors
	}
	return normalizeLocale(navigator.language);
}

let currentLocale = detectInitialLocale();

export function getLocale() {
	return currentLocale;
}

export function setLocale(locale) {
	currentLocale = normalizeLocale(locale);
	try {
		localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
	} catch (error) {
		// Ignore storage errors
	}
	applyStaticTranslations();
	return currentLocale;
}

export function t(key, params = {}) {
	const dict = TRANSLATIONS[currentLocale] || TRANSLATIONS[DEFAULT_LOCALE];
	let template = dict[key];
	if (template === undefined) {
		template = TRANSLATIONS[DEFAULT_LOCALE][key];
	}
	if (template === undefined) {
		return key;
	}
	return template.replace(/\{(\w+)\}/g, (_, token) => {
		return params[token] !== undefined ? String(params[token]) : `{${token}}`;
	});
}

export function applyStaticTranslations() {
	document.documentElement.lang = currentLocale;
	document.title = t("doc.title");

	const elements = document.querySelectorAll("[data-i18n]");
	for (const el of elements) {
		const key = el.getAttribute("data-i18n");
		if (key) {
			el.textContent = t(key);
		}
	}

	const localeSelect = document.getElementById("locale-select");
	if (localeSelect) {
		localeSelect.value = currentLocale;
	}
}
