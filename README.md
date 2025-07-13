# Portfolio Website

## チームメンバー

・山本彩乃
・野崎大翔
・古山玲菜

### ファイル構造
```
portfolio/
├── index.html          # メインページ
├── person1.html        # 山本彩乃の詳細ページ
├── person2.html        # 野崎大翔の詳細ページ
├── person3.html        # 古山玲菜の詳細ページ
├── css/
│   ├── variables.css   # CSS変数定義
│   ├── base.css        # 基本スタイル
│   ├── components.css  # コンポーネントスタイル
│   ├── layout.css      # レイアウトスタイル
│   └── animations.css  # アニメーション
├── js/
│   └── navigation.js   # ナビゲーション機能
└── image/              # 画像ファイル
```

### 開発ルール

#### 基本的なGitコマンド（初心者向け）

##### 1. リポジトリの初期設定
```bash
# リポジトリをクローン（初回のみ）
git clone https://github.com/literacy-class/portfolio.git
cd portfolio

# リモートリポジトリの確認
git remote -v
```

##### 2. 日常的な作業フロー
```bash
# 最新の変更を取得
git pull origin main

# 変更したファイルの確認
git status

# 変更したファイルをステージング
git add ファイル名
git add .  # すべての変更をステージング

# 変更をコミット
git commit -m "変更内容の説明"

# リモートにプッシュ
git push origin main
```

##### 3. よく使うコマンド
```bash
# 変更履歴の確認
git log --oneline

# 特定のファイルの変更内容確認
git diff ファイル名

# 変更を取り消す（ステージング前）
git restore ファイル名

# ステージングを取り消す
git restore --staged ファイル名

# ブランチの確認
git branch

# 新しいブランチを作成
git checkout -b feature/新機能名

# ブランチを切り替え
git checkout ブランチ名
```

##### 4. トラブルシューティング
```bash
# コンフリクトが発生した場合
git status  # コンフリクトファイルを確認
# ファイルを編集してコンフリクトを解決
git add .
git commit -m "Resolve merge conflicts"

# プッシュが拒否された場合
git pull origin main  # 最新の変更を取得
git push origin main  # 再度プッシュ
```

#### ブランチ戦略
- `main`: 本番環境用
- `develop`: 開発用
- `feature/機能名`: 新機能開発用

### デプロイメント

#### GitHub Pages
- リポジトリ: https://github.com/literacy-class/portfolio.git
- 公開URL: literacy-classportfolio030.com
- 自動デプロイ: mainブランチへのプッシュで自動更新

### 技術スタック
- HTML5
- CSS3 (カスタムプロパティ、Flexbox、Grid)
- Vanilla JavaScript
- GitHub Pages

### 今後の改善予定
- [ ] パフォーマンス最適化
- [ ] SEO対策の強化
- [ ] アクセシビリティの向上
- [ ] モバイル体験の改善
- [ ] アニメーションの追加

---

**注意**: このREADMEは定期的に更新し、最新の情報を維持してください。