const assert = require('node:assert/strict');
const server = require('./server').listen(0, '127.0.0.1');
(async () => {
  await require('node:events').once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/api/hello`)).status, 200);
    assert.equal((await fetch(`${base}/api/error`)).status, 500);
    assert.equal((await fetch(`${base}/api/slow`)).status, 200);
    for (let i = 0; i < 10; i++) assert.equal((await fetch(`${base}/unknown-${i}`)).status, 404);
    const response = await fetch(`${base}/metrics`);
    assert.equal(response.status, 200);
    const metrics = await response.text();
    assert.ok(metrics.includes('node_process_cpu_user_seconds_total'));
    assert.ok(metrics.includes('http_request_duration_seconds'));
    assert.ok(metrics.includes('route="unmatched"'));
    assert.ok(!metrics.includes('unknown-'));
    console.log('PASS metrics registry, demo routes, bounded route labels');
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });