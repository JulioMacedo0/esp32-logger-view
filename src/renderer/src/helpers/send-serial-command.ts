import { COMMAND, COMMANDS, ETX, STX } from '@renderer/constants/commands'
import { SerialPort } from 'serialport'

export function sendSerialCommand(port: SerialPort, command: COMMAND): void {
  const cmdByte = COMMANDS[command]

  const frame = new Uint8Array([STX, cmdByte, ETX])

  port.write(frame, (err) => {
    if (err) {
      console.error(`Erro ao enviar comando ${command}:`, err.message)
    } else {
      console.log(`Comando enviado: ${command} (0x${cmdByte.toString(16).padStart(2, '0')})`)
    }
  })
}
