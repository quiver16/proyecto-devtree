import { Request, Response } from "express"
import { validationResult } from "express-validator"
import User from "../models/User"
import slug from "slug"
import { checkPassword, hashPassword } from "../utils/auth"

export const createAccount = async (req: Request, res: Response) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(409).json({ message: "Usuario ya existe" })
    }
    const handle = slug(req.body.handle, (''))
    const handleExists = await User.findOne({ handle })

    if (handleExists) {
        return res.status(409).json({ message: "Nombre de usuario no disponible" })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle
    await user.save()
    res.status(201).json({ message: "Usuario creado exitosamente" })
}

export default createAccount

export const login = async (req: Request, res: Response) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body
    // Revisar si el usuario existe

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: "Usuario no existe" })
    }

    //comprobar password
    const isValidPassword = await checkPassword(password, user.password)
    if (!isValidPassword) {
        return res.status(401).json({ message: "Contraseña incorrecta" })
    }
    res.status(200).json({ message: "Login exitoso" })
}