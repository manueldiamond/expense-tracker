import { ReactNode } from "react";
import { format, isToday, isYesterday, isThisWeek, isThisYear, subWeeks, getDay } from "date-fns";
import { Option, periodType } from "./types";

export const toOptions = <T>(
	arr: T[],
	valueSelector = ((item: T) => item) as ((item: T) => number | string),
	labelFormatter = ((item: T) => item) as (item: T) => ReactNode
) => arr.map(item => ({
	value: valueSelector(item),
	label: labelFormatter(item)
} as Option<number | string>)
)

export const rarr = <T>(arr: T[]) => arr[Math.round(Math.random() * arr.length)] as T


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


export const formaFancyDate = (date: Date) => {
	if (isToday(date)) return date.toLocaleTimeString('en-US', { hour12: true, timeStyle: 'short' });
	else if (isYesterday(date)) return "Yesterday";
	else if (isThisWeek(date)) return getDay(date);
	else if (date >= subWeeks(new Date(), 1)) return "Last week";
	else if (isThisYear(date)) return format(date, "MMMM d"); // e.g., "March 22"

	return format(date, "MMMM d, yyyy"); // e.g., "March 22, 2022"
};

export const getDateFromPeriod = (period: periodType) => period === 'Today' ? new Date()
	: period === 'Weekly' ?
		getStartOfWeek()
		: period === 'Monthly' ?
			getStartOfMonth()
			: period === 'Yearly' ?
				getStartOfYear()
				: new Date(1995, 0, 1)



