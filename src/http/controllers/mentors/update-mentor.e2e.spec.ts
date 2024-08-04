import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update Mentor (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to update mentor data", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoementor@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentoring in JavaScript, NodeJS and React",
            skills: ["JavaScript", "NodeJS", "React"],
        })

        const mentor = await request(app.server)
        .get('/mentor/profile/')
        .query({ userId: user.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const response = await request(app.server)
        .patch(`/update/user/mentor/${mentor.body.mentor.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Jonh Doe Update",
            email: "jonhdoementor@update.com",
            password: "123456",
            bio: "Mentoring in JavaScript and NodeJS",
            skills: ["JavaScript", "NodeJS"],
        })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: "Jonh Doe Update",
                email: "jonhdoementor@update.com",
                role: "MENTOR",
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            })
        )

        expect(response.body.mentor).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                bio: "Mentoring in JavaScript and NodeJS",
                skills: ["JavaScript", "NodeJS"],
                userId: expect.any(Number)
            })
        )
    })
})