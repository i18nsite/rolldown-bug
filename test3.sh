#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

./test3.js
./fmt.sh
# diff _no_manual.js _hasmanual.js
