import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { SerialPort } from 'serialport'
import { useEffect, useRef } from 'react'

function App(): JSX.Element {
  const port = useRef<SerialPort>(null)

  const ConnetToEsp32 = async (): Promise<void> => {
    const ports = await SerialPort.list()

    const myDevice = ports.find((port) => port.vendorId === '10c4' && port.productId === 'ea60')

    if (myDevice) {
      const serialPort = new SerialPort(
        { path: myDevice.path, baudRate: 115200, lock: false },
        (err) => {
          if (err) {
            console.log(err)

            return
          }
          console.log(`Connedted in ${myDevice.manufacturer} on port ${myDevice.path}`)
        }
      )

      serialPort.on('data', (data) => console.log(`data from esp32:${data}`))
      serialPort.on('close', () => {
        console.log('Device disconnected, try to connect...')
        setTimeout(ConnetToEsp32, 750)
      })
      port.current = serialPort
    } else {
      console.log('Device not found, try to connect..')
      setTimeout(ConnetToEsp32, 750)
    }
  }

  useEffect(() => {
    ConnetToEsp32()
  }, [])

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <button
          className="action"
          onClick={() =>
            port.current.write('ON\n', (err) => {
              if (err) {
                console.log(err)
                return
              }
              console.log('ok')
            })
          }
        >
          ON
        </button>
        <button
          className="action"
          onClick={() =>
            port.current.write('OFF\n', (err) => {
              if (err) {
                console.log(err)
                return
              }
              console.log('ok')
            })
          }
        >
          OFF
        </button>
      </div>

      <Versions></Versions>
    </>
  )
}

export default App
