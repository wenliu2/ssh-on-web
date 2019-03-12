pipeline {
  agent any
  stages {
    stage('Docker Login') {
      steps {
        sh 'docker login -u $DOCKERCRE_USR -p $DOCKERCRE_PSW'
      }
    }
    stage('Build') {
      parallel {
        stage('Build ssh-on-web') {
          steps {
            sh './JenkinsStage/Stage-1.sh $DOCKERCRE_USR/ssh-on-web 1.0.$BUILD_ID'
          }
        }
        stage('Build MongoDB') {
          steps {
            sh './JenkinsStage/Stage-2.sh $DOCKERCRE_USR/ssh-on-web-mongodb 1.0.$BUILD_ID'
          }
        }
      }
    }
    stage('INSTALL') {
      steps {
        sh './JenkinsStage/Stage-3.sh'
      }
    }
    stage('Deploy') {
      steps {
        sh './JenkinsStage/Stage-4.sh'
      }
    }
    stage('Clean') {
      steps {
        sh 'docker image prune -af'
      }
    }
  }
  environment {
    DOCKERCRE = credentials('docekrHubCredential')
    KUBECONFIG = credentials('kubectl-config-file')
  }
}