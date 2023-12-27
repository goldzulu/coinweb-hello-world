import { GqlIssuedClaim } from "@coinweb/wallet-lib";
import { correctClaim, isClaimOk } from "..";

describe("Offchain Tests", () => {
  test("isClaimOk returns true for correct claim", () => {
    expect(isClaimOk(correctClaim)).toBe(true);
  });

  test("isClaimOk returns false for incorrect claim", () => {
    const incorrectClaim: GqlIssuedClaim = {
      issuer: {
        FromSmartContract: "0xincorrectcontractid",
      },
      content: {
        key: {
          first_part: "incorrect_first_part",
          second_part: "incorrect_second_part",
        },
        body: "incorrect_body",
        fees_stored:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
    };

    expect(isClaimOk(incorrectClaim)).toBe(false);
  });
});
