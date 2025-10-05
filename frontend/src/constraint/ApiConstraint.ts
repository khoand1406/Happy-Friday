// export const BaseURl= "http://localhost:3000"
export const BaseURl= "https://happyfriday-e9fbdygvebf9e6dv.southeastasia-01.azurewebsites.net/"
export const LOGIN= '/api/auth/login'

export const USER_PROFILE= '/api/users/me'
export const UPDATE_PROFILE= '/api/users/me/update_profile'
export const CHANGE_PASSWORD= '/api/users/change-password'
export const MEMBER_LIST= (depId: number)=> `/api/users/member-list/${depId}`
export const DEPARTMENT_LIST= '/api/departments'