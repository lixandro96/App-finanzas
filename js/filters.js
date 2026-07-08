import { movements } from "./state.js";

const monthFilter = document.getElementById("monthFilter");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");
const searchInput = document.getElementById("searchInput");

export function getFilteredMovements() {
  const selectedMonth = monthFilter.value;
  const selectedType = typeFilter.value;
  const selectedCategory = categoryFilter.value;
  const startDate = startDateFilter.value;
  const endDate = endDateFilter.value;
  const searchText = searchInput.value.toLowerCase().trim();

  return movements.filter((movement) => {
    const movementDate = movement.date.slice(0, 10);
    const movementMonth = movement.date.slice(0, 7);

    const hasDateRange = startDate !== "" || endDate !== "";

    const matchesStartDate =
      startDate === "" || movementDate >= startDate;

    const matchesEndDate =
      endDate === "" || movementDate <= endDate;

    const matchesMonth =
      hasDateRange
        ? true
        : selectedMonth === "" || movementMonth === selectedMonth;

    const matchesType =
      selectedType === "all" || movement.type === selectedType;

    const matchesCategory =
      selectedCategory === "all" || movement.category === selectedCategory;

    const matchesSearch =
      movement.concept.toLowerCase().includes(searchText);

    return (
      matchesStartDate &&
      matchesEndDate &&
      matchesMonth &&
      matchesType &&
      matchesCategory &&
      matchesSearch
    );
  });
}