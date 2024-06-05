export interface IParamsCreateUser {
  name: string
  address: string
  age: string
}

export interface IParamsUpdateUser {
  id: string
  name: string
  address: string
  age: string
}

export interface IParamsDeleteUser {
  id: string
}

export interface IUserInfo {
  _id?: string
  name: string
  address: string
  age: string
}
