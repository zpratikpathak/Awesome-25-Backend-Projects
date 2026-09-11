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

function main() {
  const client = new greetingProto.Greeter(process.env.GRPC_TARGET || 'localhost:50051', grpc.credentials.createInsecure());
  const user = process.argv.length >= 3 ? process.argv[2] : 'World';
  
  client.sayHello({ name: user }, { deadline: Date.now() + 5000 }, function(err, response) {
    client.close();
    if (err) {
      console.error(err);
      process.exitCode = 1;
      return;
    }
    console.log('Greeting:', response.message);
  });
}

main();
