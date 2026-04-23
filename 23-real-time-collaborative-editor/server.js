const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

// Simple state representation for demo purposes.
// In a real app, you would use Yjs or ShareDB for CRDT/OT.
let documentState = "";

const clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);

  // Send initial state
  ws.send(JSON.stringify({ type: 'init', content: documentState }));

  ws.on('message', function message(data) {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'update') {
        documentState = msg.content; // In real life, apply OT/CRDT delta here
        // Broadcast to all OTHER clients
        for (const client of clients) {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify({ type: 'update', content: documentState }));
          }
        }
      }
    } catch (e) {
      console.error("Invalid message", e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
