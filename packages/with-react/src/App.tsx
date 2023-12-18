import "./App.css";
import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";

import * as helloWorldCm from "hello-world.cm";
import { IssuedClaim, useContractClaims } from "./hooks";

interface FormState {
  keyFirstPart: number | string;
  keySecondPart: number | string;
  claimBody: string | number | any;
}

function App() {
  const [claimForm, setClaimForm] = useState<FormState>();

  const { fetchClaims, validateClaim, claim, isValid, isLoading } =
    useContractClaims();

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    if (claim) {
      setClaimForm({
        keyFirstPart: claim.content?.key?.first_part,
        keySecondPart: claim.content?.key?.second_part,
        claimBody: claim.content?.body,
      });
    }
  }, [claim]);

  const onClaimFieldChangeHandler =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setClaimForm((state) => {
        if (state) {
          return { ...state, [field]: Number(value) || value };
        }
      });
    };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim) {
      const claimClone = JSON.parse(JSON.stringify(claim)) as IssuedClaim;
      claimClone.content.key.first_part = claimForm?.keyFirstPart ?? "";
      claimClone.content.key.second_part = claimForm?.keySecondPart ?? "";
      claimClone.content.body = claimForm?.claimBody;
      validateClaim(claimClone);
    }
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>
        <a href="https://coinweb.io" target="_blank" className="coinweb">
          Coinweb
        </a>{" "}
        + React
      </h1>

      <h2>Hello World</h2>
      <p>ContractID</p>
      <p>{helloWorldCm.contractId}</p>

      <br />

      {isLoading ? (
        <div className="loader" />
      ) : (
        claimForm && (
          <div className="claim">
            <form className="claim-form" onSubmit={onSubmitHandler}>
              <input
                name="keyFirstPart"
                value={claimForm.keyFirstPart}
                onChange={onClaimFieldChangeHandler("keyFirstPart")}
              />
              <input
                name="keySecondPart"
                value={claimForm.keySecondPart}
                onChange={onClaimFieldChangeHandler("keySecondPart")}
              />
              <input
                name="claimBody"
                value={claimForm.claimBody}
                onChange={onClaimFieldChangeHandler("claimBody")}
              />
              <button type="submit">Validate claim</button>
              <span
                className={`valid-indicator ${
                  isValid !== undefined && (isValid ? "valid" : "invalid")
                }`}
              >
                {isValid ? "✅ Claim is valid" : "❌ Claim is invalid"}
              </span>
            </form>
          </div>
        )
      )}
    </>
  );
}

export default App;
