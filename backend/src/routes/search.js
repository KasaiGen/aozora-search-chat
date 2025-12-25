import { getDB } from '../db/connection.js';

// 作品検索
export async function searchBooks(req, res) {
  try {
    const db = getDB();
    const { q, title, author } = req.query;
    
    let query = {};
    
    if (q) {
      // 汎用検索: 作品名または作者名で検索
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      };
    } else {
      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }
      if (author) {
        query.author = { $regex: author, $options: 'i' };
      }
    }
    
    const books = await db.collection('books')
      .find(query)
      .limit(20)
      .toArray();
    
    res.json({ books });
  } catch (error) {
    console.error('作品検索エラー:', error);
    res.status(500).json({ error: '検索中にエラーが発生しました' });
  }
}

// 作者検索
export async function searchAuthors(req, res) {
  try {
    const db = getDB();
    const { q, name } = req.query;
    
    const searchTerm = q || name || '';
    
    const authors = await db.collection('persons')
      .find({
        name: { $regex: searchTerm, $options: 'i' }
      })
      .limit(20)
      .toArray();
    
    res.json({ authors });
  } catch (error) {
    console.error('作者検索エラー:', error);
    res.status(500).json({ error: '検索中にエラーが発生しました' });
  }
}

// 作品詳細取得
export async function getBookById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const book = await db.collection('books').findOne({ book_id: id });
    
    if (!book) {
      return res.status(404).json({ error: '作品が見つかりません' });
    }
    
    res.json({ book });
  } catch (error) {
    console.error('作品取得エラー:', error);
    res.status(500).json({ error: '作品取得中にエラーが発生しました' });
  }
}

