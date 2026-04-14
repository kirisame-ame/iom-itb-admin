import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

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

export default {
  confirmDelete,
  successAlert,
  errorAlert,
};
