echo "------------------------ Adding Dependency ------------------------"
echo "npm install uglify-js@3.6.9 -g"
npm install uglify-js@3.6.9 -g
echo "-------------------------------------------------------------------"

echo "------------------------ Compressing Build ------------------------"
JS_FILES=( $(find ./dist/ -name '*.js') )
echo "Found ${#JS_FILES[@]} JS files. Compressing..."

for path in ${JS_FILES[@]}
do
    echo ""
    echo "Current Size: $(du -h $path)"
    uglifyjs --compress --mangle --output $path -- $path
    echo "Compressed Size: $(du -h $path)"
done
echo "-------------------------------------------------------------------"
