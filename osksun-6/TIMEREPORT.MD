| Date | Time spent (hours) | Work description  |
| :--- | :---: | :--- |
|2020-11-04| 10.5 | Added buildings and their components that are going to be used in the simulator. Also started with researching and implmenting unit testing for buildings and power plants.
|2020-11-05| 8 | Continued adding unit testing for power plants and user types. Researched on bicubical interpolation for wind speed based on geological data. Also added a library for gaussian distributions.
|2020-11-10| 9 | Removed circular dependencies in the simulator and moved sell logic from the house class to the prosumer class.
|2020-11-12| 6 | Started implementing interpolation to be used for having temperatures based on geological data.
|2020-11-13| 7 | Added bilinear interpolation that will be used for having similar temperatures and wind speeds based on geological data. Made a wrapper where our GeoData class can be used as input to the interpolation function and a test function for the bilinear interpolation. 
|2020-11-14| 5 | Created function for calculating consumption for buildings taking outside temperatures into consideration.
|2020-11-15| 5 | Updated the calculation of consumption for buildings and started making a GUI mockup for prosumers.
|2020-11-18| 10.5 | Continued with making the GUI mockup for prosumers and started working on frontend using Angular. Setup routing, error messages and a login page without authentication.
|2020-11-19| 11 | Started implementing the GUI for prosumers.
|2020-11-23| 4.5| Continued with implementing the GUI for prosumers.
|2020-11-25| 8 | Further continuation of implementing GUI for prosumers where the placements of everything images buttons etc is finished. Started looking into implementing a graph visualisation of energy consumption.
|2020-11-26| 8 | More details added to the prosumer GUI, most notable are blocks with sliders intended for regulating battery to power plant ratio for overproduction and underproduction. Also made a navigation to the settings page for prosumers.
|2020-12-02| 9.5 | Added a registration section and settings section where you currently can only see the preview of an image you are trying to upload. Also started working on the manager GUI page.
|2020-12-03| 10 | Worked on GUI for manager and prosumer. Added functions for setting values on information to be displayed such as electricity price, battery capacity etc. Also made the prosumer list where the goal is to have icons for removing the selected prosumer, blocking the selected and information about the selected prosumer.
|2020-12-09| 6 | Continued working on GUI for manager. Created a prosumer list where managers can see info about specific prosumers and in the future be able to block and delete prosumers.
|2020-12-10| 4.5 | Starting working on setting up graphql queries from frontend.
|2020-12-12| 3 | Continued setting up graphql queries.
|2020-12-13| 7 | More setting up graphql queries so it can the values requested from the simulator can be displayed in both manager and prosumer GUI.
|2020-12-15| 11.5 | Added more functionality to manager GUI and graphql queries. Also started working on adding mutation requests for our system.
|2020-12-16| 13 | Added generic dialog component and service to frontend and finished mutation request for blocking specific prosumer from selling specified by input. Also worked on presentation and added more content that can be retrieved with graphql queries.
|2020-12-17| 2.5 | Adjusted GUI for prosumer.
|2020-12-19| 9 | Started splitting our single ratio for battery/powerplant electricity propagation into ratios for overproduction and underproduction. Also setup GraphQL mutation requests for the ratios.
|2020-12-20| 4 | Restructured and optimized the display of prosumer list in managar GUI.
|2020-12-22| 7 | Fix various bugs in manager GUI and made it possible to delete prosumers from the simulation.
|2020-12-23| 7 | Added a production output ratio for powerplants and fixed a misunderstanding of logic for what to do during underproduction. Also started working giving managers ability to stop/start powerplants with countdown being displayed.
|2020-12-29| 7 | Finished functionality for managers being able to stop and start power plants with countdown for delay until action is executed.
|2020-12-30| 7 | Started working on the report and made it possible to delete prosumers from both the simulation and the authentication server.
