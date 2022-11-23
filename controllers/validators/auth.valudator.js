import validator from 'express-validator'
const { check } = validator

export default class authValidator {
    static createUserValidator = [
        check('email', 'Неверный email').isEmail(),
        check('roles', 'Не выбраны роли').isArray().notEmpty(),
        check('username', 'Отсутствует username').isLength({ min: 3 }),
        check('password', 'Неверный пароль').isLength({ min: 3, max: 12 })
    ]
}


