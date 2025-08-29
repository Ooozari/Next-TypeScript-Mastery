import {z} from 'zod'

export const UsernameValidation = z
    .string()
    .min(3,"Username must be 2 chars atleast")
    .min(20,"Username can contain max 20 chars")
    .regex(/^[a-zA-Z0-9_]+$/,"Username cannot contain special chars")


export const SignUpValidation = z.object({
    username: UsernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be atlest 6 chars"})
})