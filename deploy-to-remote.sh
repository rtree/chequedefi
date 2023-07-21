#!/bin/bash
#assuming this script is in app root folder
rsync -rauv --exclude 'node_modules' --exclude '.next' ../chequedefi/* ubuntu@arkt.me:/var/https/chequedefi
