import dotenv from 'dotenv';
import { connectDB, getDB, closeDB } from '../db/connection.js';

dotenv.config();

async function showBookStructure() {
  try {
    const db = getDB();
    
    // 1件の作品データを取得
    const book = await db.collection('books').findOne({});
    
    if (!book) {
      console.log('作品データが見つかりませんでした');
      return;
    }
    
    console.log('\n📚 作品情報の構造:');
    console.log('='.repeat(60));
    console.log('\n実際のデータ例:');
    console.log(JSON.stringify(book, null, 2));
    
    console.log('\n\n📋 フィールド一覧:');
    console.log('='.repeat(60));
    Object.keys(book).forEach((key, index) => {
      const value = book[key];
      const type = value === null ? 'null' : typeof value;
      const preview = typeof value === 'string' && value.length > 50 
        ? value.substring(0, 50) + '...' 
        : value;
      
      console.log(`${index + 1}. ${key}`);
      console.log(`   型: ${type}`);
      console.log(`   値: ${preview}`);
      console.log('');
    });
    
    // 統計情報
    console.log('\n📊 統計情報:');
    console.log('='.repeat(60));
    const totalBooks = await db.collection('books').countDocuments();
    const booksWithAuthor = await db.collection('books').countDocuments({ author: { $exists: true, $ne: '' } });
    const booksWithTitleYomi = await db.collection('books').countDocuments({ title_yomi: { $exists: true, $ne: '' } });
    const booksWithSubtitle = await db.collection('books').countDocuments({ subtitle: { $exists: true, $ne: '' } });
    
    console.log(`総作品数: ${totalBooks}件`);
    console.log(`作者情報あり: ${booksWithAuthor}件`);
    console.log(`タイトル読みあり: ${booksWithTitleYomi}件`);
    console.log(`サブタイトルあり: ${booksWithSubtitle}件`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

async function main() {
  try {
    await connectDB();
    await showBookStructure();
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

main();

