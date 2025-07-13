/*==================== MAIN APPLICATION ====================*/

// モジュールのインポート
import { Navigation } from './js/navigation.js';
import { ScrollAnimations, SkillsAccordion } from './js/animations.js';
import { FormHandler } from './js/forms.js';
import { 
    select, 
    selectAll, 
    addClass, 
    removeClass, 
    showToast,
    isElementInViewport,
    scrollToElement 
} from './js/utils.js';

/**
 * アプリケーションメインクラス
 */
class PortfolioApp {
    constructor() {
        this.components = {};
        this.isLoaded = false;
        this.init();
    }
    
    /**
     * アプリケーション初期化
     */
    async init() {
        try {
            // DOMが読み込まれるまで待機
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('アプリケーションの初期化に失敗しました:', error);
        }
    }
    
    /**
     * アプリケーション初期化処理
     */
    initializeApp() {
        console.log('🚀 ポートフォリオアプリケーションを開始しています...');
        
        // パフォーマンス測定開始
        const startTime = performance.now();
        
        // 基本機能の初期化
        this.initializeCore();
        
        // コンポーネントの初期化
        this.initializeComponents();
        
        // 追加機能の初期化
        this.initializeFeatures();
        
        // 初期化完了
        this.isLoaded = true;
        const endTime = performance.now();
        
        console.log(`✅ アプリケーション初期化完了 (${Math.round(endTime - startTime)}ms)`);
        
        // 初期化完了イベントを発火
        this.dispatchLoadedEvent();
    }
    
    /**
     * コア機能の初期化
     */
    initializeCore() {
        // ナビゲーション
        this.components.navigation = new Navigation();
        
        // スクロールアニメーション
        this.components.animations = new ScrollAnimations();
        
        // スキルアコーディオン（HTMLで直接実装済みのため無効化）
        // this.components.skillsAccordion = new SkillsAccordion();
        
        // フォームハンドラー
        this.components.forms = new FormHandler();
    }
    
    /**
     * コンポーネントの初期化
     */
    initializeComponents() {
        // スキルプログレスバー
        this.initializeSkillBars();
        
        // カウンターアニメーション
        this.initializeCounters();
        
        // パララックス効果
        this.initializeParallax();
        
        // 画像遅延読み込み
        this.initializeLazyLoading();
        
        // スクロールトップボタン
        this.initializeScrollTop();
    }
    
    /**
     * 追加機能の初期化
     */
    initializeFeatures() {
        // テーマ切り替え
        this.initializeThemeToggle();
        
        // キーボードナビゲーション
        this.initializeKeyboardNavigation();
        
        // タッチジェスチャー
        this.initializeTouchGestures();
        
        // パフォーマンス監視
        this.initializePerformanceMonitoring();
    }
    
    /**
     * スキルプログレスバーの初期化
     */
    initializeSkillBars() {
        const skillBars = selectAll('.skills__percentage');
        
        if (skillBars.length === 0) return;
        
        // Intersection Observer for skill animations
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.dataset.percentage || '0';
                    
                    // アニメーション実行
                    setTimeout(() => {
                        bar.style.width = percentage + '%';
                        addClass(bar, 'animated');
                    }, 200);
                    
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            skillObserver.observe(bar);
        });
    }
    
    /**
     * カウンターアニメーションの初期化
     */
    initializeCounters() {
        const counters = selectAll('[data-counter]');
        
        if (counters.length === 0) return;
        
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.counter);
            const duration = parseInt(element.dataset.duration) || 2000;
            const start = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // イージング関数
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (target - start) * easeOutQuart);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    /**
     * パララックス効果の初期化
     */
    initializeParallax() {
        const parallaxElements = selectAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    /**
     * 画像遅延読み込みの初期化
     */
    initializeLazyLoading() {
        const lazyImages = selectAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    /**
     * スクロールトップボタンの初期化
     */
    initializeScrollTop() {
        const scrollTopBtn = select('.scroll-top');
        
        if (!scrollTopBtn) return;
        
        let isVisible = false;
        
        const toggleScrollTop = () => {
            const shouldShow = window.pageYOffset > 500;
            
            if (shouldShow && !isVisible) {
                addClass(scrollTopBtn, 'show-scroll');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                removeClass(scrollTopBtn, 'show-scroll');
                isVisible = false;
            }
        };
        
        const handleClick = (e) => {
            e.preventDefault();
            scrollToElement(document.body, 800);
        };
        
        window.addEventListener('scroll', toggleScrollTop, { passive: true });
        scrollTopBtn.addEventListener('click', handleClick);
    }
    
    /**
     * テーマ切り替えの初期化
     */
    initializeThemeToggle() {
        const themeToggle = select('[data-theme-toggle]');
        
        if (!themeToggle) return;
        
        // 保存されたテーマを復元
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const toggleTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            // アイコンの更新
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        };
        
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    /**
     * キーボードナビゲーションの初期化
     */
    initializeKeyboardNavigation() {
        const focusableElements = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            // Escキーでモーダルを閉じる
            if (e.key === 'Escape') {
                const openModal = select('.modal.show');
                if (openModal) {
                    removeClass(openModal, 'show');
                }
                
                const openMenu = select('.nav__menu.show-menu');
                if (openMenu) {
                    removeClass(openMenu, 'show-menu');
                }
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                const focusableItems = Array.from(document.querySelectorAll(focusableElements))
                    .filter(item => !item.hasAttribute('disabled') && item.offsetParent !== null);
                
                const currentIndex = focusableItems.indexOf(document.activeElement);
                
                if (e.shiftKey) {
                    // Shift + Tab (backward)
                    if (currentIndex <= 0) {
                        e.preventDefault();
                        focusableItems[focusableItems.length - 1].focus();
                    }
                } else {
                    // Tab (forward)
                    if (currentIndex >= focusableItems.length - 1) {
                        e.preventDefault();
                        focusableItems[0].focus();
                    }
                }
            }
        });
    }
    
    /**
     * タッチジェスチャーの初期化
     */
    initializeTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;
            
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                // 水平スワイプ
                if (deltaX > 0) {
                    // 左スワイプ
                    this.handleSwipeLeft();
                } else {
                    // 右スワイプ
                    this.handleSwipeRight();
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }
    
    /**
     * パフォーマンス監視の初期化
     */
    initializePerformanceMonitoring() {
        // Core Web Vitals monitoring
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
        
        // Memory usage monitoring (development only)
        if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('Memory usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                });
            }, 30000);
        }
    }
    
    /**
     * 左スワイプハンドラー
     */
    handleSwipeLeft() {
        // 次のセクションに移動
        const currentSection = select('section.active') || select('section');
        if (currentSection) {
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.tagName === 'SECTION') {
                scrollToElement(nextSection);
            }
        }
    }
    
    /**
     * 右スワイプハンドラー
     */
    handleSwipeRight() {
        // 前のセクションに移動
        const currentSection = select('section.active') || select('section');
        if (currentSection) {
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.tagName === 'SECTION') {
                scrollToElement(prevSection);
            }
        }
    }
    
    /**
     * 初期化完了イベントを発火
     */
    dispatchLoadedEvent() {
        const event = new CustomEvent('portfolioLoaded', {
            detail: { app: this }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * コンポーネントを取得
     * @param {string} name - コンポーネント名
     * @returns {Object} コンポーネントインスタンス
     */
    getComponent(name) {
        return this.components[name];
    }
    
    /**
     * アプリケーションが読み込み済みかチェック
     * @returns {boolean} 読み込み状態
     */
    isReady() {
        return this.isLoaded;
    }
}

// アプリケーションインスタンスを作成
const app = new PortfolioApp();

// グローバルアクセス用
window.PortfolioApp = app;

// デバッグ用
if (process.env.NODE_ENV === 'development') {
    window.app = app;
    console.log('🔧 デバッグモード: window.app でアプリケーションにアクセスできます');
}

// モジュールエクスポート
export default app; 