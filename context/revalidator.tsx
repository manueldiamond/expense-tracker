import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from "react";


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

type RevalidateContext = {
	state: Record<string, Date>;
	setState: (o: Record<string, Date>) => void;
};

const revaliatorContext = createContext<RevalidateContext | undefined>(undefined);

export const RevalidatorProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useObjectState<any>({});

	return (
		<revaliatorContext.Provider value={{ state, setState }}>
			{children}
		</revaliatorContext.Provider>
	);
};

export const useRevalidatorContext = () => {
	const context = useContext(revaliatorContext);
	if (!context) {
		throw new Error("must be used within an RevalidatorProvider");
	}
	return context;
};

export const useRevalidator = () => {
	const ctx = useRevalidatorContext()
	return (tag: string) => ctx.setState({ [tag]: new Date() })
}

const defaultDate = new Date(1995)
export const useValidator = (tag: string) => {
	const context = useRevalidatorContext()
	return `${context.state[tag] || (defaultDate)}`
}
