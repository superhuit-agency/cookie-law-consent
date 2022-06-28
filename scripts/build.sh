#!/bin/sh

PACKAGE_NAME=$(jq -r .name package.json)
VERSION_NUM=$(jq -r .version package.json)

# Build assets
yarn build:production

# Clear previous release if any
rm -rf "./$PACKAGE_NAME"
rm -rf "./$PACKAGE_NAME.zip"

# Create temp folders
mkdir -p "$PACKAGE_NAME/admin" "$PACKAGE_NAME/public"

# Copy/move files to folder
cp *.php "$PACKAGE_NAME/"
# cp composer.* "$PACKAGE_NAME/" // TODO: maybe require & copy vendor
cp admin/*.php "$PACKAGE_NAME/admin"
cp public/*.php "$PACKAGE_NAME/public"
cp -r languages "$PACKAGE_NAME/"
mv build/*-admin* "$PACKAGE_NAME/admin"
mv build/cookie* "$PACKAGE_NAME/public"
mv build/manifest.json "$PACKAGE_NAME"

# Generate changelog
for file in $(ls changelog | sort -r)
do
	cat "./changelog/$file" >> "$PACKAGE_NAME/CHANGELOG.md"
	echo "" >> "$PACKAGE_NAME/CHANGELOG.md"
done

# Generate zip
zip -rqq "$PACKAGE_NAME" "./$PACKAGE_NAME"

# remove temp folder
# rm -rf "./$PACKAGE_NAME"

stat "./$PACKAGE_NAME.zip"
