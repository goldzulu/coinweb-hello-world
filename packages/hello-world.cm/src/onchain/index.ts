import type { NewTx, Context, ContractHandlers } from "@coinweb/contract-kit";
import {
  getContractId,
  continueTx,
  passCwebFrom,
  contractIssuer,
  store,
  genericClaim,
  claimKey,
  toHex,
  addDefaultMethodHandler,
  addMethodHandler,
  SELF_REGISTER_HANDLER_NAME,
  executeHandler,
} from "@coinweb/contract-kit";
import { selfRegisterHandler } from "@coinweb/self-register";
import { EXAMPLE_BODY, EXAMPLE_KEY_FIRST_PART, EXAMPLE_KEY_SECOND_PART } from "../offchain/constants";

function logic(context: Context): NewTx[] {
  const { tx } = context;
  const issuer = getContractId(tx);

  return [
    continueTx([
      passCwebFrom(contractIssuer(issuer), 200),
      store(
        genericClaim(
          // Key
          claimKey(EXAMPLE_KEY_FIRST_PART, EXAMPLE_KEY_SECOND_PART),
          // Value/Body
          EXAMPLE_BODY,
          // Fees stored in this claim
          toHex(0)
        )
      ),
    ]),
  ];
}

export function cwebMain() {
  const module: ContractHandlers = { handlers: {} };
  addDefaultMethodHandler(module, logic);
  addMethodHandler(module, SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
  executeHandler(module);
}
