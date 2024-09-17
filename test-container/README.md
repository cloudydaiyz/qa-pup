# qa-pup-test-container

Container to run Playwright tests on. [View on Docker Hub](https://hub.docker.com/r/cloudydaiyz/qa-pup-test-container).

## Commands

`source scripts/build_container.sh` - build the container and updates environment variables if you have a `secrets.sh` file declared in the `scripts` folder (look at `secrets.temp.sh` for reference)

`source scripts/run_container.sh` - runs the container created by `scripts/build_container.sh`

`scripts/start.sh` - builds and runs the container

## Notes 

https://docs.docker.com/get-started/workshop/04_sharing_app/ 

https://docs.docker.com/reference/cli/docker/image/push/ 