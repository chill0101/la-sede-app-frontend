const KEY = 'aj-club'


export function readState() {
const raw = localStorage.getItem(KEY)
return raw ? JSON.parse(raw) : null
}


export function writeState(state) {
localStorage.setItem(KEY, JSON.stringify(state))
}


export function resetState() {
localStorage.removeItem(KEY)
}