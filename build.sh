#!/bin/bash
_tag=$1

#if [ -z "${_tag}" ]; then
#    source _VERSION   
#    _tag=${_VERSION}
#fi

#docker build --tag "api-flow:${_tag}"  --no-cache=true .

echo "---------------------------------------------------------------"
echo "--------- Trigering Build -------------------------------------"
# AOT Compilation
ng build --env=prod --aot --build-optimizer --base-href / --deploy-url /

echo "---------------------------------------------------------------"
echo "--------- Creating zip ----------------------------------------"


rm -rf target
mkdir target
zip -r target/flow-ui.zip dist/*

