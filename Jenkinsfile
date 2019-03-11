pipeline {
    agent any
    environment {
        KUBETOKEN = credentials('rancher-kube-dev')
        KUBECA = credentials('rancher-dev-ca')
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
                sh 'echo $KUBECA > cert'
                sh 'docker run --rm lachlanevenson/k8s-kubectl:latest --server=$KUBESERVER --certificate-authority=cert --token=$KUBETOKEN version'
            }
        }
    }
}