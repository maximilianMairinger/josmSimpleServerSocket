import josmSimpleServerSocket from "./../../app/src/josmSimpleServerSocket"
import { constructIndexStore } from "./lib/indexing"
import { Data } from "josm"


let index = constructIndexStore((s: string) => new Data("New Session"))

josmSimpleServerSocket((s) => {
  let v = index(s)
  return v
})
