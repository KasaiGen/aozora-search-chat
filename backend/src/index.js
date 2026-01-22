import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import { searchBooks, searchAuthors, getBookById } from './routes/search.js';

dotenv.config();

const app = express();
// NOTE: 3001 は他プロセス（Docker等）と衝突しやすいので、デフォルトは 3002 にする
// 環境変数 PORT があればそちらを優先
const PORT = process.env.PORT || 3002;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース接続
connectDB();

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 検索API
app.get('/api/search/books', searchBooks);
app.get('/api/search/authors', searchAuthors);
app.get('/api/books/:id', getBookById);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

