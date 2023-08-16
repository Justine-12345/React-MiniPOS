
import axios from 'axios'
import { Role } from 'data'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}

export async function postRole(data: Role) {

    const res = await axios.post(`${BaseURL}/role/`, data, header())
    return res

}

export async function getRoles() {
    const res = await axios.get(`${BaseURL}/role/`, header())
    return res
}


export async function getRole(id: string | string[]) {
    const res = await axios.get(`${BaseURL}/role/${id}`, header())

    return res
}


export async function updateRole(id: string | string[], data: Role) {
    const res = await axios.patch(`${BaseURL}/role/${id}`, data, header())
    return res

}

export async function deleteRole(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/role/${id}`, header())

    return res
}