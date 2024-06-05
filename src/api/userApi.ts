import axios from 'axios'
import { IParamsCreateUser, IParamsDeleteUser, IParamsUpdateUser } from '../interfaces/user'
import { IPagination } from '../interfaces/pagination'

const USER_BASE_URL = `${process.env.REACT_APP_ENDPOINT_API}/api/user`

export const userAPI = {
  createUser: async (params: IParamsCreateUser) => {
    const url = `${USER_BASE_URL}/create`
    try {
      const res = await axios.post(url, {
        name: params.name,
        age: params.age,
        address: params.address
      })

      return res.data
    } catch (error) {
      return error
    }
  },
  getUsers: async (params: IPagination) => {
    const url = `${USER_BASE_URL}/gets?page=${params.pageNumber}&limit=${params.pageSize}`
    try {
      const res = await axios.get(url)

      return res.data
    } catch (error) {
      return error
    }
  },
  updateUser: async (params: IParamsUpdateUser) => {
    const url = `${USER_BASE_URL}/update/${params.id}`

    try {
      const res = await axios.put(url, {
        name: params.name,
        address: params.address,
        age: params.age
      })

      return res.data
    } catch (error) {
      return error
    }
  },
  deleteUser: async (params: IParamsDeleteUser) => {
    const url = `${USER_BASE_URL}/delete/${params.id}`

    try {
      const res = await axios.delete(url)

      return res.data
    } catch (error) {
      return error
    }
  }
}
