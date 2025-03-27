import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { SQLiteDatabase } from "expo-sqlite"
import { BackHandler } from "react-native"
import { Transaction, TransactionCategory, UserData } from "./types"
import { useRevalidator, useValidator } from "./context/revalidator"

export const useObjectState = <T extends object>(obj: T) => {
	const [state, setState] = useState(obj)
	const editState = useCallback(
		(changes: Partial<T> | ((current: T) => Partial<T>)) =>
			setState(prevState => ({
				...prevState,
				...(typeof changes === 'function' ? (changes as (current: T) => T)(prevState) : changes)
			})
			)
		, [setState])

	// Example: Updating state with a new value
	// editState({ name: 'Updated Name' });

	return [state, editState] as [T, typeof editState]
}


//const gets = {}
export const useSqliteGet = <T>(db: SQLiteDatabase, sql: string, params = undefined as any, tag = "") => {
	//state to get the asynchrously updated value
	const [state, setState] = useState<T[]>()
	//Effect to asynchronously load the value
	const stringifiedParams = JSON.stringify(params)
	const lastUpdated = useValidator(tag)

	useEffect(() => {
		const getAllQuery = async () => {
			const data = await db.getAllAsync<T>(sql, params)
			setState(data)
			console.log(tag, "validated")
		}

		/*  DEBUGGING REPEATING QUERIES
			gets[sql] = (gets[sql] || 0) + 1
			console.log("QUERIED", gets[sql], "tiems")
		*/
		getAllQuery()
	}, [sql, stringifiedParams, lastUpdated])
	return [state, setState] as [T[] | undefined, SetStateAction<Dispatch<T[]>>];
}


export const useHandleBack = (onBackPressFn: Function) => {
	useEffect(() => {
		const backaa = () => {
			onBackPressFn();
			return true;
		}
		const backhandler = BackHandler.addEventListener('hardwareBackPress', backaa);

		return () => backhandler.remove();
	})
}


export const useTransactions = (db: SQLiteDatabase, startDate: Date, limit = 9999999) => {

	startDate.setHours(0, 0, 0, 0)

	const [transactionsRaw] = useSqliteGet(db,
		`SELECT 
		  t.id,
		t.amount,
		t.category,
		t.time,
		c.name AS category_name,
		c.color AS category_color,
		c.type AS category_type
		FROM transactions AS t
		LEFT JOIN categories AS c
		  ON t.category = c.name
		WHERE DATE(t.time) >= DATE(?)
		ORDER BY t.time DESC
		; `,
		[startDate.toISOString()],
		"transactions"
	);

	const data = useMemo(() => {
		let income = 0
		let spent = 0

		const transactions = transactionsRaw && transactionsRaw.map((t: any, id) => {
			if (t.amount > 0)
				income += t.amount;
			else
				spent += Math.abs(t.amount);

			return id >= limit ? null : ({
				id: t.id,
				amount: t.amount,
				time: t.time,
				category: t.category_name ? {
					name: t.category_name,
					color: t.category_color,
					type: t.category_type as 'income' | 'expense'
				} : t.category
			} as Transaction)
		}).slice(0, limit)
		return { transactions, income, spent };
	},

		[
			transactionsRaw?.length,
			//@ts-ignore
			transactionsRaw && transactionsRaw[0]?.id + transactionsRaw && transactionsRaw[(transactionsRaw.length / 2)]?.id,
			startDate.toISOString(),
		]
	);

	console.log("TRANSACTIONS", data)

	return data
}

export const useCategories = (db: SQLiteDatabase) =>
	useSqliteGet<TransactionCategory>(db, `Select * from categories`, undefined, 'cats');

export const useUserData = (db: SQLiteDatabase) => {
	const [users, mutate] = useSqliteGet<UserData>(db, `SELECT * from user_data;`, undefined, 'udata');
	const user = (users) ? (users[0]) : { name: 'User', id: 0, email: '' } as UserData

	const revalidate = useRevalidator()

	const setUserData = async (data = { $name: user.name } as { $name: string }) => {
		await db.runAsync(`UPDATE user_data SET name = $name;`, data)
		revalidate('udata');
	}

	const mutateUserData = (newData: Partial<UserData>) =>
		//@ts-ignore
		mutate(data => [{ ...(data ? data[0] : {}), ...newData }]);

	return {
		user,
		setUserData,
		mutateUserData,

	}
}
