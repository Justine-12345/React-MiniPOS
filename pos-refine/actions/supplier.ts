
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}



export async function getSuppliers() {

    const res = await axios.get(`${BaseURL}/supplier/`, header())
    return res

}


export async function deleteSupplier(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/supplier/${id}`, header())
    return res
}