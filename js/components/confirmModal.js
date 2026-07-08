const confirmModal = document.getElementById("confirmModal");
const confirmModalIcon = document.getElementById("confirmModalIcon");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const cancelConfirmButton = document.getElementById("cancelConfirmButton");
const acceptConfirmButton = document.getElementById("acceptConfirmButton");

const icons = {
  danger: "!",
  warning: "!",
  success: "✓",
  info: "i",
};

export function showConfirmModal({
  title = "Confirmar acción",
  message = "¿Seguro que deseas continuar?",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  type = "danger",
}) {
  return new Promise((resolve) => {
    confirmModal.className = `confirm-modal ${type}`;

    confirmModalIcon.textContent = icons[type] || "!";
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    acceptConfirmButton.textContent = confirmText;
    cancelConfirmButton.textContent = cancelText;

    confirmModal.classList.remove("hidden");

    function closeModal(value) {
      confirmModal.classList.add("hidden");

      acceptConfirmButton.removeEventListener("click", handleAccept);
      cancelConfirmButton.removeEventListener("click", handleCancel);
      confirmModal.removeEventListener("click", handleOutsideClick);

      resolve(value);
    }

    function handleAccept() {
      closeModal(true);
    }

    function handleCancel() {
      closeModal(false);
    }

    function handleOutsideClick(event) {
      if (event.target === confirmModal) {
        closeModal(false);
      }
    }

    acceptConfirmButton.addEventListener("click", handleAccept);
    cancelConfirmButton.addEventListener("click", handleCancel);
    confirmModal.addEventListener("click", handleOutsideClick);
  });
}