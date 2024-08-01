export class NotFoundMenteeError extends Error {
    constructor(){
        super("No mentee found")
    }
}