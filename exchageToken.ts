import { oAuth2Client } from './googleClient';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function getTokens(code: string) {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Access token or refresh token not obtained');
    }

    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const updatedEnvFile = envFile
      .replace(/GOOGLE_ACCESS_TOKEN=.*/, `GOOGLE_ACCESS_TOKEN=${tokens.access_token}`)
      .replace(/GOOGLE_REFRESH_TOKEN=.*/, `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    fs.writeFileSync(envPath, updatedEnvFile);

    dotenv.config();

  } catch (error) {
    console.error('Error retrieving tokens:', error);
  }
}

export { getTokens };
