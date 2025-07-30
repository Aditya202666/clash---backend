import { Response, Request } from 'express';
import { registerSchema } from "../validators/authValidators.js"


const registerUser = async(req: Request, res: Response,) => {
    
    try {
        
        const body = req.body
        const payload = registerSchema.parse(body)
        
    } catch (error) {
        
       return res.status(422).json(error)

    }

}

export {
    registerUser
}