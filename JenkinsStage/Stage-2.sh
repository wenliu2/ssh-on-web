#!/usr/bin/env bash

if [ $# -ne 2 ]; then
  echo "Usage: $0 image tag[ecr.vip.ebayc3.com/wenliu2/ssh-on-web 1.0.x]"
  exit -1
fi
PWD=`cd $(dirname $0);pwd`
cd $PWD

IT=$1
version=$2

docker build -t ${IT}:${version} ../mongodb/
docker tag ${IT}:${version} ${IT}:latest
docker push ${IT}
