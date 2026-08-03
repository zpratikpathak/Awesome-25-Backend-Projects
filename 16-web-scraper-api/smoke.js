const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const https = require('node:https');
let calls = 0;
let status = 200;
https.get = (url, options, callback) => {
  calls++;
  const request = new EventEmitter();
  request.destroy = error => request.emit('error', error);
  process.nextTick(() => {
    const response = new EventEmitter();
    response.statusCode = status;
    response.resume = () => {};
    callback(response);
    response.emit('data', Buffer.from('<title>Local fixture</title><p>Hello</p>'));
    response.emit('end');
  });
  return request;
};
const server = require('./index').listen(0, '127.0.0.1');
(async () => {
  await require('node:events').once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${base}/scrape`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    for (const url of ['http://127.0.0.1', 'file:///etc/passwd', 'https://example.com.evil.test', 'https://user:pass@example.com']) assert.equal((await post({ url })).status, 400);
    assert.equal(calls, 0);
    assert.deepEqual(await (await post({ url: 'https://example.com' })).json(), { result: ['Local fixture'] });
    assert.equal((await post({ url: 'https://example.com', selector: '[' })).status, 400);
    status = 302;
    assert.equal((await post({ url: 'https://example.com' })).status, 502);
    console.log('PASS scraper: mocked upstream, SSRF rejection, selector, redirect');
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });