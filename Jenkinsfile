pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_PASSWORD = credentials('docker-password')
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checkout completed'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        echo 'Building backend Docker image...'
                        bat 'docker build -t hotel-booking-backend:${IMAGE_TAG} .'
                        echo 'Backend build completed'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Building frontend Docker image...'
                        bat 'docker build -t hotel-booking-frontend:${IMAGE_TAG} .'
                        echo 'Frontend build completed'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo 'Logging into Docker Registry...'
                    bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                    
                    echo 'Pushing backend image...'
                    bat 'docker tag hotel-booking-backend:${IMAGE_TAG} %DOCKER_REGISTRY%/hotel-booking-backend:${IMAGE_TAG}'
                    bat 'docker push %DOCKER_REGISTRY%/hotel-booking-backend:${IMAGE_TAG}'
                    
                    echo 'Pushing frontend image...'
                    bat 'docker tag hotel-booking-frontend:${IMAGE_TAG} %DOCKER_REGISTRY%/hotel-booking-frontend:${IMAGE_TAG}'
                    bat 'docker push %DOCKER_REGISTRY%/hotel-booking-frontend:${IMAGE_TAG}'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying application with Docker Compose...'
                    bat 'docker-compose -f compose.yml up -d'
                    echo 'Deployment completed'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Running health checks...'
                    sleep(time: 10, unit: 'SECONDS')
                    bat 'curl -f http://localhost:3000'
                    bat 'curl -f http://localhost:80'
                    echo 'Health checks passed'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
            cleanWs()
        }
        failure {
            echo 'Pipeline failed!'
            script {
                if (env.WORKSPACE) {
                    bat 'docker-compose -f compose.yml down'
                } else {
                    echo 'Skipping docker-compose down: no workspace context'
                }
            }
        }
        always {
            script {
                if (env.WORKSPACE) {
                    bat 'docker logout'
                } else {
                    echo 'Skipping docker logout: no workspace context'
                }
            }
        }
    }
}
