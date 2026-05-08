/**
 * Module-level store for tracking citation order across a page render.
 * Each Ref component registers itself during creation (DOM order),
 * so numbers match order-of-appearance in the article.
 *
 * Call resetRefs() at the start of each article render to clear previous state.
 */

let refOrder: string[] = [];
let refMap: Map<string, number> = new Map();

/** Register a key and return its citation number. Idempotent. */
export function registerRef(key: string): number {
	const trimmedKey = key.trim();
	if (refMap.has(trimmedKey)) {
		return refMap.get(trimmedKey)!;
	}
	const num = refOrder.length + 1;
	refOrder.push(trimmedKey);
	refMap.set(trimmedKey, num);
	return num;
}

/** Return keys in order of first citation. Used by Bibliography. */
export function getRefOrder(): string[] {
	return [...refOrder];
}

/** Return the citation number for a key, or undefined if not registered. */
export function getRefNumber(key: string): number | undefined {
	return refMap.get(key.trim());
}

/** Reset all state. Call before rendering each article. */
export function resetRefs(): void {
	refOrder = [];
	refMap = new Map();
}
