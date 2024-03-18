import { useRef, useState } from 'react';
import { exampleApi } from 'hello-world.cm';

export const useContractClaims = () => {
  const claims = useRef<exampleApi.IssuedClaim[]>();
  const [isValid, setIsValid] = useState<boolean>();
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);

  const fetchClaims = async () => {
    try {
      setIsLoadingClaims(true);

      const fetchedClaims = await exampleApi.fetchClaims();

      if (fetchedClaims.status === 'success') {
        claims.current = fetchedClaims.result as exampleApi.IssuedClaim[];
      }

      if (fetchedClaims.status === 'error') {
        const { result: error } = fetchedClaims;
        throw error as Error;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const validateClaim = (claim: exampleApi.IssuedClaim): void => {
    const isClaimValid = exampleApi.validateClaim(claim);
    setIsValid(isClaimValid);
  };

  return {
    fetchClaims,
    validateClaim,
    claim: claims.current?.[0],
    isValid,
    isLoading: isLoadingClaims,
  };
};
