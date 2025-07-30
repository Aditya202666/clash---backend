import { z } from "zod";

export const registerSchema = z.object({

    name: z.string({message: "Name is required."}).min(3, {message: "Name must be at least 3 characters."}).trim(),
    email: z.email({message: "Invalid email."}).toLowerCase().trim(),
    password: z.string({message: "Password is required."}).min(8, {message: "Password must be at least 8 characters."}).trim(),
    confirm_password: z.string({message: "Confirm password is required."}).min(8, {message: "Password must be at least 8 characters."}).trim(),

}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});