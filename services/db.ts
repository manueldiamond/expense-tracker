import { SQLiteDatabase } from 'expo-sqlite'

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
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			amount INTEGER NOT NULL, 
			category TEXT, 
			time DATETIME DEFAULT CURRENT_TIMESTAMP,

			FOREIGN KEY(category) REFERENCES categories(name) ON DELETE NO ACTION
		);

		CREATE TABLE IF NOT EXISTS user_data(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT, 
			email TEXT
		);
		
`;

const insertDefaultCategoriesScript = `
	DELETE FROM categories;

	INSERT INTO categories (name, type, color) 
	VALUES
		('Food', 'expense', '#faecd4'),
		('Delivery', 'income', '#acf8a6'),
		('Salary', 'income', '#e9f3e6'),
		('Gas', 'income', '#ffefd6'),
		('Water', 'income', '#d4e4fa'),
		('Transport', 'expense', '#f1e7ff'),
		('Fuel', 'expense', '#fce7d4'),
		('Misc', '', '#dde');
`;

export const setupDB = async (db: SQLiteDatabase) => {
	//await db.execAsync(`PRAGMA user_version = 0`);
	const DATABASE_VERSION = 1;

	const ver = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

	let currentDbVersion = ver?.user_version || 0

	if (currentDbVersion > DATABASE_VERSION)
		return;

	if (currentDbVersion === 0) {
		await db.execAsync(dbSetupScript);
		await db.runAsync(`INSERT INTO user_data(id, name) VALUES (0, 'User');`);
		await db.execAsync(insertDefaultCategoriesScript);
	}


	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}


