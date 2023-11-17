const basicAuth = require("express-basic-auth");
const path = require("path");
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSSequelize = require("@adminjs/sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const models = require("./models");
const { server } = require("./graphql");
AdminJS.registerAdapter(AdminJSSequelize);
const adminJs = new AdminJS({
    databases: [models.sequelize],
    resources: [
        models.Airplane,
        {
          resource: models.BoardingTicket,
          options: {
            properties: {
              isEmployee: {
                isVisible: false,
              }
            }
          }
        },
        models.Customer,
        models.FlightSchedule,
        models.Receipts,
    ],
    rootPath: '/admin',
});  
const router = AdminJSExpress.buildRouter(adminJs);
models.sequelize.sync({
    force: false,
    logging: false
  }).then(function () {
    console.log("> database has been synced");
    }).catch(function (err) {
    console.log(" > there was an issue synchronizing the database", err);
});

app.use(bodyParser.json({ type: 'application/json' }));
app.use(adminJs.options.rootPath, basicAuth({users: { 'admin': 'supersecret' }, challenge: true,}), router);
//app.use('/graphql', server);
server.listen(3001, () => {
  console.info('Server is running on http://localhost:3001/graphql')
});
app.use(express.static(path.join(__dirname, "public")));

const { bookTicket } = require("./routes/tickets");
const { createSchedule, flightSchedules } = require("./routes/flights");
const { getAirplane, getAirplanes, createAirplane } = require("./routes/airplanes");

app.get('/airplanes', getAirplanes);
app.post('/airplanes', createAirplane);
app.get('/airplanes/:id', getAirplane);
app.get('/flights', flightSchedules);
app.post('/schedules', createSchedule);
app.post('/book-flight', bookTicket);

app.listen(3000, function () {
    console.log("> express server has started");
});