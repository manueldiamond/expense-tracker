//DB TYPES

import { ReactNode } from "react";

export interface UserData {
	name: string;
	email: string;
	id: number;
}
export interface TransactionCategory {
	name: string;
	color: string;
	type: 'income' | 'expense';
}

export interface Transaction {
	id: number;
	amount: number;
	category: string | TransactionCategory;
	time: string;
}

//END DB TYPES


export type ExternalState<T> = [T, (val: T) => void]

export type Option<T> = {
	label: ReactNode,
	value: T
}
