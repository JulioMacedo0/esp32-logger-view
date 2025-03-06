import { END_BYTE, START_BYTE, RESPONSES } from '@renderer/constants/commands'
import { usePresenceStore } from '@renderer/stores/presence-store'

let serialBuffer: Buffer = Buffer.alloc(0)

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
  const { togglePresence } = usePresenceStore.getState()
  switch (command[0]) {
    case RESPONSES.PONG:
      console.log(`Resposta válida: ${command[0]}`)
      break
    case RESPONSES.CMD_DETECTION_ON:
      togglePresence(true)
      console.log(`Resposta válida: ${command[0]}`)
      break
    case RESPONSES.CMD_DETECTION_OFF:
      togglePresence(false)
      console.log(`Resposta válida: ${command[0]}`)
      break
    default:
      console.warn(`Comando desconhecido ${command[0].toString()} == ${RESPONSES.PONG}`)
      break
  }
}
