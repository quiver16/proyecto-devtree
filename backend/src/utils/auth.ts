import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
//validar contraseña
export const checkPassword = async (enteredPassword: string, hash: string) =>{
    return await bcrypt.compare(enteredPassword, hash)
}
