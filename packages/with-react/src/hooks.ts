import { useRef, useState } from 'react';
import * as CwebWallet from '@coinweb/wallet-lib';
import { NetworkName } from '@coinweb/wallet-lib/enums';
import * as helloWorldCm from 'hello-world.cm';

const DEV_COINWEB_ENDPOINT = 'https://api-devnet.coinweb.io/wallet';

const cwebWalletNode = CwebWallet.connect_to_node(DEV_COINWEB_ENDPOINT);

export type IssuedClaim = CwebWallet.GqlIssuedClaim & {
  content: {
    key: {
      first_part: number | string;
      second_part: number | string;
    };
  };
};

export const useContractClaims = () => {
  const claims = useRef<IssuedClaim[]>();
  const [isValid, setIsValid] = useState<boolean>();
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);

  const fetchClaims = async () => {
    const { claimFilter: helloWorldClaimFilter } = helloWorldCm;

    const claimFilters = [helloWorldClaimFilter];
    const networkToClaimFrom = NetworkName.DEVNET_L1A;
    const loadAllPages = true;

    try {
      setIsLoadingClaims(true);

      claims.current = (await CwebWallet.fetch_claims(
        cwebWalletNode,
        claimFilters,
        networkToClaimFrom,
        loadAllPages
      )) as IssuedClaim[];
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const validateClaim = (claim: CwebWallet.GqlIssuedClaim): void => {
    const isClaimValid = helloWorldCm.isClaimOk(claim);
    setIsValid(isClaimValid);
  };

  return {
    fetchClaims,
    validateClaim,
    claim: claims.current?.[0],
    contractId: helloWorldCm.contractId,
    isValid,
    isLoading: isLoadingClaims,
  };
};
