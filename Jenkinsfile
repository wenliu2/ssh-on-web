pipeline {
    agent any
    environment {
        KUBETOKEN = credentials('rancher-kube-dev')
        KUBESERVER = credentials('rancher-dev-server')
    }
    stages {

    // stage('BUILD SSH-ON-WEB DOCKER IMAGE') {
    //     docker.withRegistry("", "docekrHubCredential") {

    //         def sshImage = docker.build("victor2333/ssh-on-web:1.0.${env.BUILD_ID}")

    //         sshImage.push()
    //         sshImage.push("latest")
    //     }
    // }

    // stage('BUILD SSH-ON-WEB-MONGODB DOCKER IMAGE') {
    //    docker.withRegistry("", "docekrHubCredential") {

    //         def mongodbImage = docker.build("victor2333/ssh-on-web-mongodb:1.0.${env.BUILD_ID}","./mongodb")

    //         mongodbImage.push()
    //         mongodbImage.push("latest")
    //     } 
    // }

        stage('DEPLOY') {
            steps {
                sh 'docker run --rm lachlanevenson/k8s-kubectl:latest --server=$KUBESERVER --certificate-authority=cacerts.pem --token=$KUBETOKEN version'
            }
        }
    }
}