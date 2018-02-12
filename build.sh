#!/bin/bash
_tag=$1

#if [ -z "${_tag}" ]; then
#    source _VERSION   
#    _tag=${_VERSION}
#fi

#docker build --tag "api-flow:${_tag}"  --no-cache=true .


# AOT Compilation
ng build --env=prod --aot --build-optimizer --base-href / --deploy-url /

rm -rf target
mkdir target
zip -r target/flow-ui.zip dist/*

