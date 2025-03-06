export const START_BYTE = 0x02
export const END_BYTE = 0x03
export const LOG_START_BYTE = 0x04

export type COMMAND = 'FORWARD' | 'REVERSE' | 'STOP' | 'PING' | 'PONG'
export type RESPONSE = 'PONG' | 'CMD_DETECTION_ON' | 'CMD_DETECTION_OFF'

export const COMMANDS: Record<COMMAND, number> = {
  FORWARD: 0x10,
  REVERSE: 0x11,
  STOP: 0x12,
  PING: 0x13,
  PONG: 0x14
} as const

export const RESPONSES: Record<RESPONSE, number> = {
  PONG: 0x14,
  CMD_DETECTION_ON: 0x15,
  CMD_DETECTION_OFF: 0x16
} as const
