export const BaseURl= "http://localhost:3000"
// export const BaseURl= "https://happyfriday-e9fbdygvebf9e6dv.southeastasia-01.azurewebsites.net"
export const LOGIN= '/api/auth/login'

export const USER_PROFILE= '/api/users/me'
export const UPDATE_PROFILE= '/api/users/me/update_profile'
export const CHANGE_PASSWORD= '/api/users/change-password'
export const MEMBER_LIST= (depId: number)=> `/api/users/member-list/${depId}`
export const DEPARTMENT_LIST= '/api/departments'
// Accounts (admin)
export const ACCOUNTS= '/api/accounts'
export const ACCOUNT_ENABLE= (id: string)=> `/api/accounts/${id}/enable`
export const ACCOUNT_DISABLE= (id: string)=> `/api/accounts/${id}/disable`
export const ACCOUNT_BAN= (id: string)=> `/api/accounts/${id}/ban`
export const ACCOUNT_RESET_PASSWORD= (id: string)=> `/api/accounts/${id}/reset-password`
export const ACCOUNT_UPDATE= (id: string)=> `/api/accounts/${id}`
export const ACCOUNT_DELETE= (id: string)=> `/api/accounts/${id}`

// Projects
export const PROJECTS= '/api/projects'
export const PROJECT_DETAIL= (id: number | string)=> `/api/projects/${id}`
export const PROJECT_STATUS= (id: number | string)=> `/api/projects/${id}/status`
export const PROJECT_UPDATES= (id: number | string)=> `/api/projects/${id}/updates`



