Building the Docker image: 

`docker image build -t lpp-buses:1.0.0 .`

Running the Docker image:

`docker container run --publish 8091:8091 --detach --name lpp-buses lpp-buses:1.0.0`

Removing the Docker image:

`docker container remove --force lpp-buses`