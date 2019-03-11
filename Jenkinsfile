node {
    checkout scm

    docker.withRegistry('https://docker.io', 'docekrHubCredential') {

        def mongodbImage = docker.build("victor2333/ssh-on-web-mongodb:1.0.${env.BUILD_ID}","./mongodb")
        def sshImage = docker.build("victor2333/ssh-on-web:1.0.${env.BUILD_ID}")

        mongodbImage.push()
        sshImage.push()
    }
}