import { useRef, useState } from 'react';
import * as api from 'hello-world.cm';
import type { Greeting } from 'hello-world.cm';

export const useGreeting = () => {
  const greeting = useRef<Greeting>();
  const contractId = useRef<string>('');
  const [isValid, setIsValid] = useState<boolean>();
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);

  const fetch = async () => {
    try {
      setIsLoadingGreeting(true);
      await Promise.resolve(api.getGreeting()).then((greetingClaim) => {
        contractId.current = api.getContractId();
        greeting.current = greetingClaim;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  const validate = (claim: Greeting): void => {
    const isClaimValid = api.validateGreeting(claim);
    setIsValid(isClaimValid);
  };

  return {
    fetch,
    validate,
    greeting: greeting.current,
    contractId: contractId.current,
    isValid,
    isLoading: isLoadingGreeting,
  };
};
