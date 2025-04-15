//DB TYPES

import { ReactNode } from "react";
import { transactionPaymentTypeOptions, transactionTypeOptions } from "./data";

export interface UserData {
	name: string;
	email: string;
	id: number;
}

export interface TransactionCategory {
	name: string;
	color: string;
	type: (typeof transactionTypeOptions)[number]['value'];
}

export interface Transaction {
	id: number;
	amount: number;
	category: string | TransactionCategory;
	time: string;
	paymentType: (typeof transactionPaymentTypeOptions)[number]['value'] | null;
}

//END DB TYPES


export type ExternalState<T> = [T, (val: T) => void]

export type Option<T> = {
	label: ReactNode,
	value: T
}


export const periods = ["All", "Today", "Weekly", "Monthly", "Yearly"] as const
export type periodType = typeof periods[number]


export type ReactChildren = Partial<{
	children: ReactNode;
	className: string;
}>

export type TransactionsFiltersType = Partial<{
	start: Date,
	end: Date,
	category: string,
	type: TransactionCategory['type'],
	ptype: Transaction['paymentType'],
	minamount: number,
	maxamount: number,
}>


