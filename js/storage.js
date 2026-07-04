const STORAGE_KEY = "movements";

export function getMovements() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveMovements(movements) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
}