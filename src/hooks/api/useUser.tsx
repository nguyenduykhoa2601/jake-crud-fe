import { useState } from 'react'
import { IPagination } from '../../interfaces/pagination'
import { IParamsCreateUser, IParamsDeleteUser, IParamsUpdateUser, IUserInfo } from '../../interfaces/user'
import { userAPI } from '../../api/userApi'
import useNotification from '../functions/useNotification' // Adjust the import path as needed

const useUser = () => {
  const [users, setUsers] = useState<Array<IUserInfo>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { openNotification } = useNotification()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const fetchUsers = (params: IPagination) => {
    setIsLoading(true)
    userAPI
      .getUsers(params)
      .then((res) => {
        if (res) {
          setUsers(res.users)
          setPageNumber(res.page)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.log('err', error)
        setIsLoading(false)
        openNotification({
          type: 'error',
          message: 'Fetch Failed',
          description: 'There was an error fetching the users.'
        })
      })
  }

  const createUser = (params: IParamsCreateUser) => {
    userAPI
      .createUser(params)
      .then((res) => {
        console.log('res', res)
        openNotification({
          type: 'success',
          message: 'User Created',
          description: 'The user has been successfully created.'
        })

        fetchUsers({
          pageNumber: pageNumber,
          pageSize: 10
        })
      })
      .catch((err) => {
        console.log('err', err)
        openNotification({
          type: 'error',
          message: 'Creation Failed',
          description: 'There was an error creating the user.'
        })
      })
  }

  const deleteUser = (params: IParamsDeleteUser) => {
    userAPI
      .deleteUser(params)
      .then((res) => {
        console.log('res', res)
        fetchUsers({
          pageNumber: pageNumber,
          pageSize: 10
        })
        openNotification({
          type: 'success',
          message: 'User Deleted',
          description: 'The user has been successfully deleted.'
        })
      })
      .catch((err) => {
        console.log('error', err)
        openNotification({
          type: 'error',
          message: 'Deletion Failed',
          description: 'There was an error deleting the user.'
        })
      })
  }

  const updateUser = (params: IParamsUpdateUser) => {
    userAPI
      .updateUser(params)
      .then((res) => {
        console.log('res', res)
        fetchUsers({
          pageNumber: pageNumber,
          pageSize: 10
        })
        openNotification({
          type: 'success',
          message: 'User Updated',
          description: 'The user has been successfully updated.'
        })
      })
      .catch((err) => {
        console.log('error', err)
        openNotification({
          type: 'error',
          message: 'Update Failed',
          description: 'There was an error updating the user.'
        })
      })
  }

  return {
    users,
    fetchUsers,
    deleteUser,
    updateUser,
    createUser,
    isLoading,
    pageNumber,
    total,
    setPageNumber
  }
}

export default useUser
