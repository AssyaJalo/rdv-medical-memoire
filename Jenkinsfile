pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Assurez-vous que ce nom correspond à la configuration de Node.js dans Jenkins
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Construire votre projet Angular dans le conteneur Docker
                    sh 'npm install'
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Exécuter les tests avec Karma dans Docker
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Déployer l'application
                    sh 'npm run deploy'
                }
            }
        }
    }
}
