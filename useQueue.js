/** @format */
import { useCallback, useMemo, useState } from "react"
function createImmutableQueue(entries = []) {
	return [
		entries,
		{
			queue: (data) => {
				try {
					const copy = JSON.parse(JSON.stringify(entries))
					copy.push(data)
					return createImmutableQueue(copy)
				} catch (error) {}
			},
			dequeue: (index) => {
				const copy = JSON.parse(JSON.stringify(entries))
				copy.splice(index > -1 && index < copy.length ? index : 0, 1)
				return createImmutableQueue(copy)
			},
			peek: () => {
				const copy = JSON.parse(JSON.stringify(entries))
				return copy[0]
			},
			clear: () => {
				return createImmutableQueue([])
			},
		},
	]
}

const useQueue = (initialValue = []) => {
	const [entries, controls] = useMemo(
		() => createImmutableQueue(initialValue),
		[initialValue]
	)
	const [state, setState] = useState(entries)
	const queue = useCallback(
		(entry) => setState(controls.queue(entry)),
		[controls]
	)
	const dequeue = useCallback(
		(index = -1) => setState(controls.dequeue(index)),
		[controls]
	)
	const peek = useCallback(() => controls.peek(), [controls])
	const clear = useCallback((entry) => setState(controls.clear()), [controls])
	return [
		state,
		{
			queue,
			dequeue,
			peek,
			clear,
			length: Array.isArray(state) ? state.length : 0,
		},
	]
}

export default useQueue
