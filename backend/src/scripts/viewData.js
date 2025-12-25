import dotenv from 'dotenv';
import { connectDB, getDB, closeDB } from '../db/connection.js';

dotenv.config();

async function viewBooks() {
    try {
        const db = getDB();
        const books = await db.collection('books').find({}).toArray();
        
        console.log('\n作品データ:');
        console.log('='.repeat(50));
        books.forEach((book, index) => {
        console.log(`\n${index + 1}. ${book.title}`);
        console.log(`   作者: ${book.author}`);
        console.log(`   ID: ${book.book_id}`);
        });
        console.log(`\n合計: ${books.length}件`);
    } catch (error) {
        console.error('作品データ取得エラー:', error);
    }
}

async function viewPersons() {
    try {
        const db = getDB();
        const persons = await db.collection('persons').find({}).toArray();
        
        console.log('\n人物データ:');
        console.log('='.repeat(50));
        persons.forEach((person, index) => {
        console.log(`\n${index + 1}. ${person.name}`);
        if (person.name_yomi) {
            console.log(`   読み: ${person.name_yomi}`);
        }
        if (person.birth_date) {
            console.log(`   生年月日: ${person.birth_date}`);
        }
        if (person.death_date) {
            console.log(`   没年月日: ${person.death_date}`);
        }
        });
        console.log(`\n合計: ${persons.length}件`);
    } catch (error) {
        console.error('人物データ取得エラー:', error);
    }
}

async function viewCollections() {
    try {
        const db = getDB();
        const collections = await db.listCollections().toArray();
        
        console.log('\nコレクション一覧:');
        console.log('='.repeat(50));
        for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count}件`);
        }
    } catch (error) {
        console.error('コレクション一覧取得エラー:', error);
    }
}

async function main() {
    try {
        await connectDB();
        
        await viewCollections();
        await viewBooks();
        await viewPersons();
        
    } catch (error) {
        console.error('エラー:', error);
        process.exit(1);
    } finally {
        await closeDB();
    }
}

main();

