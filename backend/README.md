# バックエンド

青空文庫検索システムのバックエンドAPIサーバーです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成：

```env
MONGODB_URI=mongodb://localhost:27017/aozora
PORT=3001
```

### 3. MongoDBの起動

MongoDBを起動してください。

### 4. データのインポート

```bash
npm run import-data
```

これにより、サンプルデータがMongoDBに投入されます。

### 5. サーバーの起動

```bash
npm run dev
```

サーバーは http://localhost:3002 で起動します。

## APIエンドポイント

### 作品検索

```
GET /api/search/books?q={検索クエリ}
```

パラメータ:
- `q`: 検索クエリ（作品名または作者名）

### 作者検索

```
GET /api/search/authors?q={検索クエリ}
```

パラメータ:
- `q`: 検索クエリ（作者名）

### 作品詳細取得

```
GET /api/books/{book_id}
```

## データ構造

### books コレクション

```javascript
{
  book_id: string,
  title: string,
  author: string,
  author_id: string,
  card_url: string,
  text_url: string,
  html_url: string
}
```

### persons コレクション

```javascript
{
  person_id: string,
  name: string,
  name_yomi: string,
  birth_date: string,
  death_date: string
}
```

## 実際の青空文庫データのインポート

現在はサンプルデータを使用していますが、実際の青空文庫のCSVデータをインポートするには：

1. 青空文庫のサイトからCSVファイルをダウンロード
2. `importData.js` を修正してCSVパース処理を追加
3. データをMongoDBに投入

詳細は [青空文庫のデータ構造について](https://qiita.com/ksato9700/items/626cc82c007ba8337034) を参照してください。

