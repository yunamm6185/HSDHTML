/* ============================================
   quiz.js — 答题系统
   统一的判断题/选择题判分逻辑
   ============================================ */

/**
 * 注册一组题目答案
 * @param {object} answerMap - { questionId: correctAnswerIndex, ... }
 * @param {object} reasonMap - { questionId: '解释文字', ... }
 */
function registerQuiz(answerMap, reasonMap) {
    window.__quizAnswers = answerMap;
    window.__quizReasons = reasonMap;
}

/**
 * 检查单题答案
 * @param {string} qId - 题目ID
 * @param {number} userAns - 用户答案索引
 * @param {HTMLElement} el - 被点击的元素
 */
function checkQuiz(qId, userAns, el) {
    const card = document.getElementById(qId);
    if (!card || card.dataset.done) return;
    card.dataset.done = '1';

    // 禁用所有选项
    card.querySelectorAll('.quiz-option, .opt').forEach(o => o.style.pointerEvents = 'none');

    const correct = window.__quizAnswers[qId];
    const reason = window.__quizReasons[qId] || '';
    const fb = card.querySelector('.quiz-feedback, .quiz-fb');

    if (userAns === correct) {
        card.classList.add('correct');
        if (fb) fb.innerHTML = '✅ <span style="color:#059669;">正确！</span>' + reason;
    } else {
        card.classList.add('wrong');
        if (fb) fb.innerHTML = '❌ <span style="color:#dc2626;">错误。</span>' + reason;
        // 高亮正确答案
        const opts = card.querySelectorAll('.quiz-option, .opt');
        if (opts[correct]) opts[correct].classList.add('correct-answer');
    }
    if (fb) fb.style.display = 'block';
    if (el) el.classList.add(userAns === correct ? 'correct-answer' : 'wrong-answer');
}

/**
 * 计算并显示总分
 * @param {object} answerMap
 * @param {string[]} submittedIds - 已提交的题目ID列表
 * @param {string} scoreElId - 分数显示元素ID
 */
function showScore(answerMap, submittedIds, scoreElId) {
    const total = Object.keys(answerMap).length;
    const correct = submittedIds.filter(id => {
        const card = document.getElementById(id);
        return card && card.classList.contains('correct');
    }).length;
    const el = document.getElementById(scoreElId);
    if (el) {
        el.style.display = 'block';
        el.textContent = '得分：' + correct + ' / ' + total;
        el.style.animation = 'bounceIn 0.6s ease';
    }
}
