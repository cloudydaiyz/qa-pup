# qa-pup-test-container

Container to run Playwright tests on. This container is based on Ubuntu 24.04, which uses the ARM64 architecture. Make sure to specify this if running containers on a service such as ECS. 

[View on Docker Hub](https://hub.docker.com/r/cloudydaiyz/qa-pup-test-container). 

## Commands

- `scripts/entrypoint.sh` - Runs the container code locally, with updated environment variables if you have a `secrets.sh` file declared in the `scripts` folder (look at `secrets.temp.sh` for reference)

- `npm test` - Runs the container code locally with predefined environment variables (without building/running the container)

- `source scripts/build_container.sh` - build the container and updates environment variables if you have a `secrets.sh` file declared in the `scripts` folder (look at `secrets.temp.sh` for reference)

- `source scripts/run_container.sh` - runs the container created by `scripts/build_container.sh`

- `scripts/start.sh` - builds and runs the container