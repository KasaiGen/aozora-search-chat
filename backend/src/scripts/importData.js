import dotenv from 'dotenv';
import { connectDB, getDB, closeDB } from '../db/connection.js';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

dotenv.config();

// 青空文庫のCSVファイルURL
const BOOKS_CSV_URL = 'https://www.aozora.gr.jp/index_pages/list_person_all_extended_utf8.zip';
const PERSONS_CSV_URL = 'https://www.aozora.gr.jp/index_pages/list_person_all_extended_utf8.zip';

// 簡易版: 直接CSVをダウンロードしてパース
async function downloadCSV(url) {
  try {
    const response = await axios.get(url, { responseType: 'text' });
    return response.data;
  } catch (error) {
    console.error('CSVダウンロードエラー:', error.message);
    throw error;
  }
}

async function importBooks() {
  try {
    console.log('作品データのインポートを開始します...');
    
    // 青空文庫の作品リストCSVを取得
    // 実際のURLは青空文庫のサイトから取得する必要があります
    // ここではサンプルデータを使用します
    
    const db = getDB();
    const booksCollection = db.collection('books');
    
    // サンプルデータ（実際の実装ではCSVから読み込む）
    // より多くのサンプルデータを追加
    const sampleBooks = [
      {
        book_id: '1',
        title: '走れメロス',
        author: '太宰治',
        author_id: '1',
        card_url: 'https://www.aozora.gr.jp/cards/000035/files/1567_14913.html',
        text_url: 'https://www.aozora.gr.jp/cards/000035/files/1567_ruby_14913.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000035/files/1567_14913.html'
      },
      {
        book_id: '2',
        title: 'こころ',
        author: '夏目漱石',
        author_id: '2',
        card_url: 'https://www.aozora.gr.jp/cards/000148/files/773_14941.html',
        text_url: 'https://www.aozora.gr.jp/cards/000148/files/773_ruby_14941.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000148/files/773_14941.html'
      },
      {
        book_id: '3',
        title: '人間失格',
        author: '太宰治',
        author_id: '1',
        card_url: 'https://www.aozora.gr.jp/cards/000035/files/301_14960.html',
        text_url: 'https://www.aozora.gr.jp/cards/000035/files/301_ruby_14960.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000035/files/301_14960.html'
      },
      {
        book_id: '4',
        title: '吾輩は猫である',
        author: '夏目漱石',
        author_id: '2',
        card_url: 'https://www.aozora.gr.jp/cards/000148/files/789_15247.html',
        text_url: 'https://www.aozora.gr.jp/cards/000148/files/789_ruby_15247.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000148/files/789_15247.html'
      },
      {
        book_id: '5',
        title: '羅生門',
        author: '芥川龍之介',
        author_id: '3',
        card_url: 'https://www.aozora.gr.jp/cards/000879/files/127_15260.html',
        text_url: 'https://www.aozora.gr.jp/cards/000879/files/127_ruby_15260.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000879/files/127_15260.html'
      },
      {
        book_id: '6',
        title: '蜘蛛の糸',
        author: '芥川龍之介',
        author_id: '3',
        card_url: 'https://www.aozora.gr.jp/cards/000879/files/92_12745.html',
        text_url: 'https://www.aozora.gr.jp/cards/000879/files/92_ruby_12745.zip',
        html_url: 'https://www.aozora.gr.jp/cards/000879/files/92_12745.html'
      }
    ];
    
    // 既存のデータをクリア
    await booksCollection.deleteMany({});
    
    // データを挿入
    if (sampleBooks.length > 0) {
      await booksCollection.insertMany(sampleBooks);
      console.log(`${sampleBooks.length}件の作品データをインポートしました`);
    }
    
    console.log('作品データのインポートが完了しました');
  } catch (error) {
    console.error('作品データインポートエラー:', error);
    throw error;
  }
}

async function importPersons() {
  try {
    console.log('人物データのインポートを開始します...');
    
    const db = getDB();
    const personsCollection = db.collection('persons');
    
    // サンプルデータ
    const samplePersons = [
      {
        person_id: '1',
        name: '太宰治',
        name_yomi: 'だざいおさむ',
        birth_date: '1909-06-19',
        death_date: '1948-06-13'
      },
      {
        person_id: '2',
        name: '夏目漱石',
        name_yomi: 'なつめそうせき',
        birth_date: '1867-02-09',
        death_date: '1916-12-09'
      },
      {
        person_id: '3',
        name: '芥川龍之介',
        name_yomi: 'あくたがわりゅうのすけ',
        birth_date: '1892-03-01',
        death_date: '1927-07-24'
      }
    ];
    
    // 既存のデータをクリア
    await personsCollection.deleteMany({});
    
    // データを挿入
    if (samplePersons.length > 0) {
      await personsCollection.insertMany(samplePersons);
      console.log(`${samplePersons.length}件の人物データをインポートしました`);
    }
    
    console.log('人物データのインポートが完了しました');
  } catch (error) {
    console.error('人物データインポートエラー:', error);
    throw error;
  }
}

// 実際の青空文庫CSVをパースする関数（実装例）
async function importFromAozoraCSV() {
  try {
    console.log('青空文庫のCSVデータを取得中...');
    
    // 注意: 実際の青空文庫のCSVファイルはZIP形式で配布されているため、
    // 解凍処理が必要です。ここでは簡易版として、手動でダウンロードした
    // CSVファイルを読み込む方法を想定しています。
    
    // 実際の実装では、以下のような処理が必要です：
    // 1. ZIPファイルをダウンロード
    // 2. ZIPを解凍
    // 3. CSVファイルをパース
    // 4. MongoDBに投入
    
    console.log('CSVインポート機能は実装中です。サンプルデータを使用します。');
    
  } catch (error) {
    console.error('CSVインポートエラー:', error);
  }
}

async function main() {
  try {
    await connectDB();
    
    await importBooks();
    await importPersons();
    
    console.log('すべてのデータインポートが完了しました');
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

main();

