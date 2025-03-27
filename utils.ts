import { ReactNode } from "react";
import { Option } from "./types";

export const toOptions = <T>(
	arr: T[],
	valueSelector = ((item: T) => item) as ((item: T) => number | string),
	labelFormatter = ((item: T) => item) as (item: T) => ReactNode
) => arr.map(item => ({
	value: valueSelector(item),
	label: labelFormatter(item)
} as Option<number | string>)
)


export const getStartOfWeek = (weekStarts = 0) => {
	const date = new Date()
	const dayOfWeek = date.getDay() === weekStarts ? 0 : date.getDay() - weekStarts;//sun=0;sat=6
	const firstDayOfWeek = new Date(date);
	firstDayOfWeek.setDate(date.getDate() - Math.abs(dayOfWeek));
	firstDayOfWeek.setHours(0, 0, 0, 0); // Set to start of day

	return firstDayOfWeek;
}

export const getStartOfMonth = () => {
	const date = new Date()
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const getStartOfYear = () => {
	const date = new Date()
	return new Date(date.getFullYear(), 0, 1);
}
