import { SCOPES } from "googleClient";

const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  '1090921743456-tflimci1ktebsj4i7ji6pv0g69a61v6f.apps.googleusercontent.com',
  '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',
  'http://localhost:3333/redirect'
);

const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  redirect_uri: 'http://localhost:3333/redirect'
});

console.log('Authorize this app by visiting this url:', authorizeUrl);
