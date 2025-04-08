#!/bin/bash
npm run build:prod
VERSION=$1
docker build -t crpi-ocpewd70nkzhwb5u.cn-hangzhou.personal.cr.aliyuncs.com/yaoask/yaoask-portal:$VERSION .
docker push crpi-ocpewd70nkzhwb5u.cn-hangzhou.personal.cr.aliyuncs.com/yaoask/yaoask-portal:$VERSION
