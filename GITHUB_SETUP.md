# GitHubへのアップロード手順

## 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例: `aozora-search-system`）
4. 説明を追加（オプション）
5. Public または Private を選択
6. **「Initialize this repository with a README」はチェックしない**
7. 「Create repository」をクリック

## 2. リモートリポジトリを追加してプッシュ

GitHubでリポジトリを作成したら、表示されるURLを使用して以下のコマンドを実行：

```bash
# リモートリポジトリを追加（YOUR_USERNAMEとREPO_NAMEを置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/aozora-search-system.git

# またはSSHを使用する場合
git remote add origin git@github.com:YOUR_USERNAME/aozora-search-system.git

# メインブランチを設定
git branch -M main

# プッシュ
git push -u origin main
```

## 注意事項

- `.env`ファイルは`.gitignore`に含まれているため、コミットされません
- `node_modules`も除外されています
- 初回プッシュ後、GitHubでリポジトリの内容を確認してください

