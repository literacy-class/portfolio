/*==================== NAVIGATION MODULE ====================*/

import { select, selectAll, addClass, removeClass, toggleClass, scrollToElement, throttle } from './utils.js';

/**
 * ナビゲーションクラス
 */
class Navigation {
    constructor() {
        this.header = select('#header');
        this.nav = select('.nav');
        this.navMenu = select('.nav__menu');
        this.navToggle = select('.nav__toggle');
        this.navClose = select('.nav__close');
        this.navLinks = selectAll('.nav__link');
        this.sections = selectAll('section[id]');
        
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        this.bindEvents();
        this.setActiveLink();
        this.handleScroll();
    }
    
    /**
     * イベントハンドラーを設定
     */
    bindEvents() {
        // メニュートグル
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.showMenu());
        }
        
        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.hideMenu());
        }
        
        // ナビゲーションリンク
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });
        
        // スクロール時の処理
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
            this.setActiveLink();
        }, 100));
    }
    
    /**
     * メニューを表示
     */
    showMenu() {
        if (this.navMenu) {
            addClass(this.navMenu, 'show-menu');
        }
    }
    
    /**
     * メニューを非表示
     */
    hideMenu() {
        if (this.navMenu) {
            removeClass(this.navMenu, 'show-menu');
        }
    }
    
    /**
     * ナビゲーションリンククリック処理
     * @param {Event} e - イベントオブジェクト
     */
    handleLinkClick(e) {
        e.preventDefault();
        
        const href = e.target.getAttribute('href');
        if (!href || href === '#') return;
        
        // 同ページ内リンクの場合
        if (href.startsWith('#')) {
            const target = select(href);
            if (target) {
                const headerHeight = this.header ? this.header.offsetHeight : 0;
                scrollToElement(target, headerHeight + 20);
            }
        } else {
            // 外部リンクの場合
            window.location.href = href;
        }
        
        // モバイルメニューを閉じる
        this.hideMenu();
    }
    
    /**
     * スクロール時の処理
     */
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // ヘッダーの背景色変更
        if (this.header) {
            if (scrollY >= 80) {
                addClass(this.header, 'scroll-header');
            } else {
                removeClass(this.header, 'scroll-header');
            }
        }
    }
    
    /**
     * アクティブリンクを設定
     */
    setActiveLink() {
        const scrollY = window.pageYOffset;
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.getBoundingClientRect().top + scrollY - headerHeight - 200;
            const sectionId = section.getAttribute('id');
            const navLink = select(`.nav__menu a[href*="${sectionId}"]`);
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                if (navLink) {
                    // 全てのアクティブクラスを削除
                    this.navLinks.forEach(link => removeClass(link, 'active-link'));
                    // 現在のリンクにアクティブクラスを追加
                    addClass(navLink, 'active-link');
                }
            }
        });
    }
}

/**
 * スクロールトゥトップボタンクラス
 */
class ScrollToTop {
    constructor() {
        this.button = select('.scrolltop');
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        if (!this.button) {
            this.createButton();
        }
        this.bindEvents();
        this.handleScroll();
    }
    
    /**
     * ボタンを作成
     */
    createButton() {
        this.button = document.createElement('div');
        this.button.className = 'scrolltop';
        this.button.innerHTML = '<i class="fas fa-angle-up scrolltop__icon"></i>';
        document.body.appendChild(this.button);
    }
    
    /**
     * イベントハンドラーを設定
     */
    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                scrollToElement(document.body, 0);
            });
        }
        
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 100));
    }
    
    /**
     * スクロール時の処理
     */
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (this.button) {
            if (scrollY >= 560) {
                addClass(this.button, 'show-scroll');
            } else {
                removeClass(this.button, 'show-scroll');
            }
        }
    }
}

/**
 * パンくずリストクラス
 */
class Breadcrumb {
    constructor() {
        this.container = select('.breadcrumb');
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        if (this.container) {
            this.generateBreadcrumb();
        }
    }
    
    /**
     * パンくずリストを生成
     */
    generateBreadcrumb() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');
        
        let breadcrumbHTML = '<a href="/" class="breadcrumb__link">ホーム</a>';
        
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            const displayName = this.getDisplayName(segment);
            
            if (isLast) {
                breadcrumbHTML += ` <span class="breadcrumb__separator">/</span> <span class="breadcrumb__current">${displayName}</span>`;
            } else {
                breadcrumbHTML += ` <span class="breadcrumb__separator">/</span> <a href="${currentPath}" class="breadcrumb__link">${displayName}</a>`;
            }
        });
        
        this.container.innerHTML = breadcrumbHTML;
    }
    
    /**
     * セグメントの表示名を取得
     * @param {string} segment - パスセグメント
     * @returns {string} 表示名
     */
    getDisplayName(segment) {
        const displayNames = {
            'person1': '山本彩乃',
            'person2': '野崎大翔',
            'person3': '古山玲菜',
            'about': 'About',
            'skills': 'Skills',
            'projects': 'Projects',
            'contact': 'Contact'
        };
        
        return displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
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

/**
 * ページローダークラス
 */
class PageLoader {
    constructor() {
        this.loader = select('.page-loader');
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        if (!this.loader) {
            this.createLoader();
        }
        
        window.addEventListener('load', () => {
            this.hideLoader();
        });
    }
    
    /**
     * ローダーを作成
     */
    createLoader() {
        this.loader = document.createElement('div');
        this.loader.className = 'page-loader';
        this.loader.innerHTML = `
            <div class="loader">
                <div class="loader__spinner"></div>
                <p class="loader__text">読み込み中...</p>
            </div>
        `;
        document.body.appendChild(this.loader);
    }
    
    /**
     * ローダーを非表示
     */
    hideLoader() {
        if (this.loader) {
            addClass(this.loader, 'fade-out');
            setTimeout(() => {
                this.loader.remove();
            }, 500);
        }
    }
    
    /**
     * ローダーを表示
     */
    showLoader() {
        if (!this.loader) {
            this.createLoader();
        }
        removeClass(this.loader, 'fade-out');
    }
}

// エクスポート
export { Navigation, ScrollToTop, Breadcrumb, PageLoader, SkillsAccordion }; 