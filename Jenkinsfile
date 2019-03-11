pipeline {
    agent none
    environment {
        DOCKERCRE = credentials('docekrHubCredential')
        KUBECONFIG = credentials('kubectl-config-file')
    }
    stages {
        stage('Docker Login') {
            steps {
                sh 'docker login -u DOCKERCRE_USR -p DOCKERCRE_PSW'
            }
        }

        stage('Build ssh-on-web') {
            steps {
                sh './JenkinsStage/Stage-1.sh victor2333/ssh-on-web 1.0.${BUILD_ID}'
            }
        }

        stage('Build mongodb') {
            steps {
                sh './JenkinsStage/Stage-2.sh victor2333/ssh-on-web-mongodb 1.0.${BUILD_ID}'
            }
        }

        // stage('INSTALL') {
        //     steps {
        //         sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl'
        //         sh 'chmod +x kubectl'
        //         sh './kubectl --kubeconfig $KUBECONFIG version'
        //         sh 'curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst'
        //         sh 'chmod +x envsubst'
        //     }
        // }

        // stage('Deploy') {
        //     steps {
        //         sh './envsubst < ./k8s-deploy/mongo-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -'
        //         sh './envsubst < ./k8s-deploy/ssh-on-web-deploy.yaml | ./kubectl --kubeconfig $KUBECONFIG apply -f -'
        //     }
        // }
    }
}