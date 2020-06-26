import Socket from "ws"

export function constructSocket(ws: Socket) {
  let map: Map<any, any> = new Map
  return {
    onMessage(f: (s: any) => void) {
      let a = (s) => {
        f(JSON.parse(s.data))
      }
      map.set(f, a)
      ws.addEventListener("message", a)
      return f
    },
    offMessage(f: (s: any) => void) {
      ws.removeEventListener("message", map.get(f))
      map.delete(f)
      return f
    },
    send(msg: any) {
      ws.send(JSON.stringify(msg))
    }
  }
}