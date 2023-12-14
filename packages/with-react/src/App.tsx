import reactLogo from "./assets/react.svg";
import * as helloWorldCm from "hello-world.cm";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Coinweb + React</h1>
      <h2>Hello World</h2>
      <h2>{helloWorldCm.contractId}</h2>
    </>
  );
}

export default App;
