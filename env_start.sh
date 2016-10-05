#!/bin/bash
docker-compose up --force-recreate --build -d &&
open http://localhost:3000/