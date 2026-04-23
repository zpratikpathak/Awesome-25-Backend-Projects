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
  const client = new greetingProto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  const user = process.argv.length >= 3 ? process.argv[2] : 'World';
  
  client.sayHello({ name: user }, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Greeting:', response.message);
  });
}

main();
