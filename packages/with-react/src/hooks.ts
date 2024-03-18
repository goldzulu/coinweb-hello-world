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
      await Promise.all([api.getContractId(), api.getGreeting()]).then(([contractIdentity, greetingClaim]) => {
        contractId.current = contractIdentity;
        greeting.current = greetingClaim;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  const validate = async (claim: Greeting): Promise<void> => {
    const isClaimValid = await api.validateGreeting(claim);
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
