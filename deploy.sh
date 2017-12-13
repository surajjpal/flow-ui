# ----------------------------
# Deployment at root of server
# ----------------------------

# Normal Build
ng build --env=prod --base-href / --deploy-url /

# AOT Compilation
#ng build --env=prod --aot --build-optimizer --base-href / --deploy-url /

rm -rf /var/www/html
mkdir /var/www/html
cp -a dist/. /var/www/html/

# ----------------------------------------------
# Deployment in flow-ui folder at root of server
# ----------------------------------------------

# Normal Build
#ng build --env=prod --base-href /flow-ui/ --deploy-url ./

# AOT Compilation
#ng build --env=prod --aot --build-optimizer --base-href /flow-ui/ --deploy-url ./

#rm -rf /var/www/html/flow-ui
#mkdir /var/www/html/flow-ui
#cp -a dist/. /var/www/html/flow-ui/
