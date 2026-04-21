import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const warningIconHtml = `
  <div style="background-color:#ef4444;border-radius:50%;width:7.5rem;height:7.5rem;display:flex;align-items:center;justify-content:center;margin:0 auto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width:4.5rem;height:4.5rem">
      <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
    </svg>
  </div>`;

export const confirmDelete = (
  options: Partial<SweetAlertOptions> = {}
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    ...options,
  });
};

export const successAlert = (
  text = "Your item has been deleted.",
  options: Partial<SweetAlertOptions> = {}
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: "Success!",
    text,
    icon: "success",
    confirmButtonColor: "#4CAF50",
    confirmButtonText: "OK",
    ...options,
  });
};

export const errorAlert = (
  text = "Something went wrong.",
  options: Partial<SweetAlertOptions> = {}
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: "Error!",
    text,
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
    ...options,
  });
};

export const showError = (title: string, messages: string | string[]) => {
  const html = Array.isArray(messages)
    ? `<ul style="text-align:left;padding-left:1.25rem;margin:0;color:#374151">${messages.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>`
    : `<p style="color:#374151;margin:0">${escapeHtml(messages)}</p>`;

  return Swal.fire({
    iconHtml: warningIconHtml,
    title,
    html,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "swal-error-popup",
      icon: "swal-custom-icon",
    },
  });
};

export default {
  confirmDelete,
  successAlert,
  errorAlert,
  showError,
};
