#!/bin/bash
echo "---------------------------------------------------------------"
echo "--------- Installing dependencies -----------------------------"

npm install
echo "---------------------------------------------------------------"
echo "--------- Trigering Build -------------------------------------"
# AOT Compilation
ng build --env=demo --aot --build-optimizer --base-href / --deploy-url /

echo "---------------------------------------------------------------"
echo "--------- Creating zip ----------------------------------------"

if [ -d target ]
then
  rm -rf target
fi
mkdir target
zip -r target/flow-ui-onprem.zip dist/*

