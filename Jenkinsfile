pipeline {
    agent any
    environment {
        KUBETOKEN = credentials('rancher-kube-dev')
        KUBECONFIG = credentials('kubectl-config-file')
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
                sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl'
                sh 'chmod +x kubectl'
                sh 'echo $KUBECONFIG'
                sh 'echo $KUBECONFIG > kubeconfig.cnf'
            }
        }
    }
}