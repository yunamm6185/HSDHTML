/* ============================================
   statistics.js — 统计计算函数库
   适用于第19章全部教学页面
   ============================================ */

/**
 * 解析输入字符串为数值数组
 * @param {string} str - 逗号或空格分隔的数字字符串
 * @returns {number[]} 数值数组
 */
function parseData(str) {
    return str.split(/[,，\s]+/).map(parseFloat).filter(v => !isNaN(v));
}

/**
 * 完整统计量计算
 * @param {number[]} data - 数值数组
 * @returns {object} 包含 mean, median, mode, variance, std, min, max, range, q1, q3, sorted, n
 */
function calcStats(data) {
    const n = data.length;
    if (n === 0) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const median = n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const counts = {};
    data.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(counts));
    const modes = Object.keys(counts).filter(k => counts[k] === maxFreq);
    const mode = maxFreq > 1 ? modes.join(', ') : '无';
    const variance = data.reduce((a, x) => a + (x - mean) * (x - mean), 0) / n;
    return {
        mean, median, mode, variance, std: Math.sqrt(variance),
        min: sorted[0], max: sorted[n - 1], range: sorted[n - 1] - sorted[0],
        q1: sorted[Math.floor(n * 0.25)], q3: sorted[Math.floor(n * 0.75)],
        sorted, n
    };
}

/**
 * 计算四分位数（用于箱线图）
 * @param {number[]} sorted - 已排序数组
 * @returns {object} {min, max, q1, q2, q3, iqr, lower, upper, outliers}
 */
function calcQuartiles(sorted) {
    const n = sorted.length;
    if (n === 0) return null;
    const min = sorted[0], max = sorted[n - 1];
    const q2 = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const left = sorted.slice(0, Math.floor(n / 2));
    const right = sorted.slice(Math.ceil(n / 2));
    const q1 = left.length ? (left.length % 2 === 0 ? (left[left.length / 2 - 1] + left[left.length / 2]) / 2 : left[Math.floor(left.length / 2)]) : min;
    const q3 = right.length ? (right.length % 2 === 0 ? (right[right.length / 2 - 1] + right[right.length / 2]) / 2 : right[Math.floor(right.length / 2)]) : max;
    const iqr = q3 - q1, lower = q1 - 1.5 * iqr, upper = q3 + 1.5 * iqr;
    const outliers = sorted.filter(v => v < lower || v > upper);
    return { min, max, q1, q2, q3, iqr, lower, upper, outliers };
}

/**
 * 计算加权平均数
 * @param {number[]} values
 * @param {number[]} weights
 * @returns {number}
 */
function weightedMean(values, weights) {
    const sum = values.reduce((a, v, i) => a + v * weights[i], 0);
    const wSum = weights.reduce((a, b) => a + b, 0);
    return wSum === 0 ? 0 : sum / wSum;
}
