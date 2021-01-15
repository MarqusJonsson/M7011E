| Date | Time spent (hours) | Task done |
| :--- | :---: | :--- |
| 2020-11-04 | 10.5 | <ul><li>PostgreSQL setup locally.</li><li>Node.js setup with TypeScript.</li><li>Created scripts for database connection and create/clear/reset for database tables.</li><li>Started creating resolvers that interacts with the database.</li><li>Started creating schemas including queries, mutations and types to use with GraphQL.</li><li>Setup webserver to host GraphQL API locally.</li><li>Implemented CORS and error handling middlewares for webserver.</li></ul> |
| 2020-11-05 | 8 | <ul><li>Continued creating resolvers.</li><li>Continued creating schemas.</li></ul> |
| 2020-11-10 | 8 | <ul><li>Continued creating resolvers.</li><li>Continued creating schemas.</li><li>Created script to populate database given a list of defined users.</li><li>Created a postman collection for testing the GraphQL API.</li></ul> |
| 2020-11-12 | 6 | <ul><li>Started setting up the simulator, initiating all different objects and created a main loop for running the simulator using either fixed time or real time at specified sampling interval.</li></ul> |
| 2020-11-13 | 7 | <ul><li>Worked on fixing bugs which appeared when running the simulator and making the simulator itself run properly.</li></ul> |
| 2020-11-14 | 5 | <ul><li>Started creating resolvers and schemas for the GraphQL API which other systems can connect to in order to obtain data from the simulator.</li></ul> |
| 2020-11-15 | 5 | <ul><li>Continued with the resolvers.</li><li>Rewrote parts of the simulator to better match the assignment, such as the manager having a list of prosumers instead of each house having a reference to a manager.</li></ul> |
| 2020-11-18 | 10.5 | <ul><li>Continued working on the API and started making it usable by both prosumers and managers.</li><li>Added errors for debuging purposes as well as errors which will be used when using the API, such as when searching for an object that does not exist.</li></ul> |
| 2020-11-19 | 11 | <ul><li>Updated the API to a context parameter for storing and later obtaining data to be used for authorization.</li><li>Replaced some of the arrays used in the simulator with maps in order to speed up the lookup process of objects when using the API.</li></ul> |
| 2020-11-23 | 6 | <ul><li>Started setting up an authorization server together with a PostgreSQL database which will be creating JWTs(JsonWebTokens) used to verify users.</li></ul> |
| 2020-11-25 | 10 | <ul><li>Started implementing a RESTful API for authentication of users.</li></ul> |
| 2020-11-26 | 8 | <ul><li>Created repositories for users, histories and refresh tokens which will be stored in the authentication servers database.</li><li>Created a parser to read errors and translate them into response messages with apropiate HTTP status codes and messages.</li><li>Started setting up creation and handling of refresh tokens and access tokens on the authentication server.</li></ul> |
| 2020-12-02 | 10 | <ul><li>Setup endpoints for register, login and logout on the authentication server.</li><li>Setup authentication of access tokens on the simulator server.</li></ul> |
| 2020-12-03 | 8 | <ul><li>Added roles to users on the authentication servers database.</li><li>Started adding styling and functionality to the register page.</li></ul> |
| 2020-12-09 | 10 | <ul><li>Added functionality and styling to the login page.</li><li>Created an interceptor for handling JWT tokens when sending requests from a client.</li><li>Added guards for the prosumer page aswell as the manager page to prevent an unauthorized user to view the pages.</li></ul> |
| 2020-12-10 | 5 | <ul><li>Created a faker for the simulator to create random prosumers and managers.</li><li>Created an interceptor for the frontend client to add user data to all request send to the simulator server.</li><li>Made it possible to add users to the simulator during runtime.</li></ul> |
| 2020-12-12 | 3 | <ul><li>Added functionality to get data about prosumers and managers in the simulator API.</li><li>Cleanup simulator code to use inheritance instead of duplicate code for "BaseUser" objects.</li></ul> |
| 2020-12-13 | 7 | <ul><li>Cleanup usage of user data which is sent to simulator server and used jwt payload instead.</li><li>Made it so the simulator automatically creates user in simulator if requesting useris not already in the simulator.</li></ul> |
| 2020-12-15 | 8 | <ul><li>Setup query interval for fetching data to frontend pages.</li><li>Started working on creating geo data maps which will be interpolated on using trilinear interpolation to get values for data such as temperature and wind speed to be dependant on geograpic location.</li></ul> |
| 2020-12-15 | 13 | <ul><li>Worked on presentation.</li><li>Continued working with the geo data maps.</li></ul> |
| 2020-12-16 | 12 | <ul><li>Continued to work on presentation.</li><li>Added purgining of expired refresh tokens.</li></ul> |
| 2020-12-19 | 8 | <ul><li>Worked on finding and fixing bugs related to handling of JWTs.</li><li>Created component for logout button.</li></ul> |
| 2020-12-20 | 3 | <ul><li>Started working on allowing users to upload profile pictures.</li></ul> |
| 2020-12-22 | 7 | <ul><li>Continued working on allowing uses to upload profile pictures.</li></ul> |
| 2020-12-23 | 6 | <ul><li>Created components for viewing and uploading images.</li></ul> |
| 2020-12-29 | 5 | <ul><li>Fixed issue regarding storing images incorrectly.</li></ul> |
| 2020-12-30 | 5 | <ul><li>Added removal of related refresh token when deleting a user.</li></ul> |
| 2020-12-31 | 5 | <ul><li>Fixed interpolation of data maps.</li><li>Started working on creating graphs for the user pages.</li></ul> |
| 2021-01-01 | 10 | <ul><li>Continued working on creating graphs for the user pages.</li><li>Fixed issues regarding production and consumption variables in simulator.</li><li>Restructure project files on frontend.</li><li>Started working on making the frontend more visually appealing.</li></ul> |
| 2021-01-02 | 4 | <ul><li>Continued adding styling of the frontend application.</li></ul> |
| 2021-01-04 | 4 | <ul><li>Continued adding styling of the frontend application.</li><li>Added css variables to eventually control most relevant styling properties dynamically.</li></ul> |
| 2021-01-05 | 5 | <ul><li>Continued wokring on the visual aspects of the frontend application.</li><li>Added CSS animations.</li></ul> |
| 2021-01-06 | 4 | <ul><li>Continued wokring on the visual aspects of the frontend application.</li><li>Mostly focused on the prosumer page.</li></ul> |
| 2021-01-07 | 7 | <ul><li>Continued wokring on the visual aspects of the frontend application.</li><li>Mostly focused on the manager page.</li></ul> |
| 2021-01-08 | 9 | <ul><li>Worked on the report.</li><li>Improved security by adding encryption using TLS.</li></ul> |
| 2021-01-11 | 9 | <ul><li>Worked on the report.</li><li>Worked on deploying the system using a VPS provided by LUDD DUST and docker containers to run each server independantly.</li></ul> |
| 2021-01-12 | 6 | <ul><li>Worked on the report.</li><li>Added online status for prosumers to be shown from the manager page.</li></ul> |
| 2021-01-13 | 4 | <ul><li>Started working on updating the list of prosumers on the manager page.</li></ul> |
| 2021-01-14 | 5 | <ul><li>Added the featue to show a prosumers view as a manager.</li></ul> |

