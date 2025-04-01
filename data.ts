
import { toOptions } from "./utils";

export const currentVersion = 0.1

export const colors = {
	accent: '#b6d7ad',
	'accent-dark': '#96b79d',
	paleblue: '#f8f8fa',
	spent: '#ffb9aa',
	head: '#152144',
	muted: '#687076',
	'muted-2': '#d0d2d4',
	//income: '#D4CEF0',
	lorange: '#faecd4',
	lgreen: '#e9f3e6',
	lblue: '#f1e7ff',

};


export const transactionTypeOptions = [
	{ value: "income", label: 'Income' },
	{ value: "expense", label: 'Expense' }
] as const;

export const transactionPaymentTypeOptions = [
	{ value: "momo", label: "MOMO", },
	{ value: "cash", label: "CASH" },
] as const

export const daysOfWeekOptions = [
	{ value: "Sun", label: "Sunday" },
	{ value: "Mon", label: "Monday" },
	{ value: "Tue", label: "Tuesday" },
	{ value: "Wed", label: "Wednesday" },
	{ value: "Thu", label: "Thursday" },
	{ value: "Fri", label: "Friday" },
	{ value: "Sat", label: "Saturday" }
] as const;

export const bottomTextS = {
	afterLosses: [
		{ text: "Though he fall, he shall not be utterly cast down: for the Lord upholdeth him with his hand.", verse: "Psalm 37:24" },
		{ text: "For a just man falleth seven times, and riseth up again.", verse: "Proverbs 24:16" },
		{ text: "The Lord is my shepherd; I shall not want.", verse: "Psalm 23:1" },
		{ text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.", verse: "Isaiah 40:31" }
	],

	afterGains: [
		{ text: "The blessing of the Lord, it maketh rich, and he addeth no sorrow with it.", verse: "Proverbs 10:22" },
		{ text: "Every good gift and every perfect gift is from above, and cometh down from the Father of lights.", verse: "James 1:17" },
		{ text: "Delight thyself also in the Lord: and he shall give thee the desires of thine heart.", verse: "Psalm 37:4" },
		{ text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.", verse: "Luke 6:38" },
		{ text: "Thou shalt remember the Lord thy God: for it is he that giveth thee power to get wealth.", verse: "Deuteronomy 8:18" }
	],

	nan: [
		{ text: "Be not weary in well doing: for in due season we shall reap, if we faint not.", verse: "Galatians 6:9" },
		{ text: "The Lord is good unto them that wait for him, to the soul that seeketh him.", verse: "Lamentations 3:25" },
		{ text: "Wait on the Lord: be of good courage, and he shall strengthen thine heart.", verse: "Psalm 27:14" },
		{ text: "Wake up and get yourself to work, Yeah, Yeah, Yeah, Yeahh... ", verse: "MM" },
	],

}
