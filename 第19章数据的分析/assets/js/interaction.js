/* ============================================
   interaction.js — 通用交互逻辑
   答案折叠、Tab切换等
   ============================================ */

/**
 * 切换答案/折叠面板的显示
 * @param {string} id - 元素ID
 */
function toggleAnswer(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
}

/**
 * Tab切换
 * @param {string} tabName - tab名称
 * @param {Event} evt - 点击事件
 */
function switchTab(tabName, evt) {
    const container = evt.target.closest('.tab-container');
    if (!container) return;

    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    evt.target.classList.add('active');
    const content = container.querySelector('#tab-' + tabName);
    if (content) content.classList.add('active');
}

/**
 * 场景切换
 * @param {string} type - 场景类型
 * @param {object} dataMap - 场景数据映射
 * @param {string} titleId - 标题元素ID
 * @param {string} descId - 描述元素ID
 * @param {string} reasonId - 理由元素ID
 * @param {Event} evt - 点击事件
 */
function showScenario(type, dataMap, titleId, descId, reasonId, evt) {
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');
    const s = dataMap[type];
    if (!s) return;
    if (titleId) { const el = document.getElementById(titleId); if (el) el.textContent = s.title; }
    if (descId) { const el = document.getElementById(descId); if (el) el.innerHTML = s.desc; }
    if (reasonId) { const el = document.getElementById(reasonId); if (el) el.textContent = s.reason; }
}

/**
 * 生成随机数据
 * @param {string} inputId - 输入框ID
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {number} count - 数据个数
 */
function randomData(inputId, min, max, count) {
    const d = [];
    const n = count || Math.floor(Math.random() * 11) + 5;
    for (let i = 0; i < n; i++) d.push(Math.floor(Math.random() * (max - min + 1)) + min);
    document.getElementById(inputId).value = d.join(', ');
    return d;
}

/**
 * 排序并更新输入框
 * @param {string} inputId
 */
function sortAndUpdate(inputId) {
    const data = parseData(document.getElementById(inputId)?.value || '');
    if (!data.length) return;
    document.getElementById(inputId).value = data.sort((a, b) => a - b).join(', ');
}
