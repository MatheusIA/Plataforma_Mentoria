export class AvailableTimeError extends Error {
    constructor(){
        super('The desired time slot is already occupied')
    }
}