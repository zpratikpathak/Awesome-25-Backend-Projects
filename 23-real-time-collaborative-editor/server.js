const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: Number(process.env.PORT || 8080), maxPayload: 65536 });

// Simple state representation for demo purposes.
// In a real app, you would use Yjs or ShareDB for CRDT/OT.
let documentState = "";

const clients = new Set();

wss.on('connection', function connection(ws) {
  ws.on('error', () => {});
  if (clients.size >= 100) { ws.close(1013, 'Server full'); return; }
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);

  // Send initial state
  ws.send(JSON.stringify({ type: 'init', content: documentState }));

  ws.on('message', function message(data) {
    try {
      const msg = JSON.parse(data);
      if (!msg || msg.type !== 'update' || typeof msg.content !== 'string' || Buffer.byteLength(msg.content) > 60000) {
        ws.close(1008, 'Invalid update'); return;
      }
      if (msg.type === 'update') {
        documentState = msg.content; // In real life, apply OT/CRDT delta here
        // Broadcast to all OTHER clients
        for (const client of clients) {
          if (client !== ws && client.readyState === 1) {
            if (client.bufferedAmount > 1024 * 1024) { client.terminate(); continue; }
            client.send(JSON.stringify({ type: 'update', content: documentState }));
          }
        }
      }
    } catch (e) {
      ws.close(1008, 'Invalid JSON');
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

wss.on('listening', () => console.log(`WebSocket server running on ws://localhost:${wss.address().port}`));
wss.on('error', error => { console.error(error.message); process.exitCode = 1; });
