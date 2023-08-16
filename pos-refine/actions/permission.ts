
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}



export async function getPermissions() {
    const res = await axios.get(`${BaseURL}/permission/`, header())
    return res
}


export async function deletePermission(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/permission/${id}`, header())
    return res
}