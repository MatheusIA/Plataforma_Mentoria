export class InvalidDateError extends Error {
    constructor(){
        super("The chosen time cannot be with previous dates and timesThe chosen time cannot be earlier than the current time")
    }
}