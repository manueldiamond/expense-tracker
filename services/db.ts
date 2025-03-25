import { currentVersion } from '@/data';
import SQLite, { SQLiteDatabase } from 'expo-sqlite'

let db: SQLiteDatabase;

//setup scripts
const dbSetupScript = `
		PRAGMA journal_mode=WAL;
		PRAGMA foreign_keys=ON;

		CREATE TABLE IF NOT EXISTS categories(
			name TEXT PRIMARY KEY NOT NULL,
			color TEXT NOT NULL,
			type TEXT
		);

		CREATE TABLE IF NOT EXISTS transactions(
			id INTEGER PRIMARY KEY NOT NULL,
			amount INTEGER NOT NULL, 
			category TEXT, 
			time DATETIME DEFAULT CURRENT_TIMESTAMP,

			FOREIGN KEY(category) REFERENCES categories(name) ON DELETE SET NULL
		); 
`;

const insertDefaultCategoriesScript = `
	INSERT INTO categories (name, type, color) 
	VALUES
		('Food', 'expense', '#faecd4'),
		('Delivery', 'expense', '#fce8e6'),
		('Salary', 'income', '#e9f3e6'),
		('Gas', 'income', '#ffefd6'),
		('Water', 'income', '#d4e4fa'),
		('Transport', 'expense', '#f1e7ff'),
		('Fuel', 'expense', '#fce7d4'),
		('Misc', '', '#dde');
`;


export const getDB = async () => {
	if (!db) {
		console.log("NO DB")
		db = await SQLite.openDatabaseAsync('local.db');
		//Initially create tables if they don't exist
		await db.execAsync(dbSetupScript);
		/*
		const userVersion = await db.getFirstAsync(
			'PRAGMA user_version'
		);


		console.log(userVersion);

		if (userVersion < 1) {
			await db.runAsync(insertDefaultCategoriesScript);
			await db.runAsync(`PRAGMA user_version=1`)
		}
*/
	}
	console.log("DB = ", db)
	return db;
}


export const getCategories = async () => {
	const db = await getDB();
	console.log(db);
	const data = await db?.getAllAsync(`SELECT * FROM categories`);
	return data;
}
