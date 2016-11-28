# Gardening Application

## Description

This application is using a NodeJS server with Express to the serve the API and sequelize as an ORM on a Postgres database. The API is interfaced with an EmberJS frontend.

The server is also running JohnnyFive, which talks with an Arduino using sensors in a garden.

## Setup

1. Assure you have NodeJS and NPM installed
1. cd into the `server` directory and run:
  ```
  npm install
  ```
1. Install Postgres on your machine, and create the database `gardening_app` and the user `root`. Start the Postgres database server.
1. Start the Gardening Application
  ```
  node main
  ```
1. cd into the `frontend` directory, and make sure EmberJS is installed and in your path. Once that's setup, install dependencies and start the Ember server:
  ```
  npm install
  ember server
  ```
