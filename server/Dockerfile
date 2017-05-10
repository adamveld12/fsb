FROM debian:jessie-slim

ENV FSB_DEBUG=false
ENV FSB_PORT=80
ENV FSB_ORIGIN=*
ENV FSB_REDIS=redis:6379
ENV FSB_FACTORIO_USERNAME=
ENV FSB_FACTORIO_TOKEN=

WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install -y ca-certificates && apt-get clean

EXPOSE 80 443
CMD ./api-server
