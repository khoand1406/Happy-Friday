import { IsNotEmpty, MinLength } from "class-validator";

export class changePasswordDto{
    @IsNotEmpty()
    @MinLength(6, {message: "Password is at least 6 character length"})
    oldPassword: string

    @IsNotEmpty()
    @MinLength(6, {message: "Password is at least 6 character length"})
    newPassword: string
}