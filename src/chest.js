let chest = {}

/** @type {(key: String|Number, value: Any) -> ()} */
export function putInChest (key, value) {
  chest = { ...chest, [key]: value }
}

/** @type {(key: String|Number) -> Any} */
export const getFromChest = key => chest[key]
