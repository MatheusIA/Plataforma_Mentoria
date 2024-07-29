export class NotFoundUsersError extends Error {
    constructor(){
        super("No users found")
    }
}