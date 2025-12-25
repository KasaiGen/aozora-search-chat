import dotenv from 'dotenv';
import { connectDB, getDB, closeDB } from '../db/connection.js';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import AdmZip from 'adm-zip';

dotenv.config();

// 青空文庫のCSVファイルURL（GitHubから取得）
const LIST_URL_BASE = 'https://github.com/aozorabunko/aozorabunko/raw/master/index_pages/';
const LIST_URL_PUB = 'list_person_all_extended_utf8.zip';

// CSVのカラム定義（db_importerのattrs.tsから）
const ATTRS = [
  'book_id',
  'title',
  'title_yomi',
  'title_sort',
  'subtitle',
  'subtitle_yomi',
  'original_title',
  'first_appearance',
  'ndc_code',
  'font_kana_type',
  'copyright',
  'release_date',
  'last_modified',
  'card_url',
  'person_id',
  'last_name',
  'first_name',
  'last_name_yomi',
  'first_name_yomi',
  'last_name_sort',
  'first_name_sort',
  'last_name_roman',
  'first_name_roman',
  'role',
  'date_of_birth',
  'date_of_death',
  'author_copyright',
  'base_book_1',
  'base_book_1_publisher',
  'base_book_1_1st_edition',
  'base_book_1_edition_input',
  'base_book_1_edition_proofing',
  'base_book_1_parent',
  'base_book_1_parent_publisher',
  'base_book_1_parent_1st_edition',
  'base_book_2',
  'base_book_2_publisher',
  'base_book_2_1st_edition',
  'base_book_2_edition_input',
  'base_book_2_edition_proofing',
  'base_book_2_parent',
  'base_book_2_parent_publisher',
  'base_book_2_parent_1st_edition',
  'input',
  'proofing',
  'text_url',
  'text_last_modified',
  'text_encoding',
  'text_charset',
  'text_updated',
  'html_url',
  'html_last_modified',
  'html_encoding',
  'html_charset',
  'html_updated'
];

const ROLE_MAP = {
  '校訂者': 'revisers',
  '編者': 'editors',
  '翻訳者': 'translators',
  '著者': 'authors'
};

// ZIPファイルをダウンロードしてCSVを取得
async function getCSVData() {
  try {
    console.log('青空文庫のCSVデータをダウンロード中...');
    const url = LIST_URL_BASE + LIST_URL_PUB;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    
    console.log('ZIPファイルを解凍中...');
    const zip = new AdmZip(response.data);
    const entries = zip.getEntries();
    
    if (entries.length === 0) {
      throw new Error('ZIPファイルが空です');
    }
    
    // 最初のCSVファイルを取得
    const csvEntry = entries.find(e => e.entryName.endsWith('.csv')) || entries[0];
    const csvText = zip.readFile(csvEntry).toString('utf-8');
    
    console.log(`CSVファイルを取得しました: ${csvEntry.entryName}`);
    return csvText;
  } catch (error) {
    console.error('CSVデータ取得エラー:', error.message);
    throw error;
  }
}

// データ型変換
function typeConversion(data) {
  return ATTRS.map((attr, i) => {
    const value = data[i];
    
    if (['copyright', 'author_copyright'].includes(attr)) {
      return value !== 'なし';
    } else if (['book_id', 'person_id', 'text_updated', 'html_updated'].includes(attr)) {
      return value === '' ? -1 : parseInt(value, 10);
    } else if (['release_date', 'last_modified', 'text_last_modified', 'html_last_modified'].includes(attr)) {
      return value === '' ? null : new Date(value);
    } else if (attr === 'role') {
      return ROLE_MAP[value] || value;
    } else {
      return value;
    }
  });
}

