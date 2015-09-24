#!/bin/bash
set -e

npm install graphiql -g --prefix ./

mv ./lib/node_modules/graphiql ./graphiql
rm -rf ./etc ./lib
