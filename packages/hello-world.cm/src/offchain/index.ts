// This is the offchain part of the smart contract.
// The code here is the one that will be authenticated.
// This is the code that is also used for the front ends etc.

import { GqlClaimFilter, GqlIssuedClaim } from "@coinweb/wallet-lib";
import onchainPackage from "../../package.json";
import isDeepEqual from "./isDeepEqual";

/**
 *  The claim parts such as key parts are hardcoded for the hello-world example here
 */
const EXAMPLE_KEY_FIRST_PART = "Universal first key part";
const EXAMPLE_KEY_SECOND_PART = "More specific second key part";
const EXAMPLE_BODY = "Hello World";

/**
 * The contract id is fetched from the name of the contract module in ../out
 * The contract module's name is always `cweb_<<contract id>>` which is subtracted
 * to construct a hex version of the contract id.
 */
export const contractId = `0x${onchainPackage.name.substring(5)}`;

/**
 * The claim filter is used to fetch the claim that is been checked.
 * Issuer and the first key are used to identify the claim.
 */
export const claimFilter: GqlClaimFilter = {
  issuer: { FromSmartContract: contractId },
  keyFirstPart: EXAMPLE_KEY_FIRST_PART,
  keySecondPart: null,
  startsAtKeySecondPart: null,
  endsAtKeySecondPart: null,
};

/**
 * The expected claim. This is used within the testing to check that the claim is equal to what it has to be.
 * The correct claim is **hardcoded** for this example.
 */
export const correctClaim: GqlIssuedClaim = {
  issuer: claimFilter.issuer,
  content: {
    key: {
      first_part: EXAMPLE_KEY_FIRST_PART,
      second_part: EXAMPLE_KEY_SECOND_PART,
    },
    body: EXAMPLE_BODY,
    fees_stored:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  },
};

/**
 * In this hello world example the fetched claim is simply checkd against the correct data.
 * This function deep-equal-compares any data with the correct claim.
 *
 * @param  claim The GqlIssuedClaim to check
 * @returns true if the claim is correct, false otherwise
 */
export function isClaimOk(claim: GqlIssuedClaim) {
  return isDeepEqual(claim, correctClaim);
}
