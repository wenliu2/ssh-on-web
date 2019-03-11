#!/usr/bin/env bash
./envsubst < ./k8s-deploy/mongo-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -
./envsubst < ./k8s-deploy/ssh-on-web-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -