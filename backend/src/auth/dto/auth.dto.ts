import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class LoginRequestDto {

    @IsNotEmpty()
    @IsEmail({}, {message: "Email invalid"})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6, {message: 'Password length must greater than 6'})
    password: string;
}