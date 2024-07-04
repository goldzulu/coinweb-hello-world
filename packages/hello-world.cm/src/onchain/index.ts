import type { NewTx, Context, ContractHandlers } from "@coinweb/contract-kit";
import {
  SELF_REGISTER_HANDLER_NAME,
  toHex,
  addDefaultMethodHandler,
  addMethodHandler,
  executeHandler,
  constructContinueTx,
  constructClaimKey,
  constructStore,
  constructClaim,
} from "@coinweb/contract-kit";
import { selfRegisterHandler } from "@coinweb/self-register";
import { EXAMPLE_BODY, EXAMPLE_KEY_FIRST_PART, EXAMPLE_KEY_SECOND_PART } from "../offchain/constants";

function logicHandler(context: Context): NewTx[] {
  return [
    constructContinueTx(context, [
      constructStore(
        constructClaim(
          constructClaimKey(EXAMPLE_KEY_FIRST_PART, EXAMPLE_KEY_SECOND_PART), // Key
          EXAMPLE_BODY, // Value/Body
          toHex(0n) // Fees stored in this claim
        )
      ),
    ]),
  ];
}

export function cwebMain() {
  const module: ContractHandlers = { handlers: {} };
  addDefaultMethodHandler(module, logicHandler); // same as addMethodHandler(module, DEFAULT_HANDLER_NAME...
  addMethodHandler(module, SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
  executeHandler(module);
}
