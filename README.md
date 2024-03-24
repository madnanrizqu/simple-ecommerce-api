## Description

This is a simple ecommerce site that has products and users

### Architecture

1. DB ERD: https://dbdiagram.io/d/Simple-ECommerce-65c91cefac844320aee82013
2. App: This app uses express with a MVC pattern. M is the db layer using Prisma defined in services files. C is the routes + controller files. The V is the html template for emails

## API Documentation

You can view the available APIs here: https://documenter.getpostman.com/view/19373971/2sA35A7jwE

## Vascomm

This fullfills all frontend requirement except OAuth

## Tech Used

1. Node.js
2. Express
3. Prisma
4. Postgress
5. Docker
6. Zod
7. Jwt

## How to run locally?

### Prerequisites

1. Install pnpm globally if you have'nt: https://pnpm.io/installation
2. Create a .env file from the .env.example. If you are strapped for time, just rename the .env.example to .env

### Step to run

1. Install dependencies: `$ npm install`
2. Run development server: `$ npm run dev`
3. Visit local web server at port 3000
