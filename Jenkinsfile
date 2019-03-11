pipeline {
    agent any
    environment {
        KUBECONFIG = credentials('kubectl-config-file')
    }
    stages {

        stage('BUILD SSH-ON-WEB DOCKER IMAGE') {
            docker.withRegistry("", "docekrHubCredential") {

                def sshImage = docker.build("victor2333/ssh-on-web:1.0.${env.BUILD_ID}")

                sshImage.push()
                sshImage.push("latest")
            }
        }

        stage('BUILD SSH-ON-WEB-MONGODB DOCKER IMAGE') {
            docker.withRegistry("", "docekrHubCredential") {

                def mongodbImage = docker.build("victor2333/ssh-on-web-mongodb:1.0.${env.BUILD_ID}","./mongodb")

                mongodbImage.push()
                mongodbImage.push("latest")
            } 
        }

        stage('INSTALL KUBECTL') {
            steps {
                sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl'
                sh 'chmod +x kubectl'
                sh './kubectl --kubeconfig $KUBECONFIG version'
                sh 'curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst'
                sh 'chmod +x envsubst'
            }
        }
        stage('Deploy') {
            steps {
                sh './envsubst < ./k8s-deploy/mongo-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -'
                sh './envsubst < ./k8s-deploy/ssh-on-web-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -'
            }
        }
    }
}