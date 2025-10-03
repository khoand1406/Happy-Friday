export interface AuthRequest{
    email: string
    password: string
}

export interface ChangePasswordRequest{
    email: string
    currentPassword: string
    newPassword: string
    confirmPassword: string

}