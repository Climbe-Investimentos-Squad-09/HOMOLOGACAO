//=================================================================
// Implementação automática do OAuth 2.0 para testar as APIs Google
// Fluxo automático: captura o "code" no localhost e armazena token
//=================================================================

const fs = require('fs');
const express = require('express');
const { google } = require('googleapis');
const open = require('open'); // abre URL no navegador automaticamente

const credentials = require('./credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // http://localhost:3000/oauth2callback
);

const app = express();
const PORT = 3000;

// Função para gerar URL de autenticação e abrir navegador
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/calendar'
    ],
  });

  console.log('Abrindo navegador para autorizar o app...');
  open.default(authUrl); // abre automaticamente a URL no navegador
}

// Checa se já existe token salvo
if (fs.existsSync('token.json')) {
  const token = JSON.parse(fs.readFileSync('token.json'));
  oAuth2Client.setCredentials(token);
  console.log("\nToken salvo anteriormente");
  startApp(oAuth2Client);
} else {
  console.log("\nNenhum token encontrado. Iniciando fluxo de autorização...");
  getAccessToken(oAuth2Client);
}

// Endpoint para receber o código automaticamente
app.get('/oauth2callback', async (req, res) => {
  console.log("\nRecebendo código de autorização...");

  const code = req.query.code;
  if (!code) return res.send('Nenhum código de autorização foi recebido.');

  try {
    const { tokens } = await oAuth2Client.getToken(String(code));
    oAuth2Client.setCredentials(tokens);

    console.log('Token salvo');

    res.send('Autenticação concluída! Você pode fechar esta aba.');
    startApp(oAuth2Client);
  } catch (err) {
    console.error('Erro ao obter o token:', err);
    res.send('Erro ao autenticar.');
  }
});

// Enviar token
app.get('/generalAcess', async (req, res) => {
  try {
    // Lê o token salvo pelo auth
    const token = JSON.parse(fs.readFileSync('token.json', 'utf-8'));

    // Atualiza as credenciais do OAuth2Client
    oAuth2Client.setCredentials(token);

    // Retorna o token completo como JSON
    res.status(200).json({
      success: true,
      token, // inclui access_token, refresh_token, expiry_date etc.
    });
  } catch (error) {
    console.error("[/generalAcess] Erro ao ler token.json:", error);
    res.status(500).json({
      success: false,
      message: "Não foi possível obter o token",
      error: error.message,
    });
  }
});


// Inicia servidor local
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
