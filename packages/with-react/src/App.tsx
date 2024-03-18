import './App.css';
import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import coinwebLogo from './assets/coinweb-logo.svg';

import { useGreeting } from './hooks';
import type { Greeting } from 'hello-world.cm';

interface FormState {
  firstKey: number | string;
  secondKey: number | string;
  body: string;
}

function App() {
  const [form, setForm] = useState<FormState>();

  const { fetch, validate, greeting, contractId, isValid, isLoading } = useGreeting();

  console.log('greeting', greeting, contractId);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (greeting) {
      setForm({
        firstKey: greeting?.firstKey,
        secondKey: greeting?.secondKey,
        body: greeting?.body,
      });
    }
  }, [greeting]);

  const onClaimFieldChangeHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((state) => {
      if (state) {
        return { ...state, [field]: Number(value) || value };
      }
    });
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (greeting) {
      const claimClone = JSON.parse(JSON.stringify(greeting)) as Greeting;
      claimClone.firstKey = form?.firstKey ?? '';
      claimClone.secondKey = form?.secondKey ?? '';
      claimClone.body = form?.body ?? '';
      validate(claimClone);
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
          form && (
            <div className="claim">
              <form className="claim-form" onSubmit={onSubmitHandler}>
                <div className="input-wrapper">
                  <input value={form.firstKey} onChange={onClaimFieldChangeHandler('keyFirstPart')} />
                  <span className="input-label">First key</span>
                </div>
                <div className="input-wrapper">
                  <input value={form.secondKey} onChange={onClaimFieldChangeHandler('keySecondPart')} />
                  <span className="input-label">Second key</span>
                </div>
                <div className="input-wrapper">
                  <input value={form.body} onChange={onClaimFieldChangeHandler('claimBody')} />
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
