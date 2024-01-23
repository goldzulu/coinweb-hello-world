#!/bin/bash
set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT=$DIR/..

rm -rf $ROOT/{cweb_dist/{on,off}chain,dist/tmp/{step{1,2,3},final}}
mkdir -p $ROOT/{cweb_dist/{on,off}chain,dist/tmp/{step{1,2,3},final}}

(
  cd $ROOT
  cp -rf dist/offchain/ cweb_dist/offchain/

  ## Bundle and transpile `index.js` so it can be understood by the quickjs interpreter:
  echo 'import {cwebMain as f} from "../../../dist/onchain/index"; f();' \
	> dist/tmp/step1/onchain.js

  yarn esbuild \
	--bundle \
  --log-level=silent \
  --format=esm \
	dist/tmp/step1/onchain.js \
	--outfile=dist/tmp/step2/onchain.js

  yarn babel \
	dist/tmp/step2 \
  --out-dir dist/tmp/step3

  yarn replace --silent "(?<![\.a-zA-Z])Number\(" "JSBI.toNumber(" dist/tmp/step3/onchain.js

  yarn esbuild \
	--bundle \
  --log-level=silent \
	--format=esm \
	dist/tmp/step3/onchain.js \
	--outfile=dist/tmp/final/onchain.js

  echo 'import * as std from "std";' |
	cat - dist/tmp/final/onchain.js \
  > cweb_dist/onchain/index.js
)

rm -rf $ROOT/dist/{tmp,offchain,onchain}
