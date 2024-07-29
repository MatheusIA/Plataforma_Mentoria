export class NotFoundAvailableSkillsError extends Error {
    constructor(){
        super("Not found any available skills")
    }
}