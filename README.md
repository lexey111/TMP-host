# TMP host

## How to build

### Docker

To generate `dist` folder without installing NPM packages and adding local garbage, use these commands:

1. Build image: `docker build -f Dockerfile.prod -t host .` in the root folder (`TMP-host`).
2. Run container: `docker run --name temp host`
3. Copy `dist` folder from container: `docker cp temp:/app/dist ./dist`
4. Remove the container: `docker rm temp`
5. Remove the image: `docker image rm host`

That's it.

P.S. On Linux or Mac you can just run `docker_build.cmd` script.
P.P.S. Before run please remove `dist` folder, if any.

### Docker compose

#### Production mode

In `TMP-host` folder run `docker-compose up` to build the files. Result will be
placed into `TMP-host/dist` folder.

#### Development + watch mode
In `TMP-host` folder run `docker-compose -f docker-compose.start.yml up` to build the files. Result will be placed into `TMP-host/dist` folder and application will start watching. Webserver will be available on URL `localhost:3030`.

`node_modules` and `dist` folders will be mapped.

Use `docker-compose -f docker-compose.start-with-composer.yml up` to start devserver in composer mode.

### CLI (with local NPM install)

1. `npm i`
2. `npm run build` or `npm run build:dev`

If you need devserver (watch mode) use

2. `npm run start` and open 'localhost:3030' in a browser.
