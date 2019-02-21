pipeline {
  agent any

  stages {
    stage('Test') {
      steps {
        sh './docker.build victor2333/ssh-on-web 1.0.2'
      }
    }
}

