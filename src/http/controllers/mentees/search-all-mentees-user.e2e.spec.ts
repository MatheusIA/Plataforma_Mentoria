import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search all mentees (e2e)", () => {
    beforeAll(async() => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to search all mentees", async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoe2@mentee.com",
            password: "123456",
            role: "MENTEE",
        })

        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoe3@mentee.com",
            password: "123456",
            role: "MENTOR"
        })

        const response = await request(app.server)
        .get('/search/all/mentees')
        .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)

    })
})