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
                        if (isUnix()) {
                            sh 'docker build -t hotel-booking-backend:${IMAGE_TAG} .'
                        } else {
                            bat 'docker build -t hotel-booking-backend:${IMAGE_TAG} .'
                        }
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
                        if (isUnix()) {
                            sh 'docker build -t hotel-booking-frontend:${IMAGE_TAG} .'
                        } else {
                            bat 'docker build -t hotel-booking-frontend:${IMAGE_TAG} .'
                        }
                        echo 'Frontend build completed'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo 'Logging into Docker Registry...'
                    if (isUnix()) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    } else {
                        bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                    }
                    
                    echo 'Pushing backend image...'
                    if (isUnix()) {
                        sh 'docker tag hotel-booking-backend:${IMAGE_TAG} ${DOCKER_REGISTRY}/hotel-booking-backend:${IMAGE_TAG}'
                        sh 'docker push ${DOCKER_REGISTRY}/hotel-booking-backend:${IMAGE_TAG}'
                    } else {
                        bat 'docker tag hotel-booking-backend:${IMAGE_TAG} %DOCKER_REGISTRY%/hotel-booking-backend:${IMAGE_TAG}'
                        bat 'docker push %DOCKER_REGISTRY%/hotel-booking-backend:${IMAGE_TAG}'
                    }
                    
                    echo 'Pushing frontend image...'
                    if (isUnix()) {
                        sh 'docker tag hotel-booking-frontend:${IMAGE_TAG} ${DOCKER_REGISTRY}/hotel-booking-frontend:${IMAGE_TAG}'
                        sh 'docker push ${DOCKER_REGISTRY}/hotel-booking-frontend:${IMAGE_TAG}'
                    } else {
                        bat 'docker tag hotel-booking-frontend:${IMAGE_TAG} %DOCKER_REGISTRY%/hotel-booking-frontend:${IMAGE_TAG}'
                        bat 'docker push %DOCKER_REGISTRY%/hotel-booking-frontend:${IMAGE_TAG}'
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Deploying application with Docker Compose...'
                    if (isUnix()) {
                        sh 'docker-compose -f compose.yml up -d'
                    } else {
                        bat 'docker-compose -f compose.yml up -d'
                    }
                    echo 'Deployment completed'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Running health checks...'
                    sleep(time: 10, unit: 'SECONDS')
                    if (isUnix()) {
                        sh 'curl -f http://localhost:3000 || exit 1'
                        sh 'curl -f http://localhost:80 || exit 1'
                    } else {
                        bat 'curl -f http://localhost:3000'
                        bat 'curl -f http://localhost:80'
                    }
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
                if (isUnix()) {
                    sh 'docker-compose -f compose.yml down'
                } else {
                    bat 'docker-compose -f compose.yml down'
                }
            }
        }
        always {
            script {
                if (isUnix()) {
                    sh 'docker logout'
                } else {
                    bat 'docker logout'
                }
            }
        }
    }
}
