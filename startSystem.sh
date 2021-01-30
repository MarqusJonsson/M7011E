#WARNING This is only used for the docker deployment of the system and can not be used without following the steps in the Docker Deployment section in https://github.com/MarqusJonsson/M7011E
docker run -dit --name auth-server -p 3001:3001 auth-server
docker exec -d auth-server bash /home/auth-server/startAuthServer.sh
docker run -dit --name simulator-server -p 3002:3002 simulator-server
docker exec -d simulator-server bash /home/simulator-server/startSimulatorServer.sh
docker run -dit --name front-end-server -p 4200:4200 front-end-server
docker exec -d front-end-server bash /home/front-end-server/startFrontEndServer.sh