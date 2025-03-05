import { END_BYTE, START_BYTE, RESPONSES } from '@renderer/constants/commands'

let serialBuffer: Buffer = Buffer.alloc(0)
let count = 0
export function processSerialData(data: Buffer): void {
  serialBuffer = Buffer.concat([serialBuffer, data])

  while (serialBuffer.length > 0) {
    const startIndex = serialBuffer.indexOf(START_BYTE)
    if (startIndex === -1) {
      serialBuffer = Buffer.alloc(0)
      return
    }

    if (startIndex > 0) {
      serialBuffer = serialBuffer.slice(startIndex)
    }

    const endIndex = serialBuffer.indexOf(END_BYTE, 1)
    if (endIndex === -1) {
      return
    }

    const command = serialBuffer.slice(1, endIndex)

    handleCommand(command)

    serialBuffer = serialBuffer.slice(endIndex + 1)
  }
}

function handleCommand(command: Buffer): void {
  if (command[0] == RESPONSES.PONG) {
    count++
    console.log(`Resposta válida: ${command[0]}  ${count} validos`)
  } else {
    console.warn(`Comando desconhecido ${command[0].toString()} == ${RESPONSES.PONG}`)
  }
}
