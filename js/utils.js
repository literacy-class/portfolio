/*==================== UTILITY FUNCTIONS ====================*/

/**
 * DOM要素を選択する
 * @param {string} selector - CSSセレクター
 * @param {Element} parent - 親要素（オプション）
 * @returns {Element|null} 選択された要素
 */
export const select = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * 複数のDOM要素を選択する
 * @param {string} selector - CSSセレクター
 * @param {Element} parent - 親要素（オプション）
 * @returns {NodeList} 選択された要素のリスト
 */
export const selectAll = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
};

/**
 * 要素にクラスを追加する
 * @param {Element} element - 対象要素
 * @param {string} className - クラス名
 */
export const addClass = (element, className) => {
    if (element) element.classList.add(className);
};

/**
 * 要素からクラスを削除する
 * @param {element} element - 対象要素
 * @param {string} className - クラス名
 */
export const removeClass = (element, className) => {
    if (element) element.classList.remove(className);
};

/**
 * 要素のクラスを切り替える
 * @param {Element} element - 対象要素
 * @param {string} className - クラス名
 */
export const toggleClass = (element, className) => {
    if (element) element.classList.toggle(className);
};

/**
 * 要素がクラスを持っているかチェック
 * @param {Element} element - 対象要素
 * @param {string} className - クラス名
 * @returns {boolean} クラスを持っているかどうか
 */
export const hasClass = (element, className) => {
    return element ? element.classList.contains(className) : false;
};

/**
 * スムーススクロール
 * @param {Element} target - スクロール先の要素
 * @param {number} offset - オフセット値
 */
export const scrollToElement = (target, offset = 0) => {
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

/**
 * デバウンス関数
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} デバウンスされた関数
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * スロットル関数
 * @param {Function} func - 実行する関数
 * @param {number} delay - 遅延時間（ミリ秒）
 * @returns {Function} スロットルされた関数
 */
export const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

/**
 * アニメーション用のカウンター
 * @param {Element} element - 対象要素
 * @param {number} start - 開始値
 * @param {number} end - 終了値
 * @param {number} duration - アニメーション時間（ミリ秒）
 */
export const animateCounter = (element, start, end, duration = 2000) => {
    if (!element) return;
    
    const startTime = Date.now();
    const difference = end - start;
    
    const step = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // イージング関数（ease-out）
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (difference * easeOut));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    
    requestAnimationFrame(step);
};

/**
 * ビューポートに要素が入っているかチェック
 * @param {Element} element - チェックする要素
 * @param {number} threshold - 閾値（0-1）
 * @returns {boolean} ビューポート内にあるかどうか
 */
export const isInViewport = (element, threshold = 0.5) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const elementHeight = rect.bottom - rect.top;
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    
    return visibleHeight / elementHeight >= threshold;
};

/**
 * フォームバリデーション
 * @param {Element} form - フォーム要素
 * @returns {boolean} バリデーション結果
 */
export const validateForm = (form) => {
    if (!form) return false;
    
    const requiredFields = selectAll('[required]', form);
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldType = field.type;
        
        // 空値チェック
        if (!value) {
            showFieldError(field, 'この項目は必須です');
            isValid = false;
            return;
        }
        
        // メールバリデーション
        if (fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, '有効なメールアドレスを入力してください');
                isValid = false;
                return;
            }
        }
        
        // 電話番号バリデーション
        if (field.name === 'phone') {
            const phoneRegex = /^[\d\-\(\)\+\s]+$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, '有効な電話番号を入力してください');
                isValid = false;
                return;
            }
        }
        
        // エラーをクリア
        clearFieldError(field);
    });
    
    return isValid;
};

/**
 * フィールドエラーを表示
 * @param {Element} field - フィールド要素
 * @param {string} message - エラーメッセージ
 */
export const showFieldError = (field, message) => {
    addClass(field, 'error');
    
    // 既存のエラーメッセージを削除
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 新しいエラーメッセージを追加
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
};

/**
 * フィールドエラーをクリア
 * @param {Element} field - フィールド要素
 */
export const clearFieldError = (field) => {
    removeClass(field, 'error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
};

/**
 * ローディング状態を表示
 * @param {Element} button - ボタン要素
 * @param {boolean} isLoading - ローディング状態
 */
export const setLoadingState = (button, isLoading) => {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> 送信中...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || '送信';
    }
};

/**
 * トーストメッセージを表示
 * @param {string} message - メッセージ
 * @param {string} type - タイプ（success, error, info）
 * @param {number} duration - 表示時間（ミリ秒）
 */
export const showToast = (message, type = 'info', duration = 3000) => {
    // 既存のトーストを削除
    const existingToast = select('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // トースト要素を作成
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    // DOMに追加
    document.body.appendChild(toast);
    
    // アニメーション
    setTimeout(() => addClass(toast, 'toast--show'), 100);
    
    // 自動削除
    setTimeout(() => {
        removeClass(toast, 'toast--show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

/**
 * パフォーマンス測定
 * @param {string} name - 測定名
 * @param {Function} func - 測定する関数
 */
export const measurePerformance = (name, func) => {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
}; 