
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth'

const header = () => {
    const token = getCookie("posCookie")
    return { headers: { 'Authorization': token ? token : "none" } }
}




export async function getCustomers() {

    const res = await axios.get(`${BaseURL}/customer/`,header())
    return res

}


export async function deleteCustomer(id: string | string[] | undefined) {
    const res = await axios.delete(`${BaseURL}/customer/${id}`,header())
    return res
}