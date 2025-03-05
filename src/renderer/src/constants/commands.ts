export const STX = 0x02
export const ETX = 0x03

export type COMMAND = 'FORWARD' | 'REVERSE' | 'STOP' | 'PING' | 'PONG'
export type RESPONSE = 'PONG'

export const COMMANDS: Record<COMMAND, number> = {
  FORWARD: 0x10,
  REVERSE: 0x11,
  STOP: 0x12,
  PING: 0x13,
  PONG: 0x14
} as const

export const RESPONSES: Record<RESPONSE, number> = {
  PONG: 0x14
} as const
