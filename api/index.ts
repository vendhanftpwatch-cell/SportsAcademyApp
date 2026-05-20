import express from "express";
import dotenv from "dotenv";
import path from "path";
import { webcrypto } from "crypto";

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

dotenv.config();

let mongoose: any;
const importMongoose = async () => {
  try {
    mongoose = await import("mongoose");
    console.log("Mongoose successfully imported");
  } catch (e) {
    console.log("Mongoose not available, running without database");
    console.error("Mongoose import error:", e);
  }
};

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vendhan:vendhan123@cluster0.irfa0ip.mongodb.net/?appName=Cluster0";

let Student, Coach, Attendance, Payment, Sport, Schedule, Event;
let dbConnected = false;

async function connectMongo() {
  if (mongoose) {
    try {
      await mongoose.connect(MONGODB_URI);
      dbConnected = true;
      console.log("Connected to MongoDB");
      const { Schema } = mongoose;
      
       const studentSchema = new Schema({
         name: { type: String, required: true },
         firstName: { type: String },
         lastName: { type: String },
         age: { type: Number },
         gender: { type: String },
         phone: { type: String },
         email: { type: String },
         address: { type: String },
         parentName: { type: String },
         parentPhone: { type: String },
         emergencyContact: { type: String },
         emergencyPhone: { type: String },
         dateJoined: { type: Date, default: Date.now },
         active: { type: Boolean, default: true },
         school: { type: String },
         standard: { type: String },
         classesEnrolled: { type: [String], default: [] },
         fees: { type: Number, default: 0 },
         feesStatus: { type: String, default: 'Pending' },
         attendance: { 
           totalDays: { type: Number, default: 0 },
           presentDays: { type: Number, default: 0 },
           percentage: { type: Number, default: 0 }
         },
         achievements: { type: [String], default: [] },
         sportsJoined: { type: [String], default: [] }
       }, { timestamps: true });
      
      const coachSchema = new Schema({
        name: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },
        phone: { type: String },
        email: { type: String },
        specialization: { type: String },
        experience: { type: Number },
        dateJoined: { type: Date, default: Date.now },
        active: { type: Boolean, default: true }
      }, { timestamps: true });

      // If frontend provides a single `name` field, populate firstName/lastName
      studentSchema.pre('validate', function() {
        // @ts-ignore
        if ((!this.firstName || !this.lastName) && this.name) {
          // @ts-ignore
          const parts = String(this.name).trim().split(/\s+/);
          // @ts-ignore
          this.firstName = this.firstName || parts.shift() || '';
          // @ts-ignore
          this.lastName = this.lastName || parts.join(' ') || '';
        }
      });
      
      const attendanceSchema = new Schema({
        studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
        coachId: { type: Schema.Types.ObjectId, ref: 'Coach' },
        date: { type: Date, required: true },
        status: { type: String, required: true },
        type: { type: String, required: true, enum: ['student', 'coach'] }
      }, { timestamps: true });
      
      const paymentSchema = new Schema({
        coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
        amount: { type: Number, required: true },
        month: { type: String, required: true },
        year: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        method: { type: String },
        status: { type: String, default: 'paid' }
      }, { timestamps: true });
      
      const sportSchema = new Schema({
        name: { type: String, required: true },
        coach: { type: String, required: true },
        timing: { type: String, required: true },
        location: { type: String, required: true },
        maxStudents: { type: Number, required: true },
        currentStudents: { type: Number, default: 0 },
        fees: { type: Number, required: true },
        image: { type: String }
      }, { timestamps: true });
      
      const scheduleSchema = new Schema({
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        location: { type: String },
        sport: { type: String },
        coach: { type: String },
        maxParticipants: { type: Number },
        currentParticipants: { type: Number, default: 0 }
      }, { timestamps: true });
      
      const eventSchema = new Schema({
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        location: { type: String },
        type: { type: String },
        image: { type: String },
        isActive: { type: Boolean, default: true }
      }, { timestamps: true });
      
      Student = mongoose.model('Student', studentSchema);
      Coach = mongoose.model('Coach', coachSchema);
      Attendance = mongoose.model('Attendance', attendanceSchema);
      Payment = mongoose.model('Payment', paymentSchema);
      Sport = mongoose.model('Sport', sportSchema);
      Schedule = mongoose.model('Schedule', scheduleSchema);
      Event = mongoose.model('Event', eventSchema);
      
      console.log("Database models initialized");
    } catch (err) {
      dbConnected = false;
      console.error("MongoDB connection error:", err);
    }
  }
}

let app: express.Application;

