# DevOps Assignment: Hotel Booking Application

## Part 1: CI/CD Design Diagram

### Component Connectivity Diagram

```
Developer Push Code
        │
        ▼
┌─────────────────────────┐
│   Git Repository        │───Webhook Trigger───┐
│  (GitHub/GitLab)        │                      │
└─────────────────────────┘                      ▼
                               ┌──────────────────────────────┐
                               │     JENKINS CI/CD SERVER     │
                               │  ┌────────────────────────┐  │
                               │  │ 1. Code Checkout       │  │
                               │  │ 2. Build & Test        │  │
                               │  │ 3. Docker Build        │  │
                               │  │ 4. Push to Registry    │  │
                               │  │ 5. Infrastructure IaC  │  │
                               │  │ 6. Deploy Containers   │  │
                               │  │ 7. Smoke Tests         │  │
                               │  └────────────────────────┘  │
                               └──────────┬───────────────────┘
                                          │
                ┌─────────────────────────┼─────────────────────────┐
                │                         │                         │
                ▼                         ▼                         ▼
    ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
    │  Configuration Mgmt  │  │   Docker Registry    │  │  Deployment Server   │
    │  (Terraform/Ansible) │  │   (Docker Hub/ECR)   │  │  (VM/Cloud Instance) │
    └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
               │                        │                         │
               │ Provisions             │ Stores                  │
               │ Infrastructure         │ Images                  │
               │                        │                         │
               └────────────────────────┴─────────────────────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────────────┐
                    │   Docker Compose Orchestration       │
                    │   ┌──────────────────────────────┐   │
                    │   │ Frontend (nginx:80→4000)     │   │
                    │   │ Backend  (node:3000)         │   │
                    │   │ MongoDB  (mongo:27017)       │   │
                    │   └──────────────────────────────┘   │
                    └──────────────────────────────────────┘
                       Docker Bridge Network Connection
```

### Diagram Explanation

**Git Repository**: Developer pushes code to GitHub/GitLab. Webhook automatically triggers Jenkins pipeline.

**Jenkins CI/CD Server**: Orchestrates 7-stage pipeline:

1. **Code Checkout**: Git clone and branch detection
2. **Build & Test**: npm install, npm run build, ESLint validation
3. **Docker Build**: Creates frontend and backend container images
4. **Registry Push**: Pushes images with version tags to Docker Hub/ECR
5. **Infrastructure IaC**: Terraform provisions VMs, Ansible configures Docker
6. **Deploy Containers**: Docker Compose starts all services
7. **Smoke Tests**: Validates all services are healthy

**Configuration Management**:

- Terraform: Provisions cloud infrastructure (VMs, networks, security groups)
- Ansible: Installs Docker, configures systems, manages deployments

**Docker Registry**: Central storage for container images (Docker Hub or private registry)

**Deployment Environment**:

- Hosts Docker engine with Docker Compose
- Frontend: Nginx web server on port 4000
- Backend: Node.js Express API on port 3000
- Database: MongoDB on port 27017 with persistent volume
- Services communicate through Docker bridge network

**Application Component Connectivity**:

- Frontend makes HTTP requests to Backend on port 3000
- Backend connects to MongoDB on port 27017
- All services share Docker network for inter-service communication
- Data persistence via Docker volumes for MongoDB

---

## Part 2: Automation Approach

### 1. DevOps Tools & Versions

| Tool               | Version | Purpose                                                  |
| ------------------ | ------- | -------------------------------------------------------- |
| **Git**            | 2.40+   | Version control for code management                      |
| **Jenkins**        | 2.387+  | CI/CD automation server orchestrating the pipeline       |
| **Terraform**      | 1.5+    | Infrastructure as Code for provisioning cloud resources  |
| **Ansible**        | 2.14+   | Configuration management for system setup and deployment |
| **Docker**         | 24.0+   | Containerization of application services                 |
| **Docker Compose** | 2.20+   | Orchestration of multiple containers with networking     |

### 2. Application Tools & Dependencies

**Frontend Stack:**

- Node.js 22 - JavaScript runtime
- React 19.1.1 - UI framework
- React Router DOM 7.9.1 - Client-side routing
- Axios 1.12.2 - HTTP client for API calls
- Vite 7.1.2 - Build tool
- ESLint 9.33.0 - Code quality validation
- Nginx stable-alpine - Production web server

**Backend Stack:**

- Node.js 22 - JavaScript runtime
- Express.js 5.1.0 - REST API framework
- Mongoose 8.18.1 - MongoDB ODM
- CORS 2.8.5 - Cross-origin request handling

**Database:**

- MongoDB - NoSQL database for hotel booking data

### 3. Automated Deployment Pipeline

#### **7-Stage Pipeline Execution**

```
Git Push Event
    ↓
Stage 1: Code Checkout
    ├─ Git clone repository
    └─ Branch detection
    ↓
Stage 2: Build & Test
    ├─ npm install (frontend & backend)
    ├─ npm run build (React build)
    ├─ npm run lint (ESLint validation)
    └─ Dependencies verification
    ↓
Stage 3: Docker Image Build
    ├─ Frontend Image
    │  ├─ Base: node:22 → npm install → npm run build
    │  ├─ Base: nginx:alpine → serve dist folder
    │  └─ Expose port 80 (mapped to 4000)
    ├─ Backend Image
    │  ├─ Base: node:22 → npm install
    │  └─ Expose port 3000
    └─ Tag images with build number and latest
    ↓
Stage 4: Push to Registry
    ├─ Authenticate with Docker Hub/ECR
    ├─ Push frontend image with tags
    └─ Push backend image with tags
    ↓
Stage 5: Infrastructure Provisioning
    ├─ Terraform: Creates/updates VM, security groups, networks
    └─ Ansible: Installs Docker, configures system, sets up volumes
    ↓
Stage 6: Deploy Application
    ├─ docker-compose down (stop old containers)
    ├─ docker-compose pull (fetch latest images)
    └─ docker-compose up -d (start all services)
       ├─ Frontend container on port 4000
       ├─ Backend container on port 3000
       ├─ MongoDB container with persistent volume
       └─ Create Docker bridge network
    ↓
Stage 7: Smoke Tests & Validation
    ├─ Frontend health check: curl http://instance:4000
    ├─ Backend health check: curl http://instance:3000
    ├─ Database connectivity test
    ├─ API endpoint validation
    └─ Service logs verification
    ↓
Success Notification (Slack/Email) → Deployment Complete
```

#### **Stage Details**

**Stage 1: Code Checkout**

- Automatically pulls latest code from Git on webhook trigger
- Checks out correct branch (main/develop)
- Verifies commit integrity

**Stage 2: Build & Test**

- Installs npm dependencies for both frontend and backend
- Builds React application using Vite
- Runs ESLint code quality checks
- Verifies backend dependencies

**Stage 3: Docker Image Build**

- **Frontend**: Multi-stage build
  - Stage 1: node:22 installs dependencies and builds React app
  - Stage 2: nginx:alpine serves static files on port 80
  - Reduces final image size by separating build and runtime
- **Backend**: node:22 runtime
  - Installs dependencies and copies application code
  - Exposes port 3000 for Express server
- Tags images with build number and latest for versioning

**Stage 4: Registry Push**

- Authenticates with Docker Hub or private registry
- Pushes frontend image with tags (build number, latest)
- Pushes backend image with tags (build number, latest)
- Enables rollback capability by maintaining versioned images

**Stage 5: Infrastructure Provisioning**

- **Terraform**:
  - Provisions cloud VM instances (AWS EC2/Azure VM/On-premises)
  - Creates security groups and firewall rules
  - Sets up VPC/Network configurations
  - Creates storage volumes for MongoDB persistence
- **Ansible**:
  - Installs Docker CE and starts daemon
  - Updates system packages
  - Creates Docker network for inter-service communication
  - Creates volumes for database persistence
  - Configures user permissions and security

**Stage 6: Deploy Application**

- Copies Docker Compose file to target server
- Pulls latest container images from registry
- Stops and removes old containers
- Starts new services via Docker Compose:
  - Frontend service on port 4000
  - Backend service on port 3000
  - MongoDB service on port 27017
- Creates persistent volume for MongoDB data
- Sets environment variables for inter-service connectivity

**Stage 7: Smoke Tests & Validation**

- Frontend health check (HTTP 200 response on port 4000)
- Backend health check (API responds on port 3000)
- Database connectivity test via backend API
- API endpoint validation
- Verifies container logs for errors
- Reports pipeline status to team

### 4. Automation Workflow

1. **Trigger**: Developer commits and pushes code to Git main/develop branch
2. **Detection**: Git webhook detects push event and notifies Jenkins
3. **Execution**: Jenkins automatically runs all 7 pipeline stages sequentially
4. **Build**: Code is compiled, tested, and Docker images created with version tags
5. **Registry**: Images stored in Docker Hub/ECR for versioning and rollback
6. **Infrastructure**: Terraform provisions required cloud resources if needed
7. **Configuration**: Ansible configures servers and sets up Docker environment
8. **Deployment**: Docker Compose brings up all services automatically
9. **Validation**: Automated smoke tests verify all services are running
10. **Notification**: Team receives deployment success/failure notification

### 5. Key Benefits

- **Consistency**: Same automated process every deployment
- **Speed**: Code to live deployment in minutes
- **Reliability**: Automated testing catches issues early
- **Traceability**: Git commits linked to deployed versions with image tags
- **Rollback**: Quick rollback using tagged Docker images
- **Scalability**: Process repeatable across multiple environments

---

## Summary

This CI/CD pipeline for the Hotel Booking Application provides:

- Continuous integration of code changes with automated testing
- Infrastructure provisioning via Terraform and system configuration via Ansible
- Containerized deployment with Docker and Docker Compose
- Automated validation through smoke tests before marking deployment successful
- Complete automation from Git push to live application deployment
