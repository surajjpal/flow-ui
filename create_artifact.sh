#!/bin/bash

ZIP_PRESENT=`which zip`

if [ -z "$ZIP_PRESENT" ]
then
  echo "Installation to zip"
  apt-get install zip
else
  echo "Proceeding to zip"
fi

zip -r flow-ui.zip dist/*
