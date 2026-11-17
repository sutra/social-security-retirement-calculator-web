const LOCALE_STORAGE_KEY = "retirement-calculator-locale-v1";
export const SUPPORTED_LOCALES = ["zh-Hans", "zh-Hant", "en"];
export const DEFAULT_LOCALE = "zh-Hans";

const TRANSLATIONS = {
	"zh-Hans": {
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
	"zh-Hant": {
		"doc.title": "社保退休繳費月數計算器 | 估算還需繳納多少個月",
		"app.title": "社保退休繳費月數計算器",
		"app.languageLabel": "語言",
		"app.intro": "輸入出生日期、退休規則和已繳費月數，快速估算還需繼續繳納多少個月社保才能退休。",
		"app.aiBadge": "AI 輔助",
		"app.aiNoticeText":
			"本頁面功能、互動與文案由 AI 輔助生成與整理，內容僅供參考，不構成法律、政策或辦事建議。涉及社保辦理與個人決策，請以國家及地方主管部門最新正式文件和視窗答覆為準，並進行人工覆核。",
		"app.aiUpdated": "聲明更新：{date}",

		"form.retirementProfile": "退休規則預設",
		"form.delayMonths": "延遲退休（月）",
		"form.birthDate": "出生日期",
		"form.retirementAgeYears": "法定退休年齡（歲）",
		"form.retirementAgeMonths": "退休年齡（額外月）",
		"form.contributedMonths": "累計繳費月數",
		"form.regionTemplate": "地區範本",
		"form.regionAdjustmentMonths": "地方調整（月，可正可負）",
		"form.minimumContributionMonths": "退休最低繳費要求（月）",
		"form.submit": "開始計算",
		"form.reset": "重設表單",
		"form.resetNotice": "已重設",

		"profile.maleOption": "男職工（60歲）",
		"profile.femaleCadreOption": "女幹部（55歲）",
		"profile.femaleWorkerOption": "女工人（50歲）",
		"profile.customOption": "自訂年齡",
		"profile.male": "男職工",
		"profile.female-cadre": "女幹部",
		"profile.female-worker": "女工人",
		"profile.custom": "自訂",

		"region.nationalDefaultOption": "全國常見基線（180）",
		"region.beijingOption": "北京範本（180）",
		"region.shanghaiOption": "上海範本（180）",
		"region.guangdongOption": "廣東範本（180）",
		"region.customOption": "自訂最低繳費月數",
		"region.national-default": "全國常見基線",
		"region.beijing": "北京範本",
		"region.shanghai": "上海範本",
		"region.guangdong": "廣東範本",
		"region.custom": "自訂",

		"result.title": "計算結果",
		"result.titleAsOf": "社保退休測算結果（截至 {date}）",
		"result.shareHeadline":
			"出生日期：{birthDate} | 預計退休日期：{retirementDate} | 還需繼續繳納：{remaining}",
		"result.shareSubtitle":
			"退休規則：{profile} | 地區範本：{region} | 最低繳費要求：{minContribution}",
		"result.generatedAt": "產生時間：{time}",
		"result.shareDisclaimer":
			"說明：本結果基於使用者輸入參數進行估算，僅供參考，請以當地社保部門政策口徑為準。",
		"result.aiDisclaimer":
			"AI 聲明：本計算結果與下載截圖由 AI 輔助生成，僅供參考，不構成法律、政策或辦事建議。用於辦理或決策前請人工覆核，並以官方口徑為準。",
		"result.stepsHeading": "計算步驟",
		"result.copy": "複製結果",
		"result.copyLink": "複製分享連結",
		"result.download": "下載結果截圖",
		"result.delayedNote": "達到法定退休年齡時繳費月數不足，需要繼續繳納後再退休。",
		"result.onTimeNote": "達到法定退休年齡時，繳費月數預計已滿足最低要求。",
		"result.nationalBaseline": "（國家基線 {duration}）",

		"result.detail.birthDate": "出生日期：",
		"result.detail.retirementDate": "預計達到法定退休年齡日期：",
		"result.detail.profile": "退休規則：",
		"result.detail.personalDelay": "（個人延遲 {duration}）",
		"result.detail.regionTemplate": "地區範本：",
		"result.detail.regionAdjustment": "（調整 {months} 個月）",
		"result.detail.minRequirement": "政策最低繳費要求：",
		"result.detail.monthsUntilAge": "距離法定退休年齡：",
		"result.detail.monthsToMin": "距離最低繳費月數：",
		"result.detail.reachDate": "按連續繳納預計滿足最低繳費日期：",
		"result.detail.ageAtReach": "（當時年齡：{age}）",
		"result.detail.remaining": "還需繼續繳納社保：",
		"result.detail.projected": "屆時累計繳費月數：",

		"steps.1":
			"第 1 步：按最新退休政策與人員類型確定基礎退休年齡，並計算政策順延（月）。本次為 <strong>{age}</strong>（政策順延：{delay}）。",
		"steps.2":
			"第 2 步：根據出生日期 + 退休年齡，得到預計退休日期：<strong>{date}</strong>。",
		"steps.3":
			"第 3 步：按退休年份套用最低繳費年限規則（2030 年起每年 +6 個月，最高 20 年），並與地區範本值取較高值。本次最低要求：<strong>{minContribution}</strong>{baseline}。",
		"steps.4":
			"第 4 步：計算兩個等待量：A=距退休年齡 <strong>{untilAge}</strong>，B=繳費差額 <strong>{untilMin}</strong>，並按連續繳納推算滿足最低繳費日期為 <strong>{reachDate}</strong>（當時年齡 <strong>{ageAtReach}</strong>）。",
		"steps.5":
			"第 5 步：取 max(A, B)，得到還需繼續繳納社保：<strong>{remaining}</strong>。",

		"copyText.heading": "社保退休繳費月數計算結果",
		"copyText.time": "計算時間：{time}",
		"copyText.birthDate": "出生日期：{date}",
		"copyText.profile": "退休規則：{profile}",
		"copyText.delay": "彈性延遲退休：{duration}",
		"copyText.region": "地區範本：{region}",
		"copyText.adjustment": "地方調整：{duration}{dir}",
		"copyText.adjustmentDecrease": "（減少）",
		"copyText.adjustmentIncrease": "（增加）",
		"copyText.retirementAge": "退休年齡：{age}",
		"copyText.policyDelay": "政策順延：{delay}",
		"copyText.contributed": "已累計繳費：{duration}",
		"copyText.minContribution": "最低繳費要求：{duration}{baseline}",
		"copyText.retirementDate": "預計達到法定退休年齡日期：{date}",
		"copyText.untilAge": "距離法定退休年齡：{duration}",
		"copyText.untilMin": "距離最低繳費月數：{duration}",
		"copyText.reachDate": "按連續繳納預計滿足最低繳費日期：{date}（當時年齡：{age}）",
		"copyText.remaining": "還需繼續繳納社保：{duration}",
		"copyText.projected": "屆時累計繳費月數：{duration}",
		"copyText.stepsTitle": "計算步驟：",
		"copyText.step1":
			"1) 按人員類型與出生年月確定政策退休年齡（含政策順延）並疊加個人延遲月數，得到 {age}。",
		"copyText.step2": "2) 用出生日期推算退休日期：{date}。",
		"copyText.step3":
			"3) 按退休年份計算國家最低繳費要求{baseline}，並與地區範本配置取較高值，得到 {minContribution}。",
		"copyText.step4":
			"4) 計算 A=距退休年齡 {untilAge}，B=距最低繳費 {untilMin}，按連續繳納推算到達日期為 {reachDate}（當時年齡 {ageAtReach}）。",
		"copyText.step5": "5) 取 max(A, B) = {remaining}。",

		"history.title": "歷史記錄",
		"history.clear": "清空歷史",
		"history.empty": "暫無記錄",
		"history.itemSummary": "{time} | {profile} | 還需 {remaining}",
		"history.restore": "恢復這條輸入",
		"history.delete": "刪除",

		"policy.title": "中國社保政策變化（養老相關）",
		"policy.aiBadge": "AI整理內容",
		"policy.aiNoticeText": "本區為 AI 基於公開資料自動整理，已做顯式標識，請以官方原文核驗後使用。",
		"policy.aiUpdated": "整理日期：{date}",
		"policy.meta": "里程碑時間線（簡版）：聚焦每一輪政策的核心變化與制度意義。",
		"policy.tag.guofa": "國發",
		"policy.legend.guofa": "國務院文件",
		"policy.tag.guobanfa": "國辦發",
		"policy.legend.guobanfa": "國務院辦公廳文件",
		"policy.tag.ministry": "部門規章",
		"policy.legend.ministry": "部委規範文件",
		"policy.tag.plan": "改革方案",
		"policy.legend.plan": "改革配套方案",
		"policy.tag.decision": "決定類",
		"policy.legend.decision": "全國人大常委會決定",
		"policy.tag.pilot": "試點",
		"policy.legend.pilot": "先行先試安排",
		"policy.disclaimer":
			"本時間線由 AI 基於公開資訊自動整理，僅用於政策脈絡理解，不構成法律、政策或辦事建議。請在發佈或決策使用前進行人工覆核。具體適用條件、執行口徑和地方細則，請以國家及地方人社、醫保、稅務等部門最新正式文件為準。",

		"modal.title": "確認操作",
		"modal.defaultMessage": "確定執行該操作嗎？",
		"modal.cancel": "取消",
		"modal.confirm": "確認",
		"modal.confirmDelete": "確認刪除",
		"modal.noticeTitle": "提示",
		"modal.noticeOk": "知道了",
		"modal.deleteOne": "確定刪除這條歷史記錄嗎？",
		"modal.clearAll": "確定要清空所有歷史記錄嗎？此操作無法撤銷。",
		"modal.copySuccessTitle": "複製成功",
		"modal.copyFailTitle": "複製失敗",
		"modal.copyResultSuccess": "結果已複製到剪貼簿。",
		"modal.copyResultFail": "複製失敗，請檢查瀏覽器權限。",
		"modal.copyLinkSuccess": "分享連結已複製。對方開啟後可直接看到輸入參數與計算結果。",
		"modal.copyLinkFail": "複製分享連結失敗，請檢查瀏覽器權限。",
		"modal.screenshotFailTitle": "截圖失敗",
		"modal.screenshotUnavailable": "截圖元件未載入，請重新整理頁面後重試。",

		"error.birthDateRequired": "請選擇出生日期",
		"error.calculateFirst": "請先完成一次計算。",

		"unit.monthsOnly": "{months} 個月",
		"unit.yearsOnly": "{years} 年",
		"unit.yearsMonths": "{years} 年 {months} 個月",
		"unit.age": "{years} 歲 {months} 個月",

		"footer.ai": "AI 輔助估算",
		"footer.reference": "僅供參考",
		"footer.official": "以官方政策為準",
		"footer.disclaimer":
			"具體事項請以當地社保部門發佈的正式文件為準，不構成法律、政策或辦事建議。"
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
	if (
		lower.startsWith("zh-hant") ||
		lower.startsWith("zh-tw") ||
		lower.startsWith("zh-hk") ||
		lower.startsWith("zh-mo")
	) {
		return "zh-Hant";
	}
	if (lower.startsWith("zh")) {
		return "zh-Hans";
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
