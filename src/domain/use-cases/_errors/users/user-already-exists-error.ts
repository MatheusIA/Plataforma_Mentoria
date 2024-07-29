export class UserAlreadyExistsError extends Error {
    constructor() {
        super("E-email already exists.")
    }
}