async function getApp() {
  if (app) return app;
  
  await importMongoose();
  await connectMongo();
  
  app = express();
  app.use(express.json());

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

  app.get("/api/students", async (req, res) => {
    try {
      if (!Student) return res.json([]);
      const students = await Student.find();
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      if (!Student) return res.status(503).json({ error: "Database not available" });
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (err) {
      console.error("Student creation error:", err);
      // Prefer sending validation details when available to aid debugging
      const detail = err && (err.message || JSON.stringify(err));
      res.status(400).json({ error: "Failed to create student", detail });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      if (!Student) return res.status(503).json({ error: "Database not available" });
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.json(student);
    } catch (err) {
      res.status(400).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      if (!Student) return res.status(503).json({ error: "Database not available" });
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return res.status(404).json({ message: "Student not found" });
      await Attendance.deleteMany({ studentId: req.params.id, type: 'student' });
      res.json({ message: "Student deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  app.get("/api/coaches", async (req, res) => {
    try {
      if (!Coach) return res.json([]);
      const coaches = await Coach.find();
      res.json(coaches);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch coaches" });
    }
  });

  app.post("/api/coaches", async (req, res) => {
    try {
      if (!Coach) return res.status(503).json({ error: "Database not available" });
      const coach = new Coach(req.body);
      await coach.save();
      res.status(201).json(coach);
    } catch (err) {
      res.status(400).json({ error: "Failed to create coach" });
    }
  });

  app.put("/api/coaches/:id", async (req, res) => {
    try {
      if (!Coach) return res.status(503).json({ error: "Database not available" });
      const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(coach);
    } catch (err) {
      res.status(400).json({ error: "Failed to update coach" });
    }
  });

  app.delete("/api/coaches/:id", async (req, res) => {
    try {
      if (!Coach) return res.status(503).json({ error: "Database not available" });
      await Coach.findByIdAndDelete(req.params.id);
      await Attendance.deleteMany({ coachId: req.params.id, type: 'coach' });
      res.json({ message: "Coach deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete coach" });
    }
  });

  app.get("/api/attendance", async (req, res) => {
    try {
      if (!Attendance) return res.json([]);
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
      if (!Attendance) return res.status(503).json({ error: "Database not available" });
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

  app.get("/api/payments", async (req, res) => {
    try {
      if (!Payment) return res.json([]);
      const payments = await Payment.find().populate('coachId');
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      if (!Payment) return res.status(503).json({ error: "Database not available" });
      const payment = new Payment(req.body);
      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      res.status(400).json({ error: "Failed to create payment" });
    }
  });

  app.get("/api/sports", async (req, res) => {
    try {
      if (!Sport) return res.json([]);
      const sports = await Sport.find();
      res.json(sports);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch sports" });
    }
  });

  app.post("/api/sports", async (req, res) => {
    try {
      if (!Sport) return res.status(503).json({ error: "Database not available" });
      const sport = new Sport(req.body);
      await sport.save();
      res.status(201).json(sport);
    } catch (err) {
      res.status(400).json({ error: "Failed to create sport" });
    }
  });

  app.put("/api/sports/:id", async (req, res) => {
    try {
      if (!Sport) return res.status(503).json({ error: "Database not available" });
      const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(sport);
    } catch (err) {
      res.status(400).json({ error: "Failed to update sport" });
    }
  });

  app.delete("/api/sports/:id", async (req, res) => {
    try {
      if (!Sport) return res.status(503).json({ error: "Database not available" });
      await Sport.findByIdAndDelete(req.params.id);
      res.json({ message: "Sport deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete sport" });
    }
  });

  app.get("/api/schedules", async (req, res) => {
    try {
      if (!Schedule) return res.json([]);
      const schedules = await Schedule.find();
      res.json(schedules);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      if (!Schedule) return res.status(503).json({ error: "Database not available" });
      const schedule = new Schedule(req.body);
      await schedule.save();
      res.status(201).json(schedule);
    } catch (err) {
      res.status(400).json({ error: "Failed to create schedule" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      if (!Schedule) return res.status(503).json({ error: "Database not available" });
      const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(schedule);
    } catch (err) {
      res.status(400).json({ error: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      if (!Schedule) return res.status(503).json({ error: "Database not available" });
      await Schedule.findByIdAndDelete(req.params.id);
      res.json({ message: "Schedule deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      if (!Event) return res.json([]);
      const events = await Event.find();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      if (!Event) return res.status(503).json({ error: "Database not available" });
      const event = new Event(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: "Failed to create event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      if (!Event) return res.status(503).json({ error: "Database not available" });
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  app.get("/api/health", (req, res) => {
    const readyState = mongoose ? (mongoose.connection && mongoose.connection.readyState) : null;
    res.json({ status: "ok", db: dbConnected, modelsInitialized: !!Student, mongooseReadyState: readyState });
  });

  return app;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await getApp();
  return app(req, res);
}