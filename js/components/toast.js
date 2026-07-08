const toastContainer = document.getElementById("toastContainer");

let currentToast = null;

const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
};

export function showToast({
    type = "info",
    message = "",
    duration = 3000
}) {

    if(currentToast){
        currentToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span class="toast-icon">
            ${icons[type]}
        </span>

        <span>
            ${message}
        </span>
    `;

    toastContainer.appendChild(toast);

    currentToast = toast;

    setTimeout(()=>{

        toast.classList.add("hide");

        setTimeout(()=>{

            toast.remove();

            if(currentToast===toast){

                currentToast=null;

            }

        },250);

    },duration);

}