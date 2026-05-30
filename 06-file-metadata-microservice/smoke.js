const assert = require('node:assert/strict');
const app = require('./src/app');
(async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/file/upload`;
  const upload = (field, content) => {
    const form = new FormData();
    form.append(field, new Blob([content], { type: 'text/plain' }), 'hello.txt');
    return fetch(url, { method: 'POST', body: form });
  };
  try {
    const response = await upload('upfile', 'hello');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { name: 'hello.txt', type: 'text/plain', size: 5 });
    assert.equal((await fetch(url, { method: 'POST' })).status, 400);
    assert.equal((await upload('wrong', 'hello')).status, 400);
    assert.equal((await upload('upfile', new Uint8Array(5 * 1024 * 1024 + 1))).status, 413);
    console.log('Upload smoke passed');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });