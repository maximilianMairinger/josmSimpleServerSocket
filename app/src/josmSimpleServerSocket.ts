import Socket from "ws"
import { Data, DataBase } from "josm"
import { constructSocket } from "./lib/ws"

type Dat = Data | DataBase

function parseIniter(args: Dat | { data: Dat, write?: boolean, read?: boolean }): { data: Dat, write: boolean, read: boolean } {
  //@ts-ignore
  return args instanceof Data || args instanceof DataBase ? { data: args, write: true, read: true } : { data: args.data, write: args.write === undefined ? true : args.write, read: args.read === undefined ? true : args.read }
}

export default function(initer?: (identifier?: string) => (Dat | { data: Dat, write?: boolean, read?: boolean }), port: number = 8080) {
  const wss = new Socket.Server({ port });

  
  wss.on('connection', (ws) => {
    const { send, onMessage, offMessage} = constructSocket(ws)


    let init = (o: {intent: "put", type?: "data" | "database", data?: any} | {intent: "get", identifier?: string}) => {
      let d: { data: Dat, write: boolean, read: boolean }
      if (o.intent === "get") {
        d = parseIniter(initer(o.identifier))
      }
      else {

      }


      let isData = d.data instanceof Data
      offMessage(init)
      if (d.read) {
        if (isData) {
          let sub = (d.data as Data).get(send, false)
          
          send({data: (d.data as Data).get(), type: d.data instanceof Data ? "data" : "database", write: d.write, read: d.read })

          if (d.write) {
            onMessage((msg) => {
              sub.active(false);
              (d.data as Data).set(msg)
              sub.active(true) 
            })
          }
        }
        else {

        }

      }
      else {
        send({type: d.data instanceof Data ? "data" : "database", write: d.write, read: d.read })
        if (d.write) {
          if (isData) {
            onMessage((d.data as Data).set)
          }
          else {
  
          }
        }
      }
      
      
    }
    
    onMessage(init)
  });

  console.log("WebSocket running on port: ", port)
}
