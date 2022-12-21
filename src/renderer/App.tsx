import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';

const Hello = () => {
  const [leftBattery, setLeftBattery] = useState(0);
  const [rightBattery, setRightBattery] = useState(0);

  const [counter, setCounter] = useState(0);

  setInterval(
    () =>
      window.electron.ipcRenderer.sendMessage(
        'GetControllerBatteryStatuses',
        []
      ),
    1000
  );

  window.electron.ipcRenderer.on(
    'GetControllerBatteryStatusesResult',
    (arg) => {
      setLeftBattery(arg.left.battery);
      setRightBattery(arg.right.battery);
    }
  );

  return (
    <>
      <p>Hello world!</p>
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
        type="button"
      >
        Click me!
      </button>
      <p>Click Counter: {counter}</p>

      <p>Battery:</p>
      <div className="Battery">
        <p>Left:</p>
        <progress value={leftBattery} max="100" className="Progress" />
        <p>{leftBattery}%</p>
      </div>

      <div className="Battery">
        <p>Right:</p>
        <progress value={rightBattery} max="100" className="Progress" />
        <p>{rightBattery}%</p>
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
