const assert = require('node:assert/strict');
process.env.JWT_SECRET = require('node:crypto').randomBytes(32).toString('hex');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
(async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/auth`;
  const post = (route, body) => fetch(`${base}/${route}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const user = { username: 'tester', password: 'Long password!1' };
  try {
    assert.equal((await post('register', {})).status, 400);
    assert.equal((await post('register', { ...user, password: 'short' })).status, 400);
    assert.equal((await post('register', { ...user, password: 'é'.repeat(40) })).status, 400);
    const registrations = await Promise.all([post('register', user), post('register', user)]);
    assert.deepEqual(registrations.map(r => r.status).sort(), [201, 409]);
    assert.equal((await post('login', { ...user, password: 'Wrong password!' })).status, 401);
    const response = await post('login', user);
    assert.equal(response.status, 200);
    const claims = jwt.verify((await response.json()).token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    assert.equal(claims.exp - claims.iat, 3600);
    assert.match(claims.id, /^[a-f0-9-]{36}$/);
    console.log('Auth smoke passed');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });