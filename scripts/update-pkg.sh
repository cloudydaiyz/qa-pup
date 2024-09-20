#!/bin/bash

DIR="`pwd`/`dirname $0`"
CONTAINER_DIR="$DIR/../container"
TERRAFORM_DIR="$DIR/../cloud"
FUNCTIONS_DIR="$DIR/../functions"
WEBSITE_DIR="$DIR/../website"

# Package flags
CORE=true
TYPES=true

case $1 in
"core")
    CORE=true
    TYPES=false
    ;;
"types")
    TYPES=true
    CORE=false
    ;;
"all")
    ;;
*)
    echo "Invalid argument"
    exit 1
    ;;
esac

# Update flags
CONTAINER=true
FUNCTIONS=true
TERRAFORM=true
WEBSITE=true

if [ ! -z "$2" ] && [ "$2" != "-a" ]; then
    CONTAINER=false
    TERRAFORM=false
    FUNCTIONS=false
    WEBSITE=false
    while [ ! -z $2 ]; do
        case $2 in
        "-c")
            CONTAINER=true
            ;;
        "-t")
            FUNCTIONS=true
            TERRAFORM=true
            ;;
        "-f")
            FUNCTIONS=true
            ;;
        "-w")
            WEBSITE=true
            ;;
        *)
            echo "Invalid argument"
            exit 1
        esac
        shift
    done
fi

update_core() {
    npm un @cloudydaiyz/qa-pup-core
    npm i @cloudydaiyz/qa-pup-core
}

update_types() {
    npm un @cloudydaiyz/qa-pup-types
    npm i -D @cloudydaiyz/qa-pup-types
}

if [ $CONTAINER = true ]; then
    echo "Updating container..."
    cd $CONTAINER_DIR
    [ $CORE = true ] && update_core
    [ $TYPES = true ] && update_types
    scripts/start.sh
fi

if [ $FUNCTIONS = true ]; then
    echo "Updating cloud functions..."
    cd $FUNCTIONS_DIR
    [ $CORE = true ] && update_core
    [ $TYPES = true ] && update_types
fi

if [ $TERRAFORM = true ]; then
    echo "Updating terraform config..."
    cd $TERRAFORM_DIR
    scripts/apply.sh
fi