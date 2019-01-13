#!/bin/bash
check_error() {
  e=$?
  if [ $e != 0 ]
  then
    echo "Error $1"
    exit $e
  fi
}

npm install
check_error "npm install"

echo "------------------ Building angular application -------------------"
ng build --env=demo --aot --build-optimizer --base-href / --deploy-url /
check_error "ng build"
echo "-------------------------------------------------------------------"

echo ""
./compress.sh
check_error "compress"
echo ""

echo "------------------------- Deleting old build from s3 -------------------------"

aws s3 rm s3://console-ui-compusoft --recursive
check_error "delete files"
echo "------------------------------------------------------------------------------"
echo "------------------------- Uploading new build on s3 -------------------------"
aws s3 cp ./dist/ s3://console-ui-compusoft/ --recursive
check_error "copy files"

echo "-----------------------------------------------------------------------------"
