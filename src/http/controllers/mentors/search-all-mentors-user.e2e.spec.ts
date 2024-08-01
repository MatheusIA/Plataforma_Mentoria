import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search all mentors user (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it("should be able to search all mentors", async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoe2@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in C# and JavaScript",
            skills: ["C#", "JavaScript"]
        })

        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoe3@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in Angular",
            skills: ["Angular"]
        })

        const response = await request(app.server)
        .get('/search/all/mentors')
        .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body.mentors).toEqual(expect.arrayContaining([
          expect.objectContaining({
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"],
            user: expect.objectContaining({
              name: "Jonh Doe",
              email: "jonhdoe@example.com",
            })
          }),

          expect.objectContaining({
            bio: "Mentor with experience in C# and JavaScript",
            skills: ["C#", "JavaScript"],
            user: expect.objectContaining({
              name: "Jonh Doe 2",
              email: "jonhdoe2@example.com",
            })
          }),

          expect.objectContaining({
            bio: "Mentor with experience in Angular",
            skills: ["Angular"],
            user: expect.objectContaining({
              name: "Jonh Doe 3",
              email: "jonhdoe3@example.com",
            })
          })
        ]));
      });
    });