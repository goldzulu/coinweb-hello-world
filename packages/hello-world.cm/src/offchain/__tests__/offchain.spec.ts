import { Greeting, validateGreeting } from "..";
import { correctClaim } from "../constants";

describe("Offchain Tests", () => {
  test("isClaimOk returns true for correct claim", async () => {
    expect(
      await validateGreeting({
        body: correctClaim?.content?.body,
        // @ts-expect-error
        firstKey: correctClaim?.content?.key?.first_part as string,
        // @ts-expect-error
        secondKey: correctClaim?.content?.key?.second_part as string,
      } as Greeting)
    ).toBe(true);
  });

  test("isClaimOk returns false for incorrect claim", async () => {
    const incorrectClaim: Greeting = {
      firstKey: "incorrect_first_part",
      secondKey: "incorrect_second_part",
      body: "incorrect_body",
    };

    expect(await validateGreeting(incorrectClaim)).toBe(false);
  });
});
