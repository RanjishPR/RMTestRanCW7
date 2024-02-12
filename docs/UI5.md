
```
npm install --global @ui5/cli
```

```
#!/bin/bash

set -e

cd "$(dirname "$0")"

rm -rf dist
mkdir dist

for APP in *; do
    if [ -f "$APP/webapp/manifest.json" ]; then
        echo "Build $APP"
        cd "$APP"
        if [ ! -f "package.json" ]; then
            npm init --yes
        fi
        if [ ! -f "ui5.yaml" ]; then
            cat >ui5.yaml <<EOF
specVersion: "2.1"
type: application
metadata:
  name: $APP
EOF
        fi
        npx -p @ui5/cli ui5 build --dest "../dist/$APP"
        #mkdir "dist/$APP"
        #cp -r "$APP/webapp/" "dist/$APP/"
        cd ..
    fi
done
```