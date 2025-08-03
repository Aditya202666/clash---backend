import { z } from "zod";

export const registerSchema = z.object({

    name: z.string()
    .nonempty({message: "Name is required."})
    .min(3, {message: "Name must be at least 3 characters."}).trim(),
    email: z.string().nonempty({message: "Email is required."}).email({message: "Invalid email address."})
    .toLowerCase().trim(),
    password: z.string()
    .nonempty({message: "Password is required."})
    .min(8, {message: "Password must be at least 8 characters."}).trim(),
    confirm_password: z.string()
    .nonempty({message: "Confirm password is required."})
    .min(8, {message: "Confirm password must be at least 8 characters."}).trim(),

}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});