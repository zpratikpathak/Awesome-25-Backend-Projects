const assert = require('node:assert/strict');
const { writeFile, symlink, unlink } = require('node:fs/promises');
const server = require('./index').listen(0, '127.0.0.1');
(async () => {
  await require('node:events').once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = videoUrl => fetch(`${base}/metadata`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoUrl }) });
  try {
    const wav = Buffer.alloc(844);
    wav.write('RIFF'); wav.writeUInt32LE(836, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(800, 40);
    await writeFile('/media/smoke.wav', wav);
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    for (const input of ['https://example.com/video', '../etc/passwd', 'x";touch pwned', {}]) assert.equal((await post(input)).status, 400);
    assert.equal((await post('missing.mp4')).status, 404);
    const response = await post('smoke.wav');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).streams[0].codec_type, 'audio');
    await symlink('/etc/passwd', '/media/escape');
    assert.equal((await post('escape')).status, 400);
    console.log('PASS real ffprobe fixture, injection/path/URL/symlink rejection');
  } finally { await unlink('/media/smoke.wav').catch(() => {}); await unlink('/media/escape').catch(() => {}); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });