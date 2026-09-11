const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'greeting.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const greetingProto = grpc.loadPackageDefinition(packageDefinition).greeting;

function sayHello(call, callback) {
  if (typeof call.request.name !== 'string' || !call.request.name.trim() || call.request.name.length > 100) {
    callback({ code: grpc.status.INVALID_ARGUMENT, details: 'name must contain 1–100 characters' });
    return;
  }
  callback(null, { message: 'Hello ' + call.request.name });
}

function main() {
  const server = new grpc.Server({ 'grpc.max_receive_message_length': 4096 });
  server.addService(greetingProto.Greeter.service, { sayHello: sayHello });
  const port = process.env.PORT || '50051';
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error) => {
    if (error) { console.error(error.message); process.exitCode = 1; return; }
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

if (require.main === module) main();
module.exports = { sayHello, greetingProto };
