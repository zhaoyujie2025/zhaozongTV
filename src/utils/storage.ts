const PREFIX = 'ouonnki-tv'
const STORAGE_KEY_SEARCH_HISTORY = `${PREFIX}-searchHistory`

const saveToStorage = (key: string, value: unknown) => {
  localStorage.setItem(`${PREFIX}-${key}`, JSON.stringify(value))
}

const loadFromStorage = (key: string) => {
  const value = localStorage.getItem(`${PREFIX}-${key}`)
  return value ? JSON.parse(value) : null
}

export { saveToStorage, loadFromStorage }
export { STORAGE_KEY_SEARCH_HISTORY }
