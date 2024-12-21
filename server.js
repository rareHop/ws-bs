import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static('dist'));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();
const messageHistory = [];
const activeUsers = new Set();

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  const clientData = {
    id: clientId,
    username: `User-${clientId.slice(0, 4)}`,
    joinedAt: Date.now()
  };
  
  clients.set(ws, clientData);
  activeUsers.add(clientData);

  // Send connection confirmation with client ID and message history
  ws.send(JSON.stringify({
    type: 'connected',
    data: { 
      clientId,
      messageHistory,
      users: Array.from(activeUsers)
    }
  }));

  // Broadcast new user joined
  broadcast({
    type: 'userJoined',
    data: clientData
  }, ws);

  ws.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      
      switch (message.type) {
        case 'setUsername':
          clientData.username = message.data;
          broadcast({
            type: 'userUpdated',
            data: clientData
          });
          break;
          
        case 'chat':
          const chatMessage = {
            id: uuidv4(),
            userId: clientId,
            username: clientData.username,
            text: message.data,
            timestamp: Date.now()
          };
          messageHistory.push(chatMessage);
          if (messageHistory.length > 100) {
            messageHistory.shift();
          }
          broadcast({
            type: 'message',
            data: chatMessage
          });
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    activeUsers.delete(clientData);
    broadcast({
      type: 'userLeft',
      data: clientData
    });
    clients.delete(ws);
  });
});

function broadcast(message, excludeWs = null) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(messageStr);
    }
  });
}

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});