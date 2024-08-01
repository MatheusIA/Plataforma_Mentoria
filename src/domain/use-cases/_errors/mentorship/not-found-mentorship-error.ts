export class NotFoundMentorshipError extends Error {
    constructor(){
        super('No mentorship found')
    }
}