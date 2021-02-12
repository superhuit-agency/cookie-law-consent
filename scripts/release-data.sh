#!/bin/sh

PACKAGE_NAME=$(jq -r .name package.json)
VERSION_NUM=$(jq -r .version package.json)
VERSION_TAG="v$VERSION_NUM"

jq -nc \
	--arg name "$VERSION_TAG ✨" \
	--arg tag "$VERSION_TAG" \
	--arg desc "$(cat changelog/$VERSION_NUM.md)" \
	--arg asset_name "$PACKAGE_NAME" \
	--arg asset_url "https://gitlab.com/${CI_PROJECT_PATH}/-/jobs/${CI_JOB_ID}/artifacts/raw/$PACKAGE_NAME.zip" \
	'{name: $name, tag_name: $tag, description: $desc, assets: {links: [{name:$asset_name,url:$asset_url,link_type:"package"}]}}' \
> data.json
