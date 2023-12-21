import './App.css';
import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import coinwebLogo from './assets/coinweb-logo.svg';

import { IssuedClaim, useContractClaims } from './hooks';

interface FormState {
  keyFirstPart: number | string;
  keySecondPart: number | string;
  claimBody: string | number | any;
}

function App() {
  const [claimForm, setClaimForm] = useState<FormState>();

  const { fetchClaims, validateClaim, claim, contractId, isValid, isLoading } = useContractClaims();

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

  const onClaimFieldChangeHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      claimClone.content.key.first_part = claimForm?.keyFirstPart ?? '';
      claimClone.content.key.second_part = claimForm?.keySecondPart ?? '';
      claimClone.content.body = claimForm?.claimBody;
      validateClaim(claimClone);
    }
  };

  return (
    <>
      <header>
        <a href="https://coinweb.io" target="_blank">
          <img src={coinwebLogo} className="logo coinweb" alt="Coinweb logo" />
        </a>
        <span>{' x '}</span>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </header>
      <main>
        <h1>Hello World</h1>
        <h2>Contract ID</h2>
        <p>{contractId}</p>

        <br />

        {isLoading ? (
          <div className="loader" />
        ) : (
          claimForm && (
            <div className="claim">
              <form className="claim-form" onSubmit={onSubmitHandler}>
                <div className="input-wrapper">
                  <input value={claimForm.keyFirstPart} onChange={onClaimFieldChangeHandler('keyFirstPart')} />
                  <span className="input-label">First key</span>
                </div>
                <div className="input-wrapper">
                  <input value={claimForm.keySecondPart} onChange={onClaimFieldChangeHandler('keySecondPart')} />
                  <span className="input-label">Second key</span>
                </div>
                <div className="input-wrapper">
                  <input value={claimForm.claimBody} onChange={onClaimFieldChangeHandler('claimBody')} />
                  <span className="input-label">Claim body</span>
                </div>

                <button type="submit">Validate claim</button>
                <span className={`valid-indicator ${isValid !== undefined && (isValid ? 'valid' : 'invalid')}`}>
                  {isValid ? '✅ Claim is valid' : '❌ Claim is invalid'}
                </span>
              </form>
            </div>
          )
        )}
      </main>
      <footer>© {new Date().getFullYear()} Coinweb — True Interoperability. Real world usage.</footer>
    </>
  );
}

export default App;
