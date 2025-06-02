# WADS Final Project Frontend - NMC

<img src="../docs_images/logo_nmc.png" alt="NMC Logo" width="300">

<br>

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)

<br>

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/Ella-Raputri/WADS-FinalProject
cd WADS-FinalProject
cd frontend
```

### 2. Install Frontend Dependencies
```sh
npm install
```

### 3. Start the Development Server
```sh
npm run dev
```
Vite will start a local development server and provide a URL (usually `http://localhost:5173/`).
Now, you can preview the frontend of this app. If you want to pull the images from Docker hub instead, you can choose the below configuration.

<br>

## Docker Setup
You can view the Docker image in the Docker Hub: [ellaraputri/mern-nmc-frontend:latest](https://hub.docker.com/repository/docker/ellaraputri/mern-nmc-frontend). 
### 1. Pull the Docker Image
```sh
docker pull ellaraputri/mern-nmc-frontend:latest
```

### 2. Run the Container
```sh
docker run -p 5173:5173 -d ellaraputri/mern-nmc-frontend:latest
```

### 3. Access the Application
```sh
http://localhost:5173/
```
Now, you can preview this app.

### 4. Stop the Docker Container
First, find the container ID
```sh
docker ps
```
Then, stop the container using its ID
```sh
docker stop <container_id>
```

<br>

## Project Folders

- **__mocks__** : Mocked modules for unit test
- **public**: Static assets served directly
- **src**: Source code (components, pages, etc.)
    - assets: images used in the code.
    - components: components created for the app.
    - context: app context to share global functionality.
    - lib: utility files to help the development.
    - pages: pages components for the app.

- **tests**: Unit tests for the pages and components.

<br>

