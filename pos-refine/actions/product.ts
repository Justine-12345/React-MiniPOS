
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}


export async function getProducts() {

    const res = await axios.get(`${BaseURL}/product/`, header())
    return res

}


export async function deleteProduct(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/product/${id}`, header())
    return res
}