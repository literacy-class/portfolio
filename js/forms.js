/*==================== FORMS MODULE ====================*/

import { select, selectAll, addClass, removeClass, showToast } from './utils.js';

/**
 * フォームバリデーションクラス
 */
class FormValidator {
    constructor(formElement, rules = {}) {
        this.form = formElement;
        this.rules = rules;
        this.errors = {};
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.bindEvents();
    }
    
    /**
     * イベントハンドラーを設定
     */
    bindEvents() {
        if (!this.form) return;
        
        // フォーム送信時のバリデーション
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
        
        // リアルタイムバリデーション
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    /**
     * フォーム全体をバリデーション
     * @returns {boolean} バリデーション結果
     */
    validateForm() {
        this.errors = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            this.validateField(input);
        });
        
        const isValid = Object.keys(this.errors).length === 0;
        
        if (isValid) {
            this.handleSubmit();
        } else {
            this.displayErrors();
            // 最初のエラーフィールドにフォーカス
            const firstErrorField = this.form.querySelector('.form__group--error input, .form__group--error textarea');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
        
        return isValid;
    }
    
    /**
     * 個別フィールドをバリデーション
     * @param {Element} input - 入力要素
     * @returns {boolean} バリデーション結果
     */
    validateField(input) {
        const name = input.name;
        const value = input.value.trim();
        const rules = this.rules[name] || {};
        
        // 必須チェック
        if (rules.required && !value) {
            this.addError(name, rules.requiredMessage || `${this.getFieldLabel(input)}は必須です`);
            return false;
        }
        
        // 値が空の場合は以下のバリデーションをスキップ
        if (!value) return true;
        
        // 最小長チェック
        if (rules.minLength && value.length < rules.minLength) {
            this.addError(name, rules.minLengthMessage || `${this.getFieldLabel(input)}は${rules.minLength}文字以上で入力してください`);
            return false;
        }
        
        // 最大長チェック
        if (rules.maxLength && value.length > rules.maxLength) {
            this.addError(name, rules.maxLengthMessage || `${this.getFieldLabel(input)}は${rules.maxLength}文字以下で入力してください`);
            return false;
        }
        
        // パターンチェック
        if (rules.pattern && !rules.pattern.test(value)) {
            this.addError(name, rules.patternMessage || `${this.getFieldLabel(input)}の形式が正しくありません`);
            return false;
        }
        
        // Eメール形式チェック
        if (rules.email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                this.addError(name, rules.emailMessage || '正しいメールアドレスを入力してください');
                return false;
            }
        }
        
        // カスタムバリデーション
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value, input);
            if (customError) {
                this.addError(name, customError);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * エラーを追加
     * @param {string} field - フィールド名
     * @param {string} message - エラーメッセージ
     */
    addError(field, message) {
        this.errors[field] = message;
        const formGroup = this.form.querySelector(`[name="${field}"]`)?.closest('.form__group');
        if (formGroup) {
            addClass(formGroup, 'form__group--error');
            this.showFieldError(formGroup, message);
        }
    }
    
    /**
     * フィールドエラーを表示
     * @param {Element} formGroup - フォームグループ要素
     * @param {string} message - エラーメッセージ
     */
    showFieldError(formGroup, message) {
        let errorElement = formGroup.querySelector('.form__error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'form__error';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    /**
     * フィールドエラーをクリア
     * @param {Element} input - 入力要素
     */
    clearFieldError(input) {
        const formGroup = input.closest('.form__group');
        if (formGroup) {
            removeClass(formGroup, 'form__group--error');
            const errorElement = formGroup.querySelector('.form__error');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        // エラーオブジェクトからも削除
        delete this.errors[input.name];
    }
    
    /**
     * エラーを表示
     */
    displayErrors() {
        // 全体エラーメッセージを表示
        showToast('入力内容にエラーがあります。確認してください。', 'error');
    }
    
    /**
     * フィールドラベルを取得
     * @param {Element} input - 入力要素
     * @returns {string} ラベル文字列
     */
    getFieldLabel(input) {
        const label = this.form.querySelector(`label[for="${input.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : input.name;
    }
    
    /**
     * フォーム送信処理
     */
    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            addClass(this.form, 'form--loading');
            const submitButton = this.form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = '送信中...';
            }
            
            // 送信処理をシミュレート（実際のAPIに置き換えてください）
            await this.simulateSubmission(data);
            
            showToast('お問い合わせありがとうございます。確認後、ご連絡いたします。', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('送信に失敗しました。しばらく後にもう一度お試しください。', 'error');
        } finally {
            removeClass(this.form, 'form--loading');
            const submitButton = this.form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = '送信';
            }
        }
    }
    
    /**
     * 送信処理をシミュレート
     * @param {Object} data - フォームデータ
     * @returns {Promise} 送信結果
     */
    simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            // 実際の送信処理をここに実装
            console.log('送信データ:', data);
            
            setTimeout(() => {
                // 90%の確率で成功
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('送信エラー'));
                }
            }, 2000);
        });
    }
}

/**
 * 汎用フォームハンドラー
 */
class FormHandler {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        // コンタクトフォーム
        const contactForm = select('#contact-form');
        if (contactForm) {
            const contactValidator = new FormValidator(contactForm, {
                name: {
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                    requiredMessage: 'お名前を入力してください',
                    minLengthMessage: 'お名前は2文字以上で入力してください'
                },
                email: {
                    required: true,
                    email: true,
                    requiredMessage: 'メールアドレスを入力してください'
                },
                subject: {
                    required: true,
                    minLength: 5,
                    maxLength: 100,
                    requiredMessage: '件名を入力してください',
                    minLengthMessage: '件名は5文字以上で入力してください'
                },
                message: {
                    required: true,
                    minLength: 10,
                    maxLength: 1000,
                    requiredMessage: 'メッセージを入力してください',
                    minLengthMessage: 'メッセージは10文字以上で入力してください'
                }
            });
            
            this.forms.set('contact', contactValidator);
        }
        
        // ニュースレター登録フォーム
        const newsletterForm = select('#newsletter-form');
        if (newsletterForm) {
            const newsletterValidator = new FormValidator(newsletterForm, {
                email: {
                    required: true,
                    email: true,
                    requiredMessage: 'メールアドレスを入力してください'
                }
            });
            
            this.forms.set('newsletter', newsletterValidator);
        }
        
        // 汎用的なフォーム拡張機能
        this.enhanceAllForms();
    }
    
    /**
     * 全フォームに拡張機能を追加
     */
    enhanceAllForms() {
        // 文字数カウンター
        this.addCharacterCounters();
        
        // プレースホルダーアニメーション
        this.addPlaceholderAnimations();
        
        // フォーカスインジケーター
        this.addFocusIndicators();
    }
    
    /**
     * 文字数カウンターを追加
     */
    addCharacterCounters() {
        const textareas = selectAll('textarea[maxlength]');
        
        textareas.forEach(textarea => {
            const maxLength = parseInt(textarea.getAttribute('maxlength'));
            const counter = document.createElement('span');
            counter.className = 'form__counter';
            
            const updateCounter = () => {
                const currentLength = textarea.value.length;
                counter.textContent = `${currentLength}/${maxLength}`;
                counter.className = `form__counter ${currentLength > maxLength * 0.9 ? 'form__counter--warning' : ''}`;
            };
            
            textarea.addEventListener('input', updateCounter);
            textarea.parentNode.appendChild(counter);
            updateCounter();
        });
    }
    
    /**
     * プレースホルダーアニメーションを追加
     */
    addPlaceholderAnimations() {
        const inputs = selectAll('input[placeholder], textarea[placeholder]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form__group');
            if (!formGroup) return;
            
            const label = formGroup.querySelector('label');
            if (!label) return;
            
            const updateLabelState = () => {
                if (input.value || input === document.activeElement) {
                    addClass(formGroup, 'form__group--focused');
                } else {
                    removeClass(formGroup, 'form__group--focused');
                }
            };
            
            input.addEventListener('focus', updateLabelState);
            input.addEventListener('blur', updateLabelState);
            input.addEventListener('input', updateLabelState);
            
            // 初期状態を設定
            updateLabelState();
        });
    }
    
    /**
     * フォーカスインジケーターを追加
     */
    addFocusIndicators() {
        const formElements = selectAll('input, textarea, select');
        
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                addClass(element.closest('.form__group'), 'form__group--focused');
            });
            
            element.addEventListener('blur', () => {
                if (!element.value) {
                    removeClass(element.closest('.form__group'), 'form__group--focused');
                }
            });
        });
    }
    
    /**
     * フォームをリセット
     * @param {string} formId - フォームID
     */
    resetForm(formId) {
        const validator = this.forms.get(formId);
        if (validator && validator.form) {
            validator.form.reset();
            // エラー状態をクリア
            const errorGroups = validator.form.querySelectorAll('.form__group--error');
            errorGroups.forEach(group => {
                removeClass(group, 'form__group--error');
                const errorElement = group.querySelector('.form__error');
                if (errorElement) {
                    errorElement.remove();
                }
            });
        }
    }
    
    /**
     * フォームデータを取得
     * @param {string} formId - フォームID
     * @returns {Object} フォームデータ
     */
    getFormData(formId) {
        const validator = this.forms.get(formId);
        if (validator && validator.form) {
            const formData = new FormData(validator.form);
            return Object.fromEntries(formData.entries());
        }
        return {};
    }
}

// エクスポート
export { FormValidator, FormHandler }; 