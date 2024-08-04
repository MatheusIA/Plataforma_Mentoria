export class NotPossibleUpdateUserError extends Error {
    constructor(){
        super("Failed to update user data")
    }
}