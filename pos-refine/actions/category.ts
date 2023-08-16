
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}


export async function getCategorys() {

    const res = await axios.get(`${BaseURL}/category/`, header())
    return res

}


export async function deleteCategory(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/category/${id}`, header())
    return res
}