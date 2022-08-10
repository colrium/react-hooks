/** @format */
import { useEffect } from "react"
import useQueue from "./useQueue"

const useExecutionQueue = (initialValue = []) => {
	const [state, { length, ...controls }] = useQueue(initialValue)
	useEffect(() => {
		if (length > 0) {
			let first = controls.peek()
			if (Function.isFunction(first)) {
				Promise.all([first()])
					.catch(() => {})
					.finally(() => controls.dequeue())
			} else {
				controls.dequeue()
			}
		}
		return () => controls.clear()
	}, [length])

	return [state, { length, ...controls }]
}
export default useExecutionQueue
