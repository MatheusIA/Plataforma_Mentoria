import request from "supertest"
import { app } from "@/app";
import { afterAll, beforeAll,  describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to authenticate", async () => {
        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

        const response = await request(app.server)
        .post('/authenticate/sessions')
        .send({
            email: "jonhdoe@example.com",
            password: "123456"
        })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })
})