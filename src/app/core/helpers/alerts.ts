import Swal from "sweetalert2";

export const confirmArchive = async (entity: string, onDelete?: () => void) => {
  return Swal.fire({
    title: `Archive ${entity}`,
    text: `Are you sure you want to archive ${entity}?`,
    showConfirmButton: true,
    confirmButtonText: "Archive now",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#FF5151",
    showCancelButton: true,
    cancelButtonColor: "#d1d1d1",
    reverseButtons: true,
    preConfirm: onDelete,
  });
};

export const confirmRestore = async (entity: string, onDelete?: () => void) => {
  return Swal.fire({
    title: `Restore ${entity}`,
    text: `Are you sure you want to restore ${entity}?`,
    showConfirmButton: true,
    confirmButtonText: "Restore now",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#00bafe",
    showCancelButton: true,
    cancelButtonColor: "#d1d1d1",
    reverseButtons: true,
    preConfirm: onDelete,
  });
};
