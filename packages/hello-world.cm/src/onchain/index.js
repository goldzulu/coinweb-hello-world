import * as kit from "@coinweb/contract-kit";
import { selfRegisterHandler } from "@coinweb/self-register";

function logic(contextTx) {
    const issuer = kit.getContractId(contextTx);
    const content = [
        kit.newTxContinue([
            kit.passCwebFrom(kit.contractIssuer(issuer), 200),
            kit.storeOp(
                kit.genericClaim(
                    // Key
                    kit.createKey(1, 4),
                    // Value
                    "hello world",
                    // Fees stored in this claim
                    kit.toHex(0),
                ),
            )
        ]),
    ];
    console.log("Congrats with new hello world!");
    kit.writeToResultFile(content);
}

export function cwebMain() {
    kit.addDefaultMethodHandler(logic);
    kit.addMethodHandler(kit.SELF_REGISTER_HANDLER_NAME, selfRegisterHandler);
    const contextTx = kit.getContextTx();
    kit.getMethodHandler(kit.getMethodName(contextTx))(contextTx);
}
