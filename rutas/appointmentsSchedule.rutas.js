const router = require("express").Router();
const AppointmentSchedule = require("../models/appointmentsSchedule");
const User = require("../models/userSchema");

//get Appointment Schedules;
router.get("/", async (req, res) => {
  try {
    const sort = { _id: -1 };
    const appointmentsSchedule = await AppointmentSchedule.find().sort(sort);
    res.status(200).json(appointmentsSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//create appointment Schedule
router.post("/", async (req, res) => {
  try {
    const { appointmentDay, appointmentTimes } = req.body;
    const appointmentSchedule = await AppointmentSchedule.create({
      appointmentDay,
      appointmentTimes,
    });

    const appointmentsSchedule = await AppointmentSchedule.find();
    res.status(201).json(appointmentsSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// update appointment
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { isEnabled, appointmentTimes } = req.body;
    const appointmentSchedule = await AppointmentSchedule.findByIdAndUpdate(
      id,
      { isEnabled, appointmentTimes }
    );

    const appointmentsSchedule = await AppointmentSchedule.find();
    res.status(200).json(appointmentsSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// delete appointment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const user = await User.findById(user_id);
    await AppointmentSchedule.findByIdAndDelete(id);
    const appointmentsSchedule = await AppointmentSchedule.find();
    res.status(200).json(appointmentsSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointmentSchedule = await AppointmentSchedule.findById(id);
    res.status(200).json({ appointmentSchedule });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
