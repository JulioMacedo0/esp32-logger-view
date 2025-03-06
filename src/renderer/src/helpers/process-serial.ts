import { END_BYTE, START_BYTE, RESPONSES, LOG_START_BYTE } from '@renderer/constants/commands'
import { useLogStore } from '@renderer/stores/log-store'

import { usePresenceStore } from '@renderer/stores/presence-store'

let serialBuffer: Buffer = Buffer.alloc(0)

export function processSerialData(data: Buffer): void {
  serialBuffer = Buffer.concat([serialBuffer, data])

  while (serialBuffer.length > 0) {
    const startIndex = serialBuffer.indexOf(START_BYTE)
    const logStartIndex = serialBuffer.indexOf(LOG_START_BYTE)

    if (startIndex === -1 && logStartIndex === -1) {
      serialBuffer = Buffer.alloc(0)
      return
    }

    const firstIndex = Math.min(
      startIndex === -1 ? Infinity : startIndex,
      logStartIndex === -1 ? Infinity : logStartIndex
    )

    if (firstIndex > 0) {
      serialBuffer = serialBuffer.slice(firstIndex)
    }

    if (serialBuffer[0] === LOG_START_BYTE) {
      const endIndex = serialBuffer.indexOf(END_BYTE, 1)
      if (endIndex === -1) {
        return
      }

      const logData = serialBuffer.slice(1, endIndex)
      const logMessage = logData.toString('utf8')
      useLogStore.getState().addLog(logMessage)

      serialBuffer = serialBuffer.slice(endIndex + 1)
      continue
    }

    if (serialBuffer[0] === START_BYTE) {
      const endIndex = serialBuffer.indexOf(END_BYTE, 1)
      if (endIndex === -1) {
        return
      }

      const command = serialBuffer.slice(1, endIndex)
      handleCommand(command)

      serialBuffer = serialBuffer.slice(endIndex + 1)
    }
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
