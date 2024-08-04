export class NotPossibleUpdateMentorError extends Error {
    constructor(){
        super("Failed to update mentor data")
    }
}