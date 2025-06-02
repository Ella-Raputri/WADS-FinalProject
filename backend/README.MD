# WADS Final Project Backend - NMC Website

<img src="../docs_images/logo_nmc.png" alt="NMC Logo" width="300">

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)

<br>

## Setup Process (Local)

### 1. Clone the repository and change directory to the respective repository.
```sh
git clone https://github.com/Ella-Raputri/WADS-FinalProject
cd WADS-FinalProject/backend
```

### 2. Installing all dependencies in backend.
```sh
npm install
```

### 3. Create a .env file, then copy the content of the backend.txt file that is located in the backend folder. Fill in the content based on your configurations. 

### 4. Run the backend
```sh
npm run dev
```

### 5. Access the Application
```sh
http://localhost:3004/
```

<br>

## Docker Setup
You can view the Docker image in the Docker Hub: [ellaraputri/mern-nmc-backend:latest](https://hub.docker.com/repository/docker/ellaraputri/mern-nmc-backend). 
### 1. Pull the Docker Image
```sh
docker pull ellaraputri/mern-nmc-backend:latest
```

### 2. Run the Container
```sh
docker run -p 3004:3004 -d ellaraputri/mern-nmc-backend:latest
```

### 3. Access the Application
```sh
http://localhost:3004/
```

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


## Features

- Passport for <b>OAuth2 Authentication</b> with Google 

- Authentication with <b>JWT</b> tokens 

- User email verification and reset password with <b>OTP</b> sent from email

- Image upload functionality with <b>Cloudinary</b>

- <b>Competition registration and FAQs</b> for participants

- Participants' submission <b>review and commenting</b> from admins

- <b>Real-time chat</b> messages between admin and participants

- <b>Real-time discussion and collaboration</b> between admins

- <b>Retrieval-Augmented Generation</b> in the chatbot AI using <b>Pinecone</b>

- <b>Gemini</b> powered AI chatbot

- <b>Performance review</b> of admins in dashboard

- Participant <b>satisfaction rating</b> to admins

- <b>Downloadable data</b> for admins (includes tickets, registration submission, and dashboard metrics)


<br>

## API Calls

<details>
<summary><b>AdminDashboard</b></summary>

- Get total tickets in the past week

- Get total number of participants

- Get average first response time

- Get average full ticket resolution time

- Get received vs resolved tickets data for bar chart

- Get ticket breakdown by emergency level

- Get ticket breakdown by status

- Get number of tickets handled per agent

- Get average rating percentage metrics

</details>

<details>
<summary><b>Authentication</b></summary>

- Register a new participant account

- Log in as a user

- Logout user

- Send OTP to email for account verification

- Verify user email with OTP

- Check if user is authenticated

- Send OTP for password reset

- Verify OTP for password reset

- Reset user password

- Initiates Google OAuth2 login

- Google OAuth2 callback

</details>

<details>
<summary><b>CompetitionRegistration</b></summary>

- Get all upcoming competitions

- Get user registration info

- Get all competitions registered by user

- Register for a competition

- Delete a competition registration

- Update registration status and admin comment

- Get all competition registrations

</details>

<details>
<summary><b>Competition</b></summary>

- Get competition ID by name

- Get competition details by ID

- Get all competitions

</details>

<details>
<summary><b>Image</b></summary>

- Upload image in base64 format

</details>

<details>
<summary><b>Message</b></summary>

- Get all messages between participant and admin

- Participant sends message to admin

- System sends message to participant

- Get all messages between admins

- Admin sends message to admin group

- Send message to chatbot

- Get all messages sent to chatbot

- Generate response from chatbot 

</details>

<details>
<summary><b>Ticket</b></summary>

- Upload new ticket

- Get all tickets for a user

- Get all tickets by competition type

- Update ticket status

- Get the last updated time of a ticket

- Submit a rating for a ticket

- Fetch rating for a specific ticket

</details>

<details>
<summary><b>User</b></summary>

- Get logged-in user data

- Get user data by user ID

- Edit user details

</details>


<br>


## API Documentation
To access the API documentation, run the backend server and access http://localhost:3004/api-docs/.
