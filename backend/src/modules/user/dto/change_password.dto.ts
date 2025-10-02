import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
    'Password must include uppercase, lowercase, number, and special character',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}