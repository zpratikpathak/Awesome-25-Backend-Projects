const assert = require('node:assert/strict');
const grpc = require('@grpc/grpc-js');
const { sayHello, greetingProto } = require('./server');
const server = new grpc.Server();
server.addService(greetingProto.Greeter.service, { sayHello });
server.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), async (error, port) => {
  let client;
  try {
    assert.ifError(error);
    client = new greetingProto.Greeter(`127.0.0.1:${port}`, grpc.credentials.createInsecure());
    const call = name => new Promise((resolve, reject) => client.sayHello({ name }, { deadline: Date.now() + 5000 }, (error, response) => error ? reject(error) : resolve(response)));
    assert.equal((await call('World')).message, 'Hello World');
    await assert.rejects(call(''), error => error.code === grpc.status.INVALID_ARGUMENT);
    await assert.rejects(call('x'.repeat(101)), error => error.code === grpc.status.INVALID_ARGUMENT);
    console.log('PASS gRPC real roundtrip and invalid names');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { if (client) client.close(); server.forceShutdown(); }
});