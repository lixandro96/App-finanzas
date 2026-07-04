import { getMovements } from "./storage.js";

export let movements = getMovements();

export let editingMovementId = null;

export function setMovements(newMovements) {
  movements = newMovements;
}

export function setEditingMovementId(id) {
  editingMovementId = id;
}