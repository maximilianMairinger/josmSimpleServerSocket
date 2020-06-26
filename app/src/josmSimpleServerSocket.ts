import Socket from "ws"
 



export default function(port: number = 8080) {
  const wss = new Socket.Server({ port });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });
  
    ws.send('something');
  });

  console.log("WebSocket running on port: ", port)
}
