import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export async function connectDB() {
  try {
    // 認証情報が環境変数で指定されている場合は使用
    const username = process.env.MONGODB_USERNAME || 'admin';
    const password = process.env.MONGODB_PASSWORD || 'admin123';
    const host = process.env.MONGODB_HOST || 'localhost:27017';
    const database = process.env.MONGODB_DATABASE || 'aozora';
    
    // 認証情報を含むURIを構築
    const uri = process.env.MONGODB_URI || `mongodb://${username}:${password}@${host}/${database}?authSource=admin`;
    
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('MongoDBに接続しました');
    return db;
  } catch (error) {
    console.error('MongoDB接続エラー:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('データベースに接続されていません');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB接続を閉じました');
  }
}

