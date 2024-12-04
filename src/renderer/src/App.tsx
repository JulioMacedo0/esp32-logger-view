import { SerialPort } from 'serialport'
import { useEffect, useRef, useState } from 'react'

type log = {
  message: string
  timestemp: string
}

function App(): JSX.Element {
  const port = useRef<SerialPort | null>(null)
  const divRef = useRef<HTMLDivElement | null>(null)
  const [logs, setLogs] = useState<log[]>([])

  const addLog = (message: string): void => {
    const log = {
      message,
      timestemp: new Date().toLocaleTimeString()
    }
    setLogs((prevLogs) => [...prevLogs, log])
  }

  const scrollToBottom = (): void => {
    console.log(divRef.current)
    divRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const ConnetToEsp32 = async (): Promise<void> => {
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
          console.log(`Connedted in ${myDevice.manufacturer} on port ${myDevice.path}`)
          addLog(`Connedted in ${myDevice.manufacturer} on port ${myDevice.path}`)
          serialPort.write('ON\n')
        }
      )

      serialPort.on('data', (data) => addLog(`data from esp32:${data}`))
      serialPort.on('close', () => {
        addLog('Device disconnected, try to connect...')
        setTimeout(ConnetToEsp32, 750)
      })
      port.current = serialPort
    } else {
      addLog('Device not found, try to connect..')
      setTimeout(ConnetToEsp32, 750)
    }
  }

  useEffect(() => {
    ConnetToEsp32()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">ESP32 Serial Monitor</h1>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
          onClick={() =>
            port.current?.write('ON\n', (err) => {
              if (err) {
                addLog(`Error: ${err.message}`)
                return
              }
              addLog('Command sent: ON')
            })
          }
        >
          ON
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
          onClick={() =>
            port.current?.write('OFF\n', (err) => {
              if (err) {
                addLog(`Error: ${err.message}`)
                return
              }
              addLog('Command sent: OFF')
            })
          }
        >
          OFF
        </button>

        <button
          className="px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-red-700"
          onClick={async () => {
            const ports = await SerialPort.list()
            ports.forEach((port) => {
              const objString = JSON.stringify(port)
              addLog(objString)
            })
          }}
        >
          log ports
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

export default App
