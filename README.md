************************* CSE 591: Adaptive Web, Assignment 3 *****************************

1. The Elastic Search Instance is hosted on AWS and all the Wikibooks data is already pushed to the index.
2. The Web App is hosted on https://tejakunderu.herokuapp.com
3. The recommendations are generated in a new tab (might be asked to allow popups on first run) when clicked on any post on the webpage.

To run the Web app locally (This would not run the app offline as the Elastic Search endpoint is on AWS) ---
1. Install Nodejs on the machine.
2. Navigate to the folder named AW_Assign3_Web.
3. Start the Nodejs server using the command "node server.js".
4. Navigate to the http://localhost:8080/ on the browser to view the app.

To run the app offline (Code changes to be made have been commented in the code) ---
1. Install Elastic Search by following the instructions at https://www.elastic.co/downloads/elasticsearch
2. Once the installation is complete, modify the wikibooks.py script by changing the AWS Elastic Search endpoint to http://localhost:9200/
3. Run the script wikibooks.py to index the data into Elastic Search.
4. Install Nodejs on the machine.
5. Navigate to a folder named AW_Assign3_Web.
6. Modify the endpoint in AW_Assign3_Web/app/routes.js to http://localhost:9200/ so that the Web app can make requests to the Elastic Search engine.
7. Start the Nodejs server using the command "node server.js".
8. Navigate to the link http://localhost:8080/ on the browser to view the app.
