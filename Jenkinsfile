pipeline {
    agent any
    stages {
        stage('Check Out') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker And Push') {
            steps {
                script {
                    def customImage = docker.build("victor2333/ssh-on-web:1.0.2")
                    customImage.push()
                    customImage.push("latest")
                }
            }
        }
    }
}
