// window.chest = {}
let chest = {}

/** @type {(key: String|Number, value: Any) -> ()} */
export function putInChest (key, value) {
  chest = { ...chest, [key]: value }
}

/** @type {(key: String|Number) -> Any} */
export const getFromChest = key => chest[key]

// whenever user refreshes page, put cache in localStorage
window.onbeforeunload = function beforePageRefresh() {
  localStorage.setItem('CHEST_KEY', JSON.stringify(chest))
}

// after page refresh finishes, load data from cache
window.addEventListener('load', function afterPageRefresh() {
  if (window.localStorage.length > 0) {
    chest = JSON.parse(localStorage.getItem('CHEST_KEY'))
  }
})
