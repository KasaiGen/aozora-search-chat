# 青空文庫検索システム

青空文庫の作品を検索できるチャット風のWebアプリケーションです。

## 機能

- 作品名または作者名で検索
- チャット風のUIで検索結果を表示
- 作品の詳細情報を表示

## 技術スタック

### バックエンド
- Node.js + Express
- MongoDB
- 青空文庫データのインポート機能

### フロントエンド
- React + TypeScript
- Tailwind CSS
- Vite

## セットアップ

### 1. 依存関係のインストール

まず、ルートディレクトリで依存関係をインストール：

```bash
npm install
```

次に、バックエンドとフロントエンドの依存関係をインストール：

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

または、一括でインストール：

```bash
npm run install:all
```

**注意**: TypeScriptのリントエラーが表示される場合は、上記のコマンドで依存関係をインストールしてください。

### 2. 環境変数の設定

`backend/.env` ファイルを作成：

**DockerでMongoDBを起動した場合（認証あり）**:
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/aozora?authSource=admin
PORT=3001
```

**認証なしでMongoDBを起動した場合**:
```env
MONGODB_URI=mongodb://localhost:27017/aozora
PORT=3001
```

**注意**: Dockerコンテナに認証情報が設定されている場合は、上記の認証ありの形式を使用してください。認証情報はコンテナの環境変数で確認できます：
```bash
docker inspect aozora-mongodb | grep -A 5 "Env"
```

### 3. MongoDBの起動

MongoDBを起動する方法は、インストール方法によって異なります：

#### Homebrewでインストールした場合（macOS）

**注意**: `mongodb-community`フォーミュラは現在利用できない場合があります。その場合は、Dockerを使用することを推奨します。

```bash
# MongoDB Tapを追加（初回のみ）
brew tap mongodb/brew

# MongoDBをインストール
brew install mongodb-community

# MongoDBを起動
brew services start mongodb-community

# または、一度だけ起動（ターミナルを閉じると停止）
mongod --config /usr/local/etc/mongod.conf
```

#### Dockerを使用する場合（推奨・最も簡単）

**前提条件**: Docker Desktopがインストールされ、起動している必要があります。

```bash
# 1. Docker Desktopを起動（まだ起動していない場合）
open -a Docker

# 2. MongoDBコンテナを起動（初回のみ）
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. 既にコンテナが存在する場合は、起動のみ
docker start mongodb

# 4. コンテナの状態を確認
docker ps | grep mongodb
```

**停止する場合**:
```bash
docker stop mongodb
```

**削除する場合**:
```bash
docker stop mongodb
docker rm mongodb
```

#### MongoDB Atlas（クラウド）を使用する場合

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)でアカウントを作成
2. クラスターを作成
3. 接続文字列を取得
4. `backend/.env` の `MONGODB_URI` をAtlasの接続文字列に変更

#### その他の方法

- **Windows**: サービスとしてインストールされている場合は、自動的に起動します
- **Linux**: `sudo systemctl start mongod` または `sudo service mongod start`

**確認方法**:
```bash
# MongoDBが起動しているか確認
mongosh --eval "db.adminCommand('ping')"
# または
mongo --eval "db.adminCommand('ping')"
```

正常に起動している場合、`{ ok: 1 }` が返されます。

### 4. データのインポート

```bash
cd backend
npm run import-data
```

これにより、サンプルデータ（太宰治、夏目漱石、芥川龍之介の作品など）がMongoDBに投入されます。

### 5. 開発サーバーの起動

```bash
npm run dev
```

バックエンド: http://localhost:3001
フロントエンド: http://localhost:5173

## 使用方法

1. ブラウザでフロントエンドにアクセス
2. チャット画面で「どんな情報から調べたいかを教えて(作品名・作者etc)」というメッセージが表示されます
3. 作品名または作者名を入力して検索
4. 検索結果がチャット形式で表示されます

