import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update Mentee (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to update mentee data", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoementee@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const mentee = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: user.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const response = await request(app.server)
        .patch(`/update/user/mentee/${mentee.body.mentee.id}`)
        .set("Authorization", ` Bearer ${token}`)
        .send({
            name: "Jonh Doe Update",
            email: "jonhdoementee@example.com",
            password: "123456"
        })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(
            expect.objectContaining({
                id: 2,
                name: 'Jonh Doe Update',
                email: 'jonhdoementee@example.com',
                role: 'MENTEE',
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
        }))

    })
})