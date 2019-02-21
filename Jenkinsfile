pipeline {
  agent any

  stages {
    stage('Build docker') {
      steps {
        sh './build.docker victor2333/ssh-on-web 1.0.2'
      }
    }
  }
}

