// TODO use localstorage to persist through page refreshes
// window.chest = {}
let chest = {}

// function onPageRefresh() {
//   localStorage.setItem('CHEST_KEY', JSON.stringify(chest))
// }

// function onPageLoad() {
//   if (window.localStorage.length > 0) {
//     chest = JSON.parse(localStorage.getItem('CHEST_KEY'))
//   }
// }

/** @type {(key: String|Number, value: Any) -> ()} */
export function putInChest (key, value) {
  chest = { ...chest, [key]: value }
}

/** @type {(key: String|Number) -> Any} */
export const getFromChest = key => chest[key]
