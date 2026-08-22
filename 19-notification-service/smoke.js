const assert = require('node:assert/strict');
const server = require('./index').listen(0, '127.0.0.1');
(async () => {
  await require('node:events').once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${base}/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    assert.equal((await post({ userId: [], message: 'hello' })).status, 400);
    const responses = await Promise.all([post({ userId: 'u', message: 'hello' }), post({ userId: 'u', message: 'hello' })]);
    assert.ok(responses.every(response => response.status === 202));
    const jobs = await Promise.all(responses.map(response => response.json()));
    assert.notEqual(jobs[0].jobId, jobs[1].jobId);
    await new Promise(resolve => setTimeout(resolve, 2100));
    assert.equal((await (await fetch(`${base}/status/${jobs[0].jobId}`)).json()).status, 'sent');
    assert.equal((await fetch(`${base}/status/missing`)).status, 404);
    console.log('PASS simulated queue, unique IDs, validation, completion');
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });