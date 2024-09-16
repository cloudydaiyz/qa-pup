# test-container

`source scripts/build_container.sh` - build the container and updates environment variables if you have a `secrets.sh` file declared in the `scripts` folder (look at `secrets.temp.sh` for reference)

`source scripts/run_container.sh` - runs the container created by `scripts/build_container.sh`

`scripts/start.sh` - builds and runs the container