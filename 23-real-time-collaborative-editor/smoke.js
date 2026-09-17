const assert = require('node:assert/strict');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const WebSocket = require('ws');
const child = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT: '8093' }, stdio: ['ignore', 'pipe', 'inherit'] });
const timeout = setTimeout(() => { child.kill(); process.exitCode = 1; console.error('Smoke timeout'); }, 10000);
(async () => {
  let a, b;
  try {
    await once(child.stdout, 'data');
    const connect = async () => {
      const ws = new WebSocket('ws://127.0.0.1:8093');
      const init = once(ws, 'message');
      await once(ws, 'open');
      assert.equal(JSON.parse((await init)[0]).type, 'init');
      return ws;
    };
    a = await connect(); b = await connect();
    const update = once(b, 'message');
    a.send(JSON.stringify({ type: 'update', content: 'hello' }));
    assert.deepEqual(JSON.parse((await update)[0]), { type: 'update', content: 'hello' });
    const closed = once(a, 'close');
    a.send(JSON.stringify({ type: 'update', content: {} }));
    assert.equal((await closed)[0], 1008);
    console.log('PASS WebSocket startup, init, broadcast, invalid update');
  } finally { if (a) a.terminate(); if (b) b.terminate(); child.kill(); clearTimeout(timeout); }
})().catch(error => { console.error(error); process.exitCode = 1; });