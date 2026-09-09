const fs = require('fs');
const https = require('https');
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).map((line) => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
const body = JSON.stringify({ model: env.NVIDIA_MODEL, temperature: 0.2, top_p: 1, max_tokens: 1, stream: false, messages: [{ role: 'user', content: 'Hi' }] });
const url = new URL(`${env.NVIDIA_BASE_URL}/chat/completions`);
const exitTimer = setTimeout(() => { console.log('CHAT_CHECK=TIMED_OUT'); process.exit(1); }, 35_000);
const req = https.request({ hostname: url.hostname, family: 4, path: url.pathname, method: 'POST', headers: { Authorization: `Bearer ${env.NVIDIA_API_KEY}`, Accept: 'application/json', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), Connection: 'close' } }, (res) => {
  let response = '';
  res.on('data', (chunk) => { response += chunk; });
  res.on('end', () => { clearTimeout(exitTimer); console.log(`CHAT_STATUS=${res.statusCode}`); console.log(`CHAT_RESPONSE=${response.slice(0, 600)}`); });
});
req.on('socket', () => console.log('SOCKET_CONNECTED=true'));
req.on('error', (error) => { clearTimeout(exitTimer); console.log(`CHAT_ERROR=${error.message}`); });
req.end(body);
