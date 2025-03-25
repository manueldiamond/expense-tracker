import { useCallback, useState } from "react"
import { getDB } from "./services/db"


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
