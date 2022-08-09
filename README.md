# TeenageConcerns-API

A web app for a start-up that connects depressed and sad people with mentors who can help them out and ensure they don't make any rash decisions. This is being made in nodejs and react, Postgres

BackEnd - This consists of all the back end stuff, written in NodeJS and uses socket.io for the chat feature

Currently, 
1. `/user/register` 
    - POST request    
    - User can register
    - Returns id of the user and mentor details which is by default null
2. `/findadvisor/:id` 
    - GET request
    - Get user details
    - Returns advisor details
3. `/user/delete/:id`
    - Delete Request
    - Delete an user account based on ID
4. `/volunteer/register` 
    - Volunteer can register
    - Returns name, email, users, current and past for a volunteer
    - Default values for users, current and past is 0
5. `/volunteer/login` 
    - Volunteer can Login
    - Returns name, email, users, current and past for a volunteer
6. Chat Option
    - Anonymous Chat option between Volunteer and User
    - Currently runs on a different port, need to shift it to a different endpoint, maybe, `/chat/ `

### How to run the code
The Backend code is dockerized, and using docker is the ideal way to run this app

`docker-compose run --build ` should ensure your databases and chats and the main server file are running at once
