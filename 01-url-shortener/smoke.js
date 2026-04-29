const assert = require('node:assert/strict');
const app = require('./src/app');
(async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${base}/shorten`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  try {
    for (const url of ['bad', 'javascript:alert(1)', 'ftp://example.com', 'https://user:pass@example.com']) assert.equal((await post({ url })).status, 400);
    assert.equal((await post(null)).status, 400);
    const response = await post({ url: 'https://example.com/path' });
    assert.equal(response.status, 201);
    const data = await response.json();
    assert.match(data.shortUrl, /^http:\/\/localhost:3000\/[a-f0-9]{16}$/);
    const redirect = await fetch(`${base}/${data.id}`, { redirect: 'manual' });
    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.get('location'), 'https://example.com/path');
    assert.equal((await fetch(`${base}/missing`)).status, 404);
    console.log('URL smoke passed');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });