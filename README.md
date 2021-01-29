# M7011E

Design of Dynamic Web Systems 7.5 Credits, Course, master's level, M7011E

## Requirements

Windows

Node.js: [https://nodejs.org/en/](https://nodejs.org/en/)

pgAdmin or similar for setting up a PostgreSQL database: [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)

## Setup

1. Install TypeScript globally with ``npm install -g typescript``

2. Clone repository with ``git clone https://github.com/MarqusJonsson/M7011E.git ``

### Front-end

3. Open a command prompt and go to M7011E/frontend

4. Run ``npm install`` to install necessary dependencies for the front-end server

### Back-end

#### Authentication

5. Configure and create a PostgreSQL database named m7011e-auth and a PostgreSQL user and database password (Using pgAdmin for example)

6. Go to M7011E/backend/auth using a file explorer

7. Duplicate the .envTEMPLATE file and rename it to .env

8. Fill in the information under the Auth database config section according to what was done in step 5 (database name, PostgreSQL user and database password)

9. Open a command prompt, go to M7011E/backend/auth and run ``npm install`` to install necessary dependencies for the authentication server

#### Simulator

10. Go to M7011E/backend/simulator using a file explorer

11. Duplicate the .envTEMPLATE file and rename it to .env

12. Fill in the information under the Auth database config section according to what was done in step 4 (database name, PostgreSQL user and database password)

13. Open a command prompt, go to M7011E/backend/simulator and run ``npm install`` to install necessary dependencies for the simulator server

#### TLS/SSL 

Each server will be running with TLS encrypted communication, therefore a certificate and key pair needs to be provided in a directory called ``ssl`` in the root directory of each server.

Note: if you do not have access to a certificate and key pair, you can creeate a self signed pair using OpenSSL by running the command ``openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout ./server.key -out ./server.crt``.

## Running the system

14. Open a command prompt and go to M7011E/frontend

15. Run ``npm run start`` to start the front-end server

16. Open a command prompt and go to M7011E/backend/auth

17. Run ``npm run startts`` to start the authentication server

18. Create a copy of the generated access public key "``accessPublic.key``" from step 16 located in the root directory of the auth server and move the copy to the root directory of the simulator server

19. Open a command prompt and go to M7011E/backend/simulator

20. Run ``npm run startts`` to start the simulator server (note to run the startts script and not start script)

# Docker Deployment
For a deployment on a VPS example, 3 docker images have been prepared containing code for the front-end server, authentication-server and simulator server respectively from [https://hub.docker.com/repository/docker/osksun/m7011e-images](https://hub.docker.com/repository/docker/osksun/m7011e-images) where the ssl keys, database and public keys have already been prepared.

Assuming Docker (19.03.8+) has been installed, the following steps to setup the docker containers are:
1. Clone the front-end server image ``docker pull osksun/m7011e-images:front-end-server``

2. Clone the authentication server image ``docker pull osksun/m7011e-images:authentication-server``

3. Clone the simulator server image ``docker pull osksun/m7011e-images:simulator-server``

4. Create a copy of the startSystem.sh script in M7011E/startSystem.sh move it to where Docker can access it and make it executable with ``chmod u+x startSystem.sh``

5. Run the startSystem.sh script ``./startSystem.sh`` to start 3 docker containers and the setup scripts for each container respectively.
