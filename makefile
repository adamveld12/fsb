.PHONY: dev smoke client/clean client/deploy server/clean server/deploy ./server/build deploy

dev: server/clean ./server/api-server
	docker-compose -f ./dc_local.yml -p fbs up -t 3 --remove-orphans

./server/build: ./server/api-server
	cd ./server && docker build -t adamveld12/fsb-api:latest .
	docker push adamveld12/fsb-api:latest
	hyper pull adamveld12/fsb-api:latest

server/deploy: server/clean ./server/api-server ./server/build
	hyper compose up -f ./hyper.prod.yml --force-recreate -d

client/deploy:  client/clean ./client/build
	netlify deploy

server/clean:
	rm -rf ./server/api-server

client/clean:
	rm -rf ./client/build

client/clobber: client/clean
	rm -rf ./client/node_modules

./client/node_modules:
	cd ./client && yarn install

./client/build:
	cd ./client && yarn run build

./server/api-server:
	CGO_ENABLED=0 GOOS=linux go build -o ./server/api-server ./server

		
