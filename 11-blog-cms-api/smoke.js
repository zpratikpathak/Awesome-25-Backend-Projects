const assert = require('node:assert/strict');
const server = require('./src/app').listen(0, '127.0.0.1', async () => {
    const url = `http://127.0.0.1:${server.address().port}/api/posts`;
    const post = body => fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    try {
        for (const body of [null, [], {}, {title: '   ', content: '          '}]) {
            const response = await post(body);
            assert.equal(response.status, 400);
            assert.ok((await response.json()).errors || body === null);
        }
        assert.equal((await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{'})).status, 400);
        assert.equal((await post({title: 'Title', content: 'x'.repeat(110000)})).status, 413);
        const response = await post({title: ' Title ', content: 'Useful content here', id: 'spoof', secret: 'strip'});
        assert.equal(response.status, 201);
        const created = await response.json();
        assert.equal(created.title, 'Title');
        assert.notEqual(created.id, 'spoof');
        assert.equal(created.secret, undefined);
        assert.deepEqual(await (await fetch(url)).json(), [created]);
        console.log('PASS blog: live HTTP, create/list, ID spoofing, stripped fields, invalid/oversized JSON');
    } catch (error) { console.error(error); process.exitCode = 1; }
    finally { server.close(); }
});