import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { SQLiteDatabase } from "expo-sqlite"
import { BackHandler } from "react-native"
import { Transaction, TransactionCategory, TransactionsFiltersType, UserData } from "./types"
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
			try {
				const data = await db.getAllAsync<T>(sql, params)
				setState(data)
				console.log(tag, "validated")
			} catch (e) {
				console.log(e);
			}
		}

		/*  DEBUGGING REPEATING QUERIES
			gets[sql] = (gets[sql] || 0) + 1
			console.log("QUERIED", gets[sql], "tiems")
		*/
		getAllQuery()
	}, [sql, stringifiedParams, lastUpdated])
	const reval = useRevalidator()

	const revalidate = () => reval(tag)
	return [state, setState, revalidate] as [T[] | undefined, SetStateAction<Dispatch<T[]>>, () => void];
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


export const useTransactions = (db: SQLiteDatabase, filters: TransactionsFiltersType, limit = 999999) => {

	let { start: startDate, end: endDate, ptype: paymentType, maxamount, minamount, type, category } = filters
	startDate = startDate ?? new Date(1995, 1, 0)
	startDate.setHours(0, 0, 0, 0)

	endDate = endDate ?? new Date()
	endDate.setHours(0, 0, 0, 0); // optional, to cover full day

	console.log(`
		SELECT 
		    t.id,
		t.amount,
		t.payment_type,
		t.category,
		t.time,
		c.name AS category_name,
		c.color AS category_color,
		c.type AS category_type
		  FROM transactions AS t
		  LEFT JOIN categories AS c ON t.category = c.name
		  WHERE DATE(t.time) >= DATE(?)
		    AND DATE(t.time) <= DATE(?)
		    AND ABS(t.amount) >= ?
		AND ABS(t.amount) <= ?
		${paymentType ? `AND t.payment_type = ?` : ''}
		    ${type === 'income' ? `AND t.amount >= 0` : type === 'expense' ? `AND t.amount < 0` : ''}
		    ${category ? `AND t.category = ?` : ''}
		  ORDER BY t.time DESC;
`,
		[
			startDate.toISOString(),
			endDate.toISOString(),
			minamount ?? Number.MIN_VALUE,
			maxamount ?? Number.MAX_SAFE_INTEGER,
			...(paymentType ? [paymentType] : []),
			...(category ? [category] : [])
		],

	);
	const [transactionsRaw, , revalidateTransactions] = useSqliteGet(db, `
		SELECT 
		    t.id,
		t.amount,
		t.payment_type,
		t.category,
		t.time,
		c.name AS category_name,
		c.color AS category_color,
		c.type AS category_type
		  FROM transactions AS t
		  LEFT JOIN categories AS c ON t.category = c.name
		  WHERE DATE(t.time) >= DATE(?)
		    AND DATE(t.time) <= DATE(?)
		    AND ABS(t.amount) >= ?
		AND ABS(t.amount) <= ?
		${paymentType ? `AND t.payment_type = ?` : ''}
		    ${type === 'income' ? `AND t.amount >= 0` : type === 'expense' ? `AND t.amount < 0` : ''}
		    ${category ? `AND t.category = ?` : ''}
		  ORDER BY t.time DESC;
`,
		[
			startDate.toISOString(),
			endDate.toISOString(),
			minamount ?? Number.MIN_VALUE,
			maxamount ?? Number.MAX_SAFE_INTEGER,
			...(paymentType ? [paymentType] : []),
			...(category ? [category] : [])
		],
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
				paymentType: t.payment_type,
				category: t.category_name ? {
					name: t.category_name,
					color: t.category_color,
					type: t.amount >= 0 ? 'income' : 'expense'
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

	return { ...data, revalidateTransactions }
}

export const useCategories = (db: SQLiteDatabase) =>
	useSqliteGet<TransactionCategory>(db, `Select * from categories`, undefined, 'cats');

export const useUserData = (db: SQLiteDatabase) => {
	const [users, mutate, revalidateUser] = useSqliteGet<UserData>(db, `SELECT * from user_data; `, undefined, 'udata');
	const user = (users) ? (users[0]) : { name: 'User', id: 0, email: '' } as UserData

	const setUserData = async (data = { $name: user.name } as { $name: string }) => {
		await db.runAsync(`UPDATE user_data SET name = $name; `, data)
		revalidateUser()
	}

	const mutateUserData = (newData: Partial<UserData>) =>
		//@ts-ignore
		mutate(data => [{ ...(data ? data[0] : {}), ...newData }]);

	return {
		user,
		setUserData,
		mutateUserData,
		revalidateUser

	}
}
