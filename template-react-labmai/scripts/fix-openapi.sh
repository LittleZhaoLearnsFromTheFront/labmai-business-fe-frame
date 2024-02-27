#!/usr/bin/env sh
. scripts/common.sh
has gsed && alias sed=gsed
sed -i '1i\// @ts-nocheck' src/services/**/*.ts
