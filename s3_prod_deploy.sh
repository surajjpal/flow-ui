echo "------------------ Building angular application -------------------"
ng build --env=prod --aot --build-optimizer --no-sourcemap --base-href / --deploy-url /
echo "-------------------------------------------------------------------"

echo ""
./compress.sh
echo ""

echo "------------------------- Deleting old build from s3 -------------------------"
aws s3 rm s3://console-ui-prod --recursive
echo "------------------------------------------------------------------------------"
echo "------------------------- Uploading new build on s3 -------------------------"
aws s3 cp ./dist/ s3://console-ui-prod/ --recursive
echo "-----------------------------------------------------------------------------"
