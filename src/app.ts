import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { usersRoutes } from "./http/controllers/users/routes";
import { env } from "./env";
import { ZodError } from "zod";
import { fastifyJwt } from "@fastify/jwt";
import { authenticateRoutes } from "./http/controllers/authenticate/routes";
import { mentorsRoute } from "./http/controllers/mentors/routes";
import { mentorshipRoutes } from "./http/controllers/mentorship/routes";
import { authRoutes } from "./http/controllers/auth/routes";
import { reviewRoutes } from "./http/controllers/reviews/routes";

export const app = fastify();

app.register(fastifyCors, {
    origin: '*'
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: "Plataforma Mentoria",
            description: 'Especificações da API para o back-end da aplicação.',
            version: '1.0.0'
        },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: "Enter 'Bearer' [space] and then your token in the text input below."
            }
        },
        security: [{ Bearer: []}]
    },
    transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
})

// Rotas
app.register(authenticateRoutes)
app.register(usersRoutes);
app.register(mentorsRoute)
app.register(mentorshipRoutes)
app.register(authRoutes)
app.register(reviewRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format() });
    }

    if(env.NODE_ENV !== 'development') {
        console.error(error);
    }

    return reply.status(500).send({ message: "Internal server error." });
});

app.ready(err => {
    if (err) throw err;
    app.swagger();
});