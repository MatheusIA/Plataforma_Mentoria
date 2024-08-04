import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get mentee profile (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to get mentee profile", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user2 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoementee1@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const user3 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoementee2@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const response = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: user2.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.mentee).toEqual(
            expect.objectContaining({
                id: 1,
                userId: 2,
                user: {
                    id: 2,
                    name: 'Jonh Doe 2',
                    email: 'jonhdoementee1@example.com',
                    role: 'MENTEE',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
            }
        }))
        
        
    })
})