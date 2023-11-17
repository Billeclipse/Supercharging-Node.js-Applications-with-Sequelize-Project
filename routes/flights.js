const { DateTime } = require("luxon");
const { sequelize } = require("../models");
const models = require("../models");

async function flightSchedules(req, res) {
    const records = await models.FlightSchedule.findAll({
       include: [models.Airplane]
    });
    res.json(records);
}
exports.flightSchedules = flightSchedules;

async function createSchedule(req, res) {
    const { airplaneId, origin, destination, departure } = req.body;
    const dt = DateTime.fromISO(departure);
    if (!dt.isValid) {
        return res.status(400).send("invalid departure time");
    }
    try {
        const plane = await models.Airplane.findByPk(airplaneId);
        if (!plane) {
            return res.status(404).send("airplane does not exist");
        }
        const flight = await sequelize.transaction(async (tx) => {
            const schedule = await models.FlightSchedule.create({
                    originAirport: origin,
                    destinationAirport: destination,
                    departureTime: dt,
                }, { transaction: tx });
                await schedule.setAirplane(plane, 
                { transaction: tx });
                return schedule;
        });
        return res.json(flight);
    } catch (error) {
        return res.status(500).send(error);
    }
}
exports.createSchedule = createSchedule;