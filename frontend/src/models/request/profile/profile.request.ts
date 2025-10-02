export interface UpdateUserProfileRequest{
    name: string,
    phone: string,
    avatar_url: File|undefined
}