export function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(value);
}

export function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}