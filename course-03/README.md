# Instructions On How To Deploy The Project

## For Each Service
1. Install dependencies `npm i`
2. build docker image `docker build -t DockerHubName/imageName .`
3. run the image as a container and make sure everything is working fine `docker run --publish 8080:8080 --name name DockerHubName/imageName`
4. push the created image to docker hub `docker push DockerHubName/imageName`

> DockerHubName: Your username on docker hub. In my case (khiaryab)

> imageName: The image name in which to refered to on docker hub.

> Example for the feed service, the image would be named as -> (khiaryab/udacity-restapi-feed)

## Configure And Deploy The Services
Assuming the cluster is already created and up running
1. Update (env-secret.yaml), (env-configmap.yaml), and (aws-secret.yaml) with appropriate configuration
2. Deploy the config files
`kubectl apply -f env-secret.yaml`
`kubectl apply -f env-configmap.yaml`
`kubectl apply -f aws-secret.yaml`
3. Deploy each deployment and its service
`kubectl apply -f backend-feed-deployment.yaml`
`kubectl apply -f backend-feed-service.yaml`
4. Check if all services are running `kubectl get pods`
5. Forward for frontend and reverse proxy
`kubectl port-forward service/frontend 8100:8100`
`kubectl port-forward service/reverseproxy 8080:8080`
6. App should be running and can be tested from browser

> In case you needed to debug one the pods that are not running well, the following commands might help

`kubectl logs podName`
`kubectl logs --follow podName`
`kubectl get all`
`kubectl describe deployments/backend-feed`

# Project Related Resources
1. (travis-ci-screenshots) folder contains a screenshots of builds on configured Travis CI
2. All images are at Docker Hub: https://hub.docker.com/u/khiaryab