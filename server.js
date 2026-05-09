const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const WEBHOOK = 'https://discord.com/api/webhooks/1502498874474893372/LRbv_VQtXKSBrh1LzEeXixiUSTGOnxGI-BuwRTcggoMPNB5aX57X7VKCk0qZWYXQwfR2';

app.post('/denuncia', async (req, res) => {
  try {
    const { autor, alvo, tipo, desc, video, data } = req.body;

    const payload = {
      username: '🚨 Tyller City — Denúncias',
      embeds: [{
        title: '🚨 Nova Denúncia Recebida',
        color: 0x8b2fc9,
        fields: [
          { name: '👤 Denunciante',    value: autor || '?', inline: true },
          { name: '🎯 Denunciado',     value: alvo  || '?', inline: true },
          { name: '⚠️ Tipo',           value: tipo  || '?', inline: false },
          { name: '📋 Descrição',      value: desc  || '?', inline: false },
          { name: '🎥 Prova em vídeo', value: video || 'Nenhuma prova enviada', inline: false },
        ],
        footer: { text: 'Tyller City · Sistema de Denúncias · ' + data }
      }]
    };

    const discordRes = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (discordRes.ok || discordRes.status === 204) {
      res.json({ ok: true });
    } else {
      const err = await discordRes.text();
      res.status(500).json({ ok: false, error: err });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/', (req, res) => res.send('Tyller City API - Online ✅'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
