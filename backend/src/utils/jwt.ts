import jwt, { JwtPayload} from "jsonwebtoken"

export const generatejwt = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "180d"
    })
    return token
}