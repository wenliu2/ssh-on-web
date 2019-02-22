pipeline {
    agent { dockerfile true }
    stages {
        stage('Check Out') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker') {
            def customImage = docker.build("victor2333/ssh-on-web:1.0.2")
        }
        stage('Push Docker Image') {
            customImage.push()
            customImage.push('latest')
        }
    }
}
