const assert = require('node:assert/strict');
const server = require('./src/app').listen(0, '127.0.0.1', async () => {
    const url = `http://127.0.0.1:${server.address().port}/api/catalog`;
    try {
        const response = await fetch(url);
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), [{id: 1, name: 'Item'}]);
        assert.equal((await fetch(url, {method: 'POST'})).status, 404);
        assert.equal((await fetch(url + '/missing')).status, 404);
        const bad = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{'});
        assert.equal(bad.status, 400);
        assert.deepEqual(await bad.json(), {error: 'Invalid request body'});
        console.log('PASS catalog: live HTTP, static listing, unknown routes/methods, malformed JSON');
    } catch (error) { console.error(error); process.exitCode = 1; }
    finally { server.close(); }
});