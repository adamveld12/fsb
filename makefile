.PHONY: dev smoke client/clean client/deploy server/clean server/deploy server/build deploy

dev: server/clean server/api-server
	docker-compose -f ./dc_local.yml -p fbs up -t 3 --remove-orphans

build: client/build server/build
deploy: client/deploy server/deploy
clean: server/clean client/clean

server/clean:
	rm -rf ./server/api-server

client/clean:
	rm -rf ./client/build

client/clobber: client/clean
	rm -rf ./client/node_modules

server/setup:
	cd server && go get -u .

server/api-server:
	CGO_ENABLED=0 GOOS=linux go build -o ./server/api-server ./server
server/build: server/api-server
	cd ./server && docker build -t adamveld12/fsb-api .

server/deploy: server/clean ./server/api-server ./server/build
	hyper pull adamveld12/fsb-api:latest
	hyper compose up -f ./hyper.prod.yml --force-recreate -d


client/setup:
	cd client && yarn install && yarn add netlify -g

client/build:
	cd ./client && yarn run build

client/deploy:  client/clean client/build
	netlify deploy
