import { registerSchema } from "../validators/authValidators.js";
const registerUser = async (req, res) => {
    try {
        const body = req.body;
        const payload = registerSchema.parse(body);
    }
    catch (error) {
        return res.status(422).json(error);
    }
};
export { registerUser };