// CSVデータをパースして、booksとpersonsに分離
function parseCSVData(csvText) {
  console.log('CSVデータをパース中...');
  
  const records = parse(csvText, {
    from: 2, // ヘッダー行をスキップ
    skip_empty_lines: true
  });
  
  const booksMap = new Map();
  const personsMap = new Map();
  
  records.forEach((row) => {
    const data = typeConversion(row);
    const entry = {};
    ATTRS.forEach((attr, i) => {
      entry[attr] = data[i];
    });
    
    // 作品データを抽出
    const book = {
      book_id: entry.book_id?.toString() || '',
      title: entry.title || '',
      title_yomi: entry.title_yomi || '',
      subtitle: entry.subtitle || '',
      card_url: entry.card_url || '',
      text_url: entry.text_url || '',
      html_url: entry.html_url || '',
      release_date: entry.release_date,
      last_modified: entry.last_modified
    };
    
    // 人物データを抽出
    const person = {
      person_id: entry.person_id?.toString() || '',
      name: (entry.last_name || '') + (entry.first_name || ''),
      name_yomi: (entry.last_name_yomi || '') + (entry.first_name_yomi || ''),
      birth_date: entry.date_of_birth || '',
      death_date: entry.date_of_death || ''
    };
    
    const role = entry.role || 'authors';
    
    // 作品データをマージ（同じbook_idの場合は著者情報を追加）
    if (book.book_id && book.book_id !== '-1') {
      if (!booksMap.has(book.book_id)) {
        booksMap.set(book.book_id, { ...book, author: person.name, author_id: person.person_id });
      } else {
        // 著者が複数いる場合、最初の著者を優先
        const existingBook = booksMap.get(book.book_id);
        if (role === 'authors' && !existingBook.author) {
          existingBook.author = person.name;
          existingBook.author_id = person.person_id;
        }
      }
    }
    
    // 人物データを保存
    if (person.person_id && person.person_id !== '-1' && person.name) {
      if (!personsMap.has(person.person_id)) {
        personsMap.set(person.person_id, person);
      }
    }
  });
  
  return {
    books: Array.from(booksMap.values()),
    persons: Array.from(personsMap.values())
  };
}

// データベースにインポート
async function importToDB(books, persons, refresh = false) {
  try {
    const db = getDB();
    const booksCollection = db.collection('books');
    const personsCollection = db.collection('persons');
    
    if (refresh) {
      console.log('既存のデータを削除中...');
      await booksCollection.deleteMany({});
      await personsCollection.deleteMany({});
    }
    
    // 作品データをインポート
    if (books.length > 0) {
      console.log(`${books.length}件の作品データをインポート中...`);
      const bookOperations = books.map(book => ({
        updateOne: {
          filter: { book_id: book.book_id },
          update: { $set: book },
          upsert: true
        }
      }));
      
      const bookResult = await booksCollection.bulkWrite(bookOperations, { ordered: false });
      console.log(`作品データ: ${bookResult.upsertedCount}件追加, ${bookResult.modifiedCount}件更新`);
    }
    
    // 人物データをインポート
    if (persons.length > 0) {
      console.log(`${persons.length}件の人物データをインポート中...`);
      const personOperations = persons.map(person => ({
        updateOne: {
          filter: { person_id: person.person_id },
          update: { $set: person },
          upsert: true
        }
      }));
      
      const personResult = await personsCollection.bulkWrite(personOperations, { ordered: false });
      console.log(`人物データ: ${personResult.upsertedCount}件追加, ${personResult.modifiedCount}件更新`);
    }

    console.log('データインポートが完了しました！');
  } catch (error) {
    console.error('データインポートエラー:', error);
    throw error;
  }
}

async function main() {
  const refresh = process.argv.includes('--refresh') || process.argv.includes('-r');
  
  try {
    console.log('青空文庫データのインポートを開始します...');
    if (refresh) {
      console.log('既存のデータを全て削除してからインポートします');
    }
    
    await connectDB();
    
    // CSVデータを取得
    const csvText = await getCSVData();
    
    // CSVをパース
    const { books, persons } = parseCSVData(csvText);
    
    console.log(`\nパース結果:`);
    console.log(`- 作品数: ${books.length}件`);
    console.log(`- 人物数: ${persons.length}件\n`);
    
    // データベースにインポート
    await importToDB(books, persons, refresh);
    
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

main();

