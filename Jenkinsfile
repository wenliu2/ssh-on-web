pipeline {
    agent {
        label 'custom-docker'
    }
    stages {
        stage('Build') {
            steps {
                sh './build.docker victor2333/ssh-on-web 1.0.2'
            }
        }
    }
}
