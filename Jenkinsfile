node {
    checkout scm
    def customImage = docker.build("victor2333/ssh-on-web:1.0.2")
    customImage.push()
    customImage.push('latest')
}
