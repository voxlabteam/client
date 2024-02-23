import axios from "axios"

const getvxsrf = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API}/getvxsrf`)
    const vxsrf = response.data
    return vxsrf
}

export default getvxsrf