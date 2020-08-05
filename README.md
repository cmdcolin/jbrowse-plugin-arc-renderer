# Arc renderer example

This is a demonstration of JBrowse 2 plugin

## Install

    yarn

## Usage

    yarn develop

## Screenshot

![](img/1.png)



## Demo

While `yarn develop --port 9001` is running, open jbrowse-components dev server
in another tab e.g. cd packages/jbrowse-web, yarn start, and then visit

http://localhost:3000/?config=http://localhost:9000/config_arc_renderer.json

This will point jbrowse 2 at the config hosted by this repository in the
assets/config_ucsc_api.json file of this repo. Note that port 9001 is hardcoded
in there.

## Use in production

Run `yarn build`, and then add the resulting plugin.js to the runtime plugins
section of the config. This is the same plugin.js type reference in the
assets/config_arc_renderer.json folder
