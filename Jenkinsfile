node {
    checkout scm

    stage('BUILD SSH-ON-WEB DOCKER IMAGE') {
        docker.withRegistry("", "docekrHubCredential") {

            def sshImage = docker.build("victor2333/ssh-on-web:1.0.${env.BUILD_ID}")

            sshImage.push()
            sshImage.push("latest")
        }
    }

    stage('BUILD SSH-ON-WEB-MONGODB DOCKER IMAGE') {
       docker.withRegistry("", "docekrHubCredential") {

            def mongodbImage = docker.build("victor2333/ssh-on-web-mongodb:1.0.${env.BUILD_ID}","./mongodb")

            mongodbImage.push()
            mongodbImage.push("latest")
        } 
    }

    stage('DEPLOY SSH-ON-WEB-MONGODB') {
        kubernetesDeploy(kubeconfigId: 'rancher-dev-kube-config',               // REQUIRED
            configs: 'k8s-deploy/mongo-deploy.yaml', // REQUIRED
            enableConfigSubstitution: false,
        )
    }

    stage('DEPLOY SSH-ON-WEB') {
        kubernetesDeploy(kubeconfigId: 'rancher-dev-kube-config',               // REQUIRED
            configs: 'k8s-deploy/ssh-on-web-deploy.yaml', // REQUIRED
            enableConfigSubstitution: false,
        )
    }
}