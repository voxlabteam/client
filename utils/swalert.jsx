import swal from "sweetalert2"

const swalert = (text, icon, timer) => {
    return swal.fire({
        icon                : icon || "info",
        text                : text || "server maintenance, please comeback later!",
        timer               : timer || 1500,
        color               : 'var(--blue)',
        background          : 'var(--primary)',
        customClass         : { container: "alertext" },
        showConfirmButton   : false,
    })
}

export default swalert;