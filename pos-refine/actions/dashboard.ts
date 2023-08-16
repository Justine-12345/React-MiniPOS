
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
import { getCookie } from './auth';
const instance = axios.create({
  baseURL: BaseURL, // Replace with your backend server URL
  withCredentials: true, // Allow credentials
});


export async function getDashboard() {
  const token = getCookie("posCookie")
  const res = await instance.get(`${BaseURL}/dashboard/`, { headers: { 'Authorization': token ? token : "none" } })
  return res

}