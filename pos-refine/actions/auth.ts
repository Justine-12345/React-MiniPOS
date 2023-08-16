

import axios from 'axios'
import { BaseURL } from 'src/baseURl'

const instance = axios.create({
  baseURL: BaseURL, // Replace with your backend server URL
  withCredentials: true, // Allow credentials
});


export async function login(data: any) {

  const res = await instance.post(`${BaseURL}/login/`, data)
  if (res.data.success === true) {
    localStorage.setItem("username", res.data.user.fullname)
    localStorage.setItem("role", res.data.user.role.name)
  }
  return res

}

export async function checkPermission(model: string) {
  const token = getCookie("posCookie")

  let resBool = false
  const res = await instance.get(`${BaseURL}/auth-user/`, { headers: { 'Authorization': token ? token : "none" } })


  res.data.authUser?.role?.permissions.forEach((permission: { _id: string, name: string }) => {
    if (permission.name === model) {
      resBool = true
    }
  });

  return resBool

}

export async function getAuthUser() {
  const token = getCookie("posCookie")
  const res = await instance.get(`${BaseURL}/auth-user/`, { headers: { 'Authorization': token ? token : "none" } })
  return res
}


export async function logout() {

  const res = await instance.get(`${BaseURL}/logout/`)
  localStorage.clear
  return res
}


export function getCookie(name: string): string | null {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");

  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}