/*==================== ANIMATIONS MODULE ====================*/

import { select, selectAll, addClass, removeClass, throttle } from './utils.js';

/**
 * スクロールアニメーションクラス
 */
class ScrollAnimations {
    constructor() {
        this.animatedElements = selectAll('[data-animation]');
        this.observer = null;
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
    }
    
    /**
     * Intersection Observerを設定
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
        
        // 要素を監視対象に追加
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    /**
     * 要素をアニメーション
     * @param {Element} element - アニメーション対象要素
     */
    animateElement(element) {
        const animationType = element.getAttribute('data-animation');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            addClass(element, 'animate');
            addClass(element, `animate-${animationType}`);
        }, parseInt(delay));
        
        // 一度アニメーションした要素は監視から除外
        this.observer.unobserve(element);
    }
    
    /**
     * イベントハンドラーを設定
     */
    bindEvents() {
        // スクロール時のパララックス効果
        window.addEventListener('scroll', throttle(() => {
            this.handleParallax();
        }, 16)); // 60fps
    }
    
    /**
     * パララックス効果を処理
     */
    handleParallax() {
        const scrollY = window.pageYOffset;
        const parallaxElements = selectAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

/**
 * カウンターアニメーションクラス
 */
class CounterAnimation {
    constructor() {
        this.counters = selectAll('[data-counter]');
        this.observer = null;
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.setupObserver();
    }
    
    /**
     * オブザーバーを設定
     */
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, options);
        
        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }
    
    /**
     * カウンターアニメーション
     * @param {Element} element - カウンター要素
     */
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const suffix = element.getAttribute('data-suffix') || '';
        
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
        
        // 一度アニメーションした要素は監視から除外
        this.observer.unobserve(element);
    }
}

/**
 * スキルバーアニメーションクラス
 */
class SkillBarAnimation {
    constructor() {
        this.skillBars = selectAll('.skills__percentage');
        this.observer = null;
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.setupObserver();
    }
    
    /**
     * オブザーバーを設定
     */
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                }
            });
        }, options);
        
        this.skillBars.forEach(bar => {
            this.observer.observe(bar);
        });
    }
    
    /**
     * スキルバーアニメーション
     * @param {Element} element - スキルバー要素
     */
    animateSkillBar(element) {
        const percentage = element.getAttribute('data-percentage');
        
        // アニメーション開始
        element.style.width = `${percentage}%`;
        addClass(element, 'skills__percentage--animated');
        
        // 一度アニメーションした要素は監視から除外
        this.observer.unobserve(element);
    }
}

/**
 * タイピングアニメーションクラス
 */
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pause: 2000,
            loop: true,
            cursor: true,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.timer = null;
        
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        if (this.options.cursor) {
            this.element.classList.add('typing-cursor');
        }
        this.type();
    }
    
    /**
     * タイピング処理
     */
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }
        
        this.element.textContent = currentText.substring(0, this.currentCharIndex);
        
        let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            // 完了時の一時停止
            speed = this.options.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            
            if (!this.options.loop && this.currentTextIndex === 0) {
                return; // ループしない場合は終了
            }
        }
        
        this.timer = setTimeout(() => this.type(), speed);
    }
    
    /**
     * アニメーションを停止
     */
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    
    /**
     * アニメーションを再開
     */
    restart() {
        this.stop();
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.type();
    }
}

/**
 * モーダルアニメーションクラス
 */
class ModalAnimation {
    constructor() {
        this.modals = selectAll('.modal');
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
        // モーダル開く
        selectAll('[data-modal-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-target');
                const modal = select(targetId);
                if (modal) {
                    this.openModal(modal);
                }
            });
        });
        
        // モーダル閉じる
        selectAll('[data-modal-close]').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // オーバーレイクリックで閉じる
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = select('.modal.modal--open');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }
    
    /**
     * モーダルを開く
     * @param {Element} modal - モーダル要素
     */
    openModal(modal) {
        addClass(modal, 'modal--open');
        addClass(document.body, 'modal-open');
        
        // アニメーション後にフォーカス
        setTimeout(() => {
            const firstInput = modal.querySelector('input, button, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }
    
    /**
     * モーダルを閉じる
     * @param {Element} modal - モーダル要素
     */
    closeModal(modal) {
        removeClass(modal, 'modal--open');
        removeClass(document.body, 'modal-open');
    }
}

/**
 * ツールチップアニメーションクラス
 */
class TooltipAnimation {
    constructor() {
        this.tooltips = selectAll('[data-tooltip]');
        this.activeTooltip = null;
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
        this.tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            element.addEventListener('focus', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('blur', () => {
                this.hideTooltip();
            });
        });
    }
    
    /**
     * ツールチップを表示
     * @param {Element} element - ツールチップ対象要素
     */
    showTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        
        if (!text) return;
        
        // 既存のツールチップを削除
        this.hideTooltip();
        
        // ツールチップ要素を作成
        this.activeTooltip = document.createElement('div');
        this.activeTooltip.className = `tooltip tooltip--${position}`;
        this.activeTooltip.textContent = text;
        
        document.body.appendChild(this.activeTooltip);
        
        // 位置を計算
        this.positionTooltip(element, this.activeTooltip, position);
        
        // アニメーションで表示
        setTimeout(() => {
            addClass(this.activeTooltip, 'tooltip--visible');
        }, 10);
    }
    
    /**
     * ツールチップを非表示
     */
    hideTooltip() {
        if (this.activeTooltip) {
            this.activeTooltip.remove();
            this.activeTooltip = null;
        }
    }
    
    /**
     * ツールチップの位置を設定
     * @param {Element} element - 対象要素
     * @param {Element} tooltip - ツールチップ要素
     * @param {string} position - 位置
     */
    positionTooltip(element, tooltip, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 10;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 10;
                break;
            default:
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }
        
        tooltip.style.top = `${top + window.scrollY}px`;
        tooltip.style.left = `${left + window.scrollX}px`;
    }
}

/**
 * スキルアコーディオンクラス
 */
class SkillsAccordion {
    constructor() {
        this.skillsHeaders = selectAll('.skills__header');
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
        this.skillsHeaders.forEach(header => {
            header.addEventListener('click', () => this.toggleSkills(header));
        });
    }
    
    /**
     * スキルセクションの開閉
     * @param {HTMLElement} header - クリックされたヘッダー要素
     */
    toggleSkills(header) {
        const skillsContent = header.parentElement;
        const arrow = header.querySelector('.skills__arrow');
        
        // 現在の状態を確認
        const isOpen = skillsContent.classList.contains('skills__open');
        
        // 他のスキルセクションを閉じる
        this.closeAllSkills();
        
        // クリックされたセクションを開く/閉じる
        if (!isOpen) {
            addClass(skillsContent, 'skills__open');
            removeClass(skillsContent, 'skills__close');
            if (arrow) {
                arrow.style.transform = 'rotate(180deg)';
            }
        } else {
            removeClass(skillsContent, 'skills__open');
            addClass(skillsContent, 'skills__close');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }
    
    /**
     * すべてのスキルセクションを閉じる
     */
    closeAllSkills() {
        const allSkillsContent = selectAll('.skills__content');
        const allArrows = selectAll('.skills__arrow');
        
        allSkillsContent.forEach(content => {
            removeClass(content, 'skills__open');
            addClass(content, 'skills__close');
        });
        
        allArrows.forEach(arrow => {
            arrow.style.transform = 'rotate(0deg)';
        });
    }
}

// エクスポート
export { 
    ScrollAnimations, 
    CounterAnimation, 
    SkillBarAnimation, 
    TypingAnimation, 
    ModalAnimation, 
    TooltipAnimation,
    SkillsAccordion
}; 