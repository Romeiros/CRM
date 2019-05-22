# CRM Aplication


## Used
* MongoDB v4.0
* Express v4.16.3
* Angular v7.0.0
* NodeJS v10.13.0

## Required

* MongoDB v4.0
* NodeJS v10.13.0

## Usage

Install dependencies in root directory for backend and in client folder for frontend with

    npm install

Add in config folder file keys.dev.js for database connection


    module.exports = {
      mongoURI: 'mongodb://localhost:27017/chatapp',
      jwt: 'secret'
    }

And run

    npm run dev


Example of app on Heroku https://immense-river-53499.herokuapp.com/
