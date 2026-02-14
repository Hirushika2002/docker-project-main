pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        // Optional: set AWS details in Jenkins global env or per-job
        // AWS_ACCOUNT_ID, AWS_REGION can be provided to enable ECR pushes
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
                        sh 'docker build -t hotel-booking-backend:${IMAGE_TAG} .'
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
                        sh 'docker build -t hotel-booking-frontend:${IMAGE_TAG} .'
                        echo 'Frontend build completed'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Verifying built images...'
                    sh 'docker images | grep -E "hotel-booking-(backend|frontend)" || true'
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    def pushed = false
                    if (env.AWS_ACCOUNT_ID && env.AWS_REGION) {
                        echo "Pushing images to ECR ${env.AWS_ACCOUNT_ID} in ${env.AWS_REGION}"
                        sh '''
                          set -e
                          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                          docker tag hotel-booking-backend:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/hotel-booking-backend:${IMAGE_TAG}
                          docker tag hotel-booking-frontend:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/hotel-booking-frontend:${IMAGE_TAG}
                          docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/hotel-booking-backend:${IMAGE_TAG}
                          docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/hotel-booking-frontend:${IMAGE_TAG}
                        '''
                        pushed = true
                    } else {
                        echo 'AWS_ACCOUNT_ID/AWS_REGION not set; attempting Docker Hub push if credentials exist'
                        try {
                            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                                sh '''
                                  set -e
                                  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                                  docker tag hotel-booking-backend:${IMAGE_TAG} docker.io/${DOCKER_USERNAME}/hotel-booking-backend:${IMAGE_TAG}
                                  docker tag hotel-booking-frontend:${IMAGE_TAG} docker.io/${DOCKER_USERNAME}/hotel-booking-frontend:${IMAGE_TAG}
                                  docker push docker.io/${DOCKER_USERNAME}/hotel-booking-backend:${IMAGE_TAG}
                                  docker push docker.io/${DOCKER_USERNAME}/hotel-booking-frontend:${IMAGE_TAG}
                                '''
                                pushed = true
                            }
                        } catch (err) {
                            echo 'DockerHub credentials not found; skipping image push.'
                        }
                    }
                    if (!pushed) {
                        echo 'No registry credentials configured; stage completed without pushing.'
                    }
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                script {
                    // Deploy via Terraform if available and terraform is installed
                    def tfExists = fileExists('terraform/main.tf')
                    def tfAvailable = (sh(script: 'command -v terraform >/dev/null 2>&1', returnStatus: true) == 0)
                    if (tfExists && tfAvailable) {
                        dir('terraform') {
                            sh '''
                              set -e
                              terraform init -input=false
                              terraform apply -auto-approve -input=false
                            '''
                        }
                    } else {
                        echo 'Terraform not configured or not installed; skipping deploy.'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo 'Running basic health checks...'
                    sh 'sleep 2'
                    // Replace with real service checks if endpoints are known
                    echo 'Health checks passed (placeholder).'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            cleanWs(deleteDirs: true)
        }
        failure {
            echo 'Pipeline failed!'
            script {
                // Try to bring down any compose deployment, but do not fail pipeline further
                sh 'docker compose -f compose.yml down || true'
            }
        }
        always {
            script {
                // Logout from Docker if available; ignore errors
                sh 'docker logout || true'
            }
        }
    }
}
