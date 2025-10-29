import { isEmail, IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator"

export class LoginRequestDto {

    @IsNotEmpty()
    @IsEmail({}, {message: "Email invalid"})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6, {message: 'Password length must greater than 6'})
    password: string;
}



export class OauthLoginRequest {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  avatar_url: string | null;
}

export class ForgetPasswordDto{
    @IsNotEmpty()
    @IsEmail()
    confirmEmail: string
}