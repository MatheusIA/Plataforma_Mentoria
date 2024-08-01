import { getTokens } from "exchageToken";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import dotenv from 'dotenv';
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3333/redirect'
)

  
export async function authRoutes(app: FastifyInstance) {
    app.get('/auth', async (request: FastifyRequest, reply: FastifyReply) => {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });
        reply.redirect(authUrl);
    });
    
      app.get('/redirect', async (request: FastifyRequest, reply: FastifyReply) => {
        const code = request.query.code as string;
        console.log('Authorization code:', code);
        await getTokens(code);
        return reply.redirect('/register/mentorship');
    });
}