pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Assurez-vous que ce nom correspond à la configuration de Node.js dans Jenkins
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Commandes pour construire votre projet Angular
                    sh 'npm install'
                    sh 'npm run build --prod'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Commandes pour exécuter les tests
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Commandes pour déployer votre application
                    sh 'npm run deploy'
                }
            }
        }
    }
}
