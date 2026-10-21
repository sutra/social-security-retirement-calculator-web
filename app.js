import {
  computeRetirementPlan,
  getMinimumContributionByRegion,
  getRetirementAgeByProfile
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
const downloadButton = document.getElementById("download-result");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");

const HISTORY_KEY = "retirement-calculator-history-v1";
const HISTORY_LIMIT = 20;

let currentResultText = "";

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

  const isCustom = profile === "custom";
  retirementAgeYearsInput.readOnly = !isCustom;
  retirementAgeMonthsInput.readOnly = !isCustom;

  if (isCustom) {
    return;
  }

  const age = getRetirementAgeByProfile(profile, delayMonths);
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
    currentDate: new Date()
  };
}

function getResultText(payload, plan) {
  const delayedNote = plan.needsDelayedRetirementForContribution
    ? "达到法定退休年龄时缴费月数不足，需要继续缴纳后再退休。"
    : "达到法定退休年龄时，缴费月数预计已满足最低要求。";
  return [
    "社保退休缴费月数计算结果",
    `计算时间：${formatNow()}`,
    `出生日期：${formatDate(payload.birthDate)}`,
    `退休规则：${getProfileText(payload.retirementProfile)}`,
    `弹性延迟退休：${payload.delayMonths} 个月`,
    `地区模板：${getRegionTemplateText(payload.regionTemplate)}`,
    `地方调整：${payload.regionAdjustmentMonths} 个月`,
    `退休年龄：${payload.retirementAgeYears} 岁 ${payload.retirementAgeMonths} 个月`,
    `已累计缴费：${payload.contributedMonths} 个月`,
    `最低缴费要求：${payload.minimumContributionMonths} 个月`,
    `预计达到法定退休年龄日期：${formatDate(plan.retirementDate)}`,
    `距离法定退休年龄：${plan.monthsUntilAge} 个月`,
    `距离最低缴费月数：${plan.monthsToMinContribution} 个月`,
    `还需继续缴纳社保：${plan.monthsUntilEligible} 个月`,
    `届时累计缴费月数：${plan.projectedContributionMonths} 个月`,
    delayedNote
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
          <p>${item.time} | ${item.profileText} | 还需 ${item.monthsUntilEligible} 个月</p>
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

function renderResult(payload, plan) {
  resultBox.hidden = false;

  const delayedNote = plan.needsDelayedRetirementForContribution
    ? "达到法定退休年龄时缴费月数不足，需要继续缴纳后再退休。"
    : "达到法定退休年龄时，缴费月数预计已满足最低要求。";

  detailsList.innerHTML = `
    <li>预计达到法定退休年龄日期：<strong>${formatDate(plan.retirementDate)}</strong></li>
    <li>退休规则：<strong>${getProfileText(payload.retirementProfile)}</strong>（延迟 ${payload.delayMonths} 个月）</li>
    <li>地区模板：<strong>${getRegionTemplateText(payload.regionTemplate)}</strong>（调整 ${payload.regionAdjustmentMonths} 个月）</li>
    <li>距离法定退休年龄：<strong>${plan.monthsUntilAge}</strong> 个月</li>
    <li>距离最低缴费月数：<strong>${plan.monthsToMinContribution}</strong> 个月</li>
    <li>还需继续缴纳社保：<strong>${plan.monthsUntilEligible}</strong> 个月</li>
    <li>届时累计缴费月数：<strong>${plan.projectedContributionMonths}</strong> 个月</li>
    <li>${delayedNote}</li>
  `;

  currentResultText = getResultText(payload, plan);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const payload = readFormData();
    const plan = computeRetirementPlan(payload);
    renderResult(payload, plan);
    pushHistory(payload, plan);
  } catch (error) {
    resultBox.hidden = false;
    detailsList.innerHTML = `<li class="error">${error.message}</li>`;
  }
});

retirementProfileInput.addEventListener("change", applyRetirementAgePreset);
delayMonthsInput.addEventListener("input", applyRetirementAgePreset);
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

  form.requestSubmit();
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

applyRetirementAgePreset();
applyRegionTemplatePreset();
renderHistory();
