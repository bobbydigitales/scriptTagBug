# What this repo does
This is a repro of a bug where having too many scripts loaded from script tags in a HEAD element will cause Chromium to fail to load pages on Linux.

The project loads 2000 scritps in the HEAD element of both a main page and an embedded iframe element.

# To run it
Run a local webserver in the project root and visit index.html. There is a Go-based webserver in the project root that you can run with `go run main.go`

# How to regenerate all scripts
1. Generate script files using `deno run --allow-all generate.ts`. Change the `numScripts` constant in generate.ts and check.js to change the number of scripts generated.
Generated scripts are in here: https://github.com/controlzee/scriptTagBug/tree/main/generated_scripts

2. Copy the auto-generated code from scriptTags.js to the HEAD elemenet of index.html and index_iframe.html
