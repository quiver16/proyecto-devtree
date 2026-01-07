import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, login } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { auth } from "./middleware/auth";
const router = Router();

router.post("/auth/register",
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password debe tener al menos 6 caracteres'),
    handleInputErrors,
    createAccount)


router.post("/auth/login", 
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('El password es obligatorio'),
    handleInputErrors,
    login
)
router.get("/user", auth, getUser)

export default router
