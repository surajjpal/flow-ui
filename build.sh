#!/bin/bash
check_error() {
  e=$?
  if [ $e != 0 ]
  then
    echo "Error $1"
    exit $e
  fi
}

echo "---------------------------------------------------------------"
echo "--------- Installing dependencies -----------------------------"

npm install
check_error "npm install"
echo "---------------------------------------------------------------"
echo "--------- Trigering Build -------------------------------------"
# AOT Compilation
ng build --env=demo --aot --build-optimizer --base-href / --deploy-url /
check_error "ng build"

echo "-------Compressing ---------"
./compress.sh
check_error "compress"
echo "---------------------------------------------------------------"
echo ""


echo "---------------------------------------------------------------"
echo "--------- Creating zip ----------------------------------------"

if [ -d target ]
then
  rm -rf target
fi
mkdir target
zip -r target/flow-ui.zip dist/*
check_error "create zip"

