const assert = require('node:assert/strict');
const service = require('./src/services/chat.service');
const server = require('./src/app');

// Native Engine.IO polling carries real Socket.IO packets; no extra client dependency.
async function client(base) {
  const endpoint = `${base}/socket.io/?EIO=4&transport=polling`;
  const handshake = await (await fetch(endpoint)).text();
  assert.match(handshake, /^0\{/);
  const url = `${endpoint}&sid=${JSON.parse(handshake.slice(1)).sid}`;
  const send = async packet => {
    const response = await fetch(url, { method: 'POST', body: packet });
    assert.equal(response.status, 200);
  };
  const pending = [];
  const next = async name => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const index = pending.findIndex(event => event[0] === name);
      if (index >= 0) return pending.splice(index, 1)[0][1];
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      assert.equal(response.status, 200);
      for (const packet of (await response.text()).split('\x1e')) {
        if (packet === '2') await send('3');
        if (packet.startsWith('42')) pending.push(JSON.parse(packet.slice(2)));
      }
    }
    throw new Error(`Missing event: ${name}`);
  };
  await send('40');
  return { next, emit: (name, value) => send(`42${JSON.stringify([name, value])}`), close: () => send('41\x1e1') };
}

(async () => {
  server.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const clients = [];
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    const alice = await client(base); clients.push(alice);
    const bob = await client(base); clients.push(bob);
    assert.deepEqual(await alice.next('history'), []);
    assert.deepEqual(await bob.next('history'), []);
    await alice.emit('join', { username: 'invalid' });
    assert.equal(await alice.next('error'), 'Invalid username');
    await alice.emit('join', ' Alice ');
    assert.equal(await bob.next('user_joined'), 'Alice');
    await alice.emit('join', 'Changed');
    assert.equal(await alice.next('error'), 'Already joined');
    await alice.emit('message', { text: '  ' });
    assert.equal(await alice.next('error'), 'Invalid message format');
    await alice.emit('message', { text: ' Hello ' });
    const message = await alice.next('message');
    assert.equal(message.text, 'Hello');
    assert.equal(message.sender, 'Alice');
    assert.deepEqual(await bob.next('message'), message);
    await bob.emit('join', 'Bob');
    assert.equal(await alice.next('user_joined'), 'Bob');
    await bob.emit('message', { text: 'Reply' });
    const reply = await alice.next('message');
    assert.equal(reply.sender, 'Bob');
    assert.deepEqual(await bob.next('message'), reply);
    await alice.close(); clients.shift();
    assert.equal(await bob.next('user_left'), 'Alice');
    for (let i = 0; i < 110; i++) service.saveMessage('Bob', String(i));
    assert.equal(service.getRecentMessages().length, 100);
    console.log('Chat two-client network smoke passed');
  } finally {
    await Promise.all(clients.map(connection => connection.close()));
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });