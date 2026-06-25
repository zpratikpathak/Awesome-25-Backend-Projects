const assert = require('node:assert/strict');
const app = require('./src/app');
const cron = require('node-cron');
const server = app.listen(0, '127.0.0.1', async () => {
    const url = `http://127.0.0.1:${server.address().port}/api/tasks`;
    const post = body => fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    try {
        for (const body of [null, [], {}, {name: ' ', cron: '* * * * *'}, {name: 'x', cron: 'invalid'}]) {
            const response = await post(body);
            assert.equal(response.status, 400);
            assert.ok((await response.json()).error);
        }
        assert.equal((await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{'})).status, 400);
        assert.equal((await post({name: 'x'.repeat(110000), cron: '* * * * *'})).status, 413);
        const response = await post({name: ' tick ', cron: '* * * * * *', id: 'spoof'});
        assert.equal(response.status, 201);
        const created = await response.json();
        assert.equal(created.name, 'tick');
        assert.notEqual(created.id, 'spoof');
        const deadline = Date.now() + 5000;
        let tasks;
        do {
            tasks = await (await fetch(url)).json();
            if (tasks[0].status === 'completed') break;
            await new Promise(resolve => setTimeout(resolve, 100));
        } while (Date.now() < deadline);
        assert.equal(tasks[0].status, 'completed');
        console.log('PASS scheduler: live HTTP, validation, malformed/oversized JSON, real cron tick');
    } catch (error) { console.error(error); process.exitCode = 1; }
    finally {
        for (const task of cron.getTasks().values()) await task.destroy();
        server.close();
    }
});