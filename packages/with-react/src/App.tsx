import reactLogo from "./assets/react.svg";
import "./App.css";

// import { fetch_claims, connect_to_node } from "@coinweb/wallet-lib";
// import { NetworkName } from "@coinweb/wallet-lib/enums.js";
// import {
//   contractId,
//   claimFilter,
//   correctClaim,
//   isClaimOk,
// } from "hello-world.cm";
// import figlet from "figlet";

// const node = connect_to_node("https://api-devnet.coinweb.io/wallet");

// async function printResult(str) {
//   return new Promise((resolve, reject) => {
//     figlet.text(
//       "OK",
//       {
//         font: "Ghost",
//       },
//       function (err, data) {
//         if (err) {
//           console.log("Something went wrong...");
//           console.dir(err);
//           return reject();
//         }
//         console.log(data);
//         return resolve(data);
//       }
//     );
//   });
// }

// // Fetch and show the "hello world" claim created by the smart contract
// async function showClaim() {
//   const claim = await fetch_claims(
//     node,
//     [claimFilter],
//     NetworkName.DEVNET_L1A,
//     true
//   );

//   const ok = isClaimOk(claim[0]);

//   if (ok) {
//     await printResult("OK");
//     console.log("Found the claim we were looking for!");
//   } else {
//     await printResult("Nooooo!");
//     console.log("Requires claim missing!");
//   }
// }

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
    </>
  );
}

export default App;
