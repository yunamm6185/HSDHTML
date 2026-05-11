/* ============================================
   chart-utils.js — Chart.js 图表工厂函数
   统一管理所有 Chart.js 实例
   ============================================ */

/** 全局图表实例管理（用于销毁重建） */
window.__charts = {};

/**
 * 安全销毁旧图表并创建新图表
 * @param {string} id - canvas元素ID
 * @param {function} factory - 创建Chart实例的工厂函数
 * @returns {Chart}
 */
function createChart(id, factory) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    if (window.__charts[id]) {
        window.__charts[id].destroy();
        window.__charts[id] = null;
    }
    const chart = factory(canvas.getContext('2d'));
    window.__charts[id] = chart;
    return chart;
}

/** 销毁指定图表 */
function destroyChart(id) {
    if (window.__charts[id]) {
        window.__charts[id].destroy();
        window.__charts[id] = null;
    }
}

/** 柱状图 */
function createBarChart(id, labels, data, opts = {}) {
    return createChart(id, ctx => new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: opts.label || '',
                data,
                backgroundColor: opts.colors || '#0ea5e9',
                borderRadius: opts.borderRadius || 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: opts.title ? { display: true, text: opts.title, font: { size: 14 } } : {},
                legend: { display: opts.legend !== false }
            },
            scales: {
                y: { title: opts.yTitle ? { display: true, text: opts.yTitle } : {} }
            },
            animation: { duration: opts.duration || 600 }
        }
    }));
}

/** 折线图 */
function createLineChart(id, labels, datasets, opts = {}) {
    return createChart(id, ctx => new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: opts.title ? { display: true, text: opts.title, font: { size: 14 } } : {}
            },
            scales: {
                y: { title: opts.yTitle ? { display: true, text: opts.yTitle } : {} }
            },
            animation: { duration: opts.duration || 800 }
        }
    }));
}

/** 饼图/环形图 */
function createPieChart(id, labels, data, opts = {}) {
    return createChart(id, ctx => new Chart(ctx, {
        type: opts.doughnut ? 'doughnut' : 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: opts.colors || ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: opts.title ? { display: true, text: opts.title, font: { size: 14 } } : {}
            },
            animation: { duration: opts.duration || 800 }
        }
    }));
}

/** 雷达图 */
function createRadarChart(id, labels, datasets, opts = {}) {
    return createChart(id, ctx => new Chart(ctx, {
        type: 'radar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: opts.title ? { display: true, text: opts.title, font: { size: 14 } } : {}
            },
            scales: { r: opts.rScale || { min: 0, max: 5, ticks: { stepSize: 1 } } },
            animation: { duration: opts.duration || 800 }
        }
    }));
}

/** 多组柱状图 */
function createGroupedBarChart(id, labels, datasets, opts = {}) {
    return createChart(id, ctx => new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: opts.title ? { display: true, text: opts.title, font: { size: 14 } } : {},
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: { title: opts.yTitle ? { display: true, text: opts.yTitle } : {} }
            },
            animation: { duration: opts.duration || 800 }
        }
    }));
}
