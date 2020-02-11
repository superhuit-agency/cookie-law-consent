#!/bin/sh

VERSION=$(grep version package.json | grep -o '[0-9][^"]*')
RELEASE_DIR="release/v$VERSION"

if [ -d "$RELEASE_DIR" ]; then
	echo
	read -p "The version '$VERSION' is already released. Override it? [y/N] " -n 1 -r
	echo

	if [[ ! $REPLY =~ ^[Yy]$ ]]
	then
		[[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
	fi
fi

#Clear previous release
rm -rf "$RELEASE_DIR"

# Create release folder
mkdir "$RELEASE_DIR" "$RELEASE_DIR/admin" "$RELEASE_DIR/public"

cp *.php "$RELEASE_DIR/"
cp admin/*.php "$RELEASE_DIR/admin"
cp public/*.php "$RELEASE_DIR/public"

cp -r languages "$RELEASE_DIR/"

mv build/*-admin* "$RELEASE_DIR/admin"
mv build/cookie* "$RELEASE_DIR/public"


# echo ""
# echo "==========================="
# echo "Hihaaaa the plugin is done 🎉"
# echo "Copy/upload/or whatever the 'release' folder into your WordPress install"
# echo "Pssss.... you can for sure rename it 😉"
# echo ""
