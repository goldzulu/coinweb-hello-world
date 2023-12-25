import {
  TxContext,
  NewTx,
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
  getContextTx,
  executeHandler,
} from "@coinweb/contract-kit";
import { selfRegisterHandler } from "@coinweb/self-register";
import {
  EXAMPLE_BODY,
  EXAMPLE_KEY_FIRST_PART,
  EXAMPLE_KEY_SECOND_PART,
} from "../offchain/constants";

function logic(contextTx: TxContext): NewTx[] {
  const issuer = getContractId(contextTx);

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
  addDefaultMethodHandler(logic);
  addMethodHandler(SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
  const contextTx = getContextTx();
  executeHandler(contextTx);
}
