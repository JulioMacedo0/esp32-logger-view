import { SerialPort } from 'serialport'
import { useEffect, useRef, useState } from 'react'
import { processSerialData } from '@renderer/helpers/process-serial'
import { sendSerialCommand } from '@renderer/helpers/send-serial-command'
import { usePresenceStore } from '@renderer/stores/presence-store'

type log = {
  message: string
  timestemp: string
}

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function Home(): JSX.Element {
  const port = useRef<SerialPort | null>(null)
  const divRef = useRef<HTMLDivElement | null>(null)
  const { isActive } = usePresenceStore()
  const [logs, setLogs] = useState<log[]>([])

  const addLog = (message: string): void => {
    const log = {
      message,
      timestemp: new Date().toLocaleTimeString()
    }

    setLogs((prevLogs) => [...prevLogs, log])
  }

  const scrollToBottom = (): void => {
    divRef.current?.scroll({
      top: divRef.current?.scrollHeight,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const ConnetToEsp32 = async (ref: React.MutableRefObject<SerialPort | null>): Promise<void> => {
    if (ref.current?.opening) {
      await delay(500)
      return ConnetToEsp32(ref)
    }
    const ports = await SerialPort.list()

    const myDevice = ports.find(
      (port) => port.vendorId?.toLowerCase() === '10c4' && port.productId?.toLowerCase() === 'ea60'
    )

    if (myDevice) {
      const serialPort = new SerialPort(
        { path: myDevice.path, baudRate: 115200, lock: false },
        (err) => {
          if (err) {
            console.log(err)

            return
          }

          addLog(`Connedted in ${myDevice.manufacturer} on port ${myDevice.path}`)
          serialPort.write('ON\n')
        }
      )
      serialPort.on('open', () => {
        console.log('port open')
      })

      serialPort.on('data', (data) => {
        processSerialData(data)
        addLog(data.toString())
      })

      serialPort.on('close', async () => {
        addLog('[close] Device disconnected, try to connect...')
        await delay(500)
        ConnetToEsp32(ref)
      })
      ref.current = serialPort
    } else {
      addLog('[else] Device not found, try to connect...')
      await delay(500)
      ConnetToEsp32(ref)
    }
  }

  useEffect(() => {
    ConnetToEsp32(port)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendSerialCommand('PING', port?.current)
    }, 1000)

    return (): void => {
      clearInterval(intervalId)
      console.log('cancel interval')
    }
  }, [port])

  return (
    <div className="min-h-screen bg-gray-300 p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">ESP32 Serial Monitor</h1>
      <h2>{`detection ${isActive}`}</h2>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
          onClick={() => sendSerialCommand('FORWARD', port?.current)}
        >
          ON
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
          onClick={() => sendSerialCommand('STOP', port?.current)}
        >
          OFF
        </button>
      </div>
      <div
        className="mt-4 w-full max-w-2xl h-80 bg-black text-green-400 font-mono overflow-y-auto p-4 rounded-lg"
        ref={divRef}
      >
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <p key={index}>
              <span className="text-gray-400">[{log.timestemp}]</span> {log.message}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
