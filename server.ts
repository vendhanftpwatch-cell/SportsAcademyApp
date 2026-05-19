import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vendhan:vendhan123@cluster0.irfa0ip.mongodb.net/?appName=Cluster0";

// --- Database Schemas ---
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: String, // fallback
  sport: String,
  sportsJoined: [String],
  age: Number,
  gender: String,
  parentName: String,
  phone: String,
  address: String,
  joiningDate: { type: Date, default: Date.now },
  feesStatus: { type: String, default: "Pending" },
  attendance: { type: Number, default: 0 }
});

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  experience: String,
  phone: String,
  email: String,
  salary: { type: Number, default: 0 },
  joiningDate: { type: Date, default: Date.now },
  workingHours: String
});

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  type: { type: String, enum: ['student', 'coach'], required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent', 'leave'], required: true }
});

const paymentSchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  month: String, // e.g. "May 2024"
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  notes: String
});

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coach: String,
  timing: String,
  location: String,
  maxStudents: { type: Number, default: 30 },
  currentStudents: { type: Number, default: 0 },
  fees: { type: Number, default: 0 },
  image: String
});

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  activity: { type: String, required: true },
  coach: String,
  location: String
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teamA: String,
  teamB: String,
  date: String,
  time: String,
  venue: String,
  type: { type: String, default: 'Tournament' }, // Tournament, Ceremony, Victory, etc.
  color: String
});

const Student = mongoose.model("Student", studentSchema);
const Coach = mongoose.model("Coach", coachSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Sport = mongoose.model("Sport", sportSchema);
const Schedule = mongoose.model("Schedule", scheduleSchema);
const Event = mongoose.model("Event", eventSchema);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth (Using DB in a real app, keeping simple for now but using process.env if available)
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "vendhan" && password === "vendhan123") {
      res.json({ success: true, token: "mock-jwt-token", user: { name: "Vendhan", role: "admin" } });
    } else if (username === "admin" && password === "admin123") {
      res.json({ success: true, token: "mock-jwt-token", user: { name: "Admin", role: "admin" } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Students CRUD
  app.get("/api/students", async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (err) {
      res.status(400).json({ error: "Failed to create student" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.json(student);
    } catch (err) {
      res.status(400).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return res.status(404).json({ message: "Student not found" });
      // Clean up attendance
      await Attendance.deleteMany({ studentId: req.params.id, type: 'student' });
      res.json({ message: "Student deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // Coaches CRUD
  app.get("/api/coaches", async (req, res) => {
    try {
      const coaches = await Coach.find();
      res.json(coaches);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch coaches" });
    }
  });

  app.post("/api/coaches", async (req, res) => {
    try {
      const coach = new Coach(req.body);
      await coach.save();
      res.status(201).json(coach);
    } catch (err) {
      res.status(400).json({ error: "Failed to create coach" });
    }
  });

  app.put("/api/coaches/:id", async (req, res) => {
    try {
      const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(coach);
    } catch (err) {
      res.status(400).json({ error: "Failed to update coach" });
    }
  });

  app.delete("/api/coaches/:id", async (req, res) => {
    try {
      await Coach.findByIdAndDelete(req.params.id);
      await Attendance.deleteMany({ coachId: req.params.id, type: 'coach' });
      res.json({ message: "Coach deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete coach" });
    }
  });

  // Attendance CRUD
  app.get("/api/attendance", async (req, res) => {
    try {
      const type = req.query.type as "student" | "coach";
      const filter = type ? { type } : {};
      const records = await Attendance.find(filter);
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const { studentId, coachId, date, status, type } = req.body;
      const query = type === 'student' ? { studentId, date, type } : { coachId, date, type };
      const record = await Attendance.findOneAndUpdate(
        query,
        { status },
        { upsert: true, new: true }
      );
      res.json(record);
    } catch (err) {
      res.status(400).json({ error: "Failed to update attendance" });
    }
  });

  // Payments CRUD
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await Payment.find().populate('coachId');
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const payment = new Payment(req.body);
      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      res.status(400).json({ error: "Failed to create payment" });
    }
  });

  // Sports CRUD
  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await Sport.find();
      res.json(sports);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch sports" });
    }
  });

  app.post("/api/sports", async (req, res) => {
    try {
      const sport = new Sport(req.body);
      await sport.save();
      res.status(201).json(sport);
    } catch (err) {
      res.status(400).json({ error: "Failed to create sport" });
    }
  });

  app.put("/api/sports/:id", async (req, res) => {
    try {
      const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(sport);
    } catch (err) {
      res.status(400).json({ error: "Failed to update sport" });
    }
  });

  app.delete("/api/sports/:id", async (req, res) => {
    try {
      await Sport.findByIdAndDelete(req.params.id);
      res.json({ message: "Sport deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete sport" });
    }
  });

  // Schedule CRUD
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await Schedule.find();
      res.json(schedules);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const schedule = new Schedule(req.body);
      await schedule.save();
      res.status(201).json(schedule);
    } catch (err) {
      res.status(400).json({ error: "Failed to create schedule" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(schedule);
    } catch (err) {
      res.status(400).json({ error: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      await Schedule.findByIdAndDelete(req.params.id);
      res.json({ message: "Schedule deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  });
  
  // Events CRUD
  app.get("/api/events", async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: "Failed to create event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Basic Status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
