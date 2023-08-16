
import axios from 'axios'
import { User } from 'data'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}

export async function postUser(data: User) {

    const res = await axios.post(`${BaseURL}/user/`, data, header())

    return res
}

export async function getUsers() {
    const res = await axios.get(`${BaseURL}/user/`, header())
    return res
}


export async function getUser(id: string | string[]) {
    console.log("id", id)
    const res = await axios.get(`${BaseURL}/user/${id}`, header())

    return res
}


export async function updateUser(id: string | string[], data: User) {
    console.log("id", id)
    console.log("data", data)

    const res = await axios.patch(`${BaseURL}/user/${id}`, data, header())
    return res

}


export async function deleteUser(id: string | string[] | undefined) {
    console.log("id", id)
    const res = await axios.delete(`${BaseURL}/user/${id}`, header())

    return res
}

