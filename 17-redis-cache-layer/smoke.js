const assert = require('node:assert/strict');
const server = require('./index').listen(0, '127.0.0.1');
(async () => {
  await require('node:events').once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    const first = await (await fetch(`${base}/data/demo`)).json();
    const second = await (await fetch(`${base}/data/demo`)).json();
    assert.equal(first.source, 'db');
    assert.equal(second.source, 'cache');
    assert.deepEqual(first.data, second.data);
    assert.equal((await fetch(`${base}/data/${'x'.repeat(65)}`)).status, 400);
    console.log('PASS memory-cache miss/hit and input boundary');
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });