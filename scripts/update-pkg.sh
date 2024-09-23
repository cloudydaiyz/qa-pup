#!/bin/bash

# Updates the packages in /packages in depedenency directories depending on the
# provided flag 

# NOTE: npm version and npm publish are not ran in this script; they must be ran
# separately. This means the qa-pup-types pkg in qa-pup-core must be updated
# manually.

# usage: update-pkg.sh core|types flag

# Flags:
# -a: update all dependencies
# -n: do not update any dependencies
# -c: update container
# -t: update terraform
# -f: update cloud functions
# -w: update website

DIR="`pwd`/`dirname $0`"

update_core() {
    npm un @cloudydaiyz/qa-pup-core
    npm i @cloudydaiyz/qa-pup-core
}

update_types() {
    npm un @cloudydaiyz/qa-pup-types
    npm i -D @cloudydaiyz/qa-pup-types
}

# Package directories
CORE_DIR="$DIR/../packages/qa-pup-core"
TYPES_DIR="$DIR/../packages/qa-pup-types"

# Dependency directories
CONTAINER_DIR="$DIR/../container"
TERRAFORM_DIR="$DIR/../cloud"
FUNCTIONS_DIR="$DIR/../functions"
WEBSITE_DIR="$DIR/../website"

# Package update flags
CORE=1
TYPES=1

case $1 in
"core")
    CORE=1
    TYPES=0
    ;;
"types")
    ;;
*)
    echo "Invalid argument"
    exit 1
    ;;
esac

# Dependency update flags
CONTAINER=1
FUNCTIONS=1
TERRAFORM=1
WEBSITE=1

if [ ! -z $2 ] && [ $2 != "-a" ]; then
    CONTAINER=0
    TERRAFORM=0
    FUNCTIONS=0
    WEBSITE=0

    if [ $2 != "-n" ]; then
        while [ ! -z $2 ]; do
            case $2 in
            "-c")
                CONTAINER=1
                ;;
            "-t")
                FUNCTIONS=1
                TERRAFORM=1
                ;;
            "-f")
                FUNCTIONS=1
                ;;
            "-w")
                WEBSITE=1
                ;;
            *)
                echo "Invalid argument"
                exit 1
            esac
            shift
        done
    fi
fi

# Update dependencies

if [ $CONTAINER -eq 1 ]; then
    echo "Updating container..."
    cd $CONTAINER_DIR
    [ $CORE = 1 ] && update_core
    [ $TYPES = 1 ] && update_types
    `${DIR}/update-container.sh`
fi

if [ $FUNCTIONS -eq 1 ]; then
    echo "Updating cloud functions..."
    cd $FUNCTIONS_DIR
    [ $CORE = 1 ] && update_core
    [ $TYPES = 1 ] && update_types
fi

if [ $TERRAFORM -eq 1 ]; then
    echo "Updating terraform config..."
    cd $TERRAFORM_DIR
    `${DIR}/apply.sh`
fi