import { movements } from "./state.js";

const monthFilter = document.getElementById("monthFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

export function getFilteredMovements() {
  const selectedMonth = monthFilter.value;
  const selectedType = typeFilter.value;
  const searchText = searchInput.value.toLowerCase().trim();

  return movements.filter((movement) => {
    const movementMonth = movement.date.slice(0, 7);

    const matchesMonth = selectedMonth === "" || movementMonth === selectedMonth;
    const matchesType = selectedType === "all" || movement.type === selectedType;
    const matchesSearch = movement.concept.toLowerCase().includes(searchText);

    return matchesMonth && matchesType && matchesSearch;
  });
}