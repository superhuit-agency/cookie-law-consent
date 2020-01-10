#!/bin/sh

#Clear previous release
rm -rf release

# Create release folder
mkdir release release/admin release/public

cp *.php release/
cp admin/*.php release/admin
cp public/*.php release/public

cp -r languages release/

mv build/*-admin* release/admin
mv build/* release/public


echo ""
echo "==========================="
echo "Hihaaaa the plugin is done 🎉"
echo "Copy/upload/or whatever the 'release' folder into your WordPress install"
echo "Pssss.... you can for sure rename it 😉"
echo ""
