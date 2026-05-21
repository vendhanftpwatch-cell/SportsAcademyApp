import express from "express";
import path from "path";
import dotenv from "dotenv";

// Setup crypto for Node 16 compatibility (needed for Vite)
import { webcrypto } from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

import { createServer as createViteServer } from "vite";

dotenv.config();

// Skip mongoose connection in development if not available
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

// --- Database Models (only if mongoose is available) ---
let Student, Coach, Attendance, Payment, Sport, Schedule, Event, CourtBooking;
let dbConnected = false;

async function connectMongo() {
  if (mongoose) {
    try {
      await mongoose.connect(MONGODB_URI);
        dbConnected = true;
        console.log("Connected to MongoDB");
      
      // Define schemas and models after successful connection
      const { Schema } = mongoose;
      
      // Student Schema
      const studentSchema = new Schema({
        name: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        age: { type: Number },
        gender: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        emergencyContact: { type: String },
        emergencyPhone: { type: String },
        dateJoined: { type: Date, default: Date.now },
        active: { type: Boolean, default: true }
      }, { timestamps: true });

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
        // @ts-ignore
        if (!this.name && (this.firstName || this.lastName)) {
          // @ts-ignore
          this.name = `${this.firstName || ''}${this.lastName ? ` ${this.lastName}` : ''}`.trim();
        }
      });
      
      // Coach Schema
      const coachSchema = new Schema({
        name: { type: String, required: true },
        sport: { type: String },
        specialization: { type: String },
        experience: { type: Number },
        phone: { type: String },
        email: { type: String },
        salary: { type: Number },
        workingHours: { type: String },
        joiningDate: { type: String },
        dateJoined: { type: Date, default: Date.now },
        active: { type: Boolean, default: true }
      }, { timestamps: true });
      
      // Attendance Schema
      const attendanceSchema = new Schema({
        studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
        coachId: { type: Schema.Types.ObjectId, ref: 'Coach' },
        date: { type: Date, required: true },
        status: { type: String, required: true },
        type: { type: String, required: true, enum: ['student', 'coach'] }
      }, { timestamps: true });
      
      // Payment Schema
      const paymentSchema = new Schema({
        coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
        amount: { type: Number, required: true },
        month: { type: String, required: true },
        year: { type: Number, default: new Date().getFullYear() },
        paymentDate: { type: Date, default: Date.now },
        method: { type: String },
        status: { type: String, default: 'paid' }
      }, { timestamps: true });
      
      // Sport Schema
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
      
      // Schedule Schema
      const scheduleSchema = new Schema({
        day: { type: String, required: true },
        time: { type: String, required: true },
        activity: { type: String, required: true },
        coach: { type: String, required: true },
        location: { type: String, required: true }
      }, { timestamps: true });
      
      // Event Schema
      const eventSchema = new Schema({
        title: { type: String, required: true },
        teamA: { type: String },
        teamB: { type: String },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        color: { type: String },
        isActive: { type: Boolean, default: true }
      }, { timestamps: true });
      
      // Court Booking Schema
      const courtBookingSchema = new Schema({
        bookingType: { type: String, required: true },
        date: { type: String, required: true },
        startTime: { type: String },
        endTime: { type: String },
        courtType: { type: String, required: true },
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String },
        purpose: { type: String, required: true },
        additionalNotes: { type: String },
        status: { type: String, default: 'pending' }
      }, { timestamps: true });

      // Create models
Student = mongoose.model('Student', studentSchema);
       Coach = mongoose.model('Coach', coachSchema);
       Attendance = mongoose.model('Attendance', attendanceSchema);
       Payment = mongoose.model('Payment', paymentSchema);
       Sport = mongoose.model('Sport', sportSchema);
       Schedule = mongoose.model('Schedule', scheduleSchema);
       Event = mongoose.model('Event', eventSchema);
       CourtBooking = mongoose.model('CourtBooking', courtBookingSchema);
      
      console.log("Database models initialized");
    } catch (err) {
      dbConnected = false;
      console.error("MongoDB connection error:", err);
    }
  }
}

async function startServer() {
  await importMongoose();
  await connectMongo();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // --- API Routes ---

  // Auth
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
      res.status(400).json({ error: "Failed to create student" });
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

  // Coaches CRUD
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

  // Attendance CRUD
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

  // Payments CRUD
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
      const paymentBody = { ...req.body };
      if (!paymentBody.year && typeof paymentBody.month === 'string') {
        const yearMatch = paymentBody.month.match(/(\d{4})$/);
        paymentBody.year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      }
      const payment = new Payment(paymentBody);
      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      console.error('Payment creation error:', err);
      res.status(400).json({ error: "Failed to create payment" });
    }
  });

  // Sports CRUD
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
    
  // Events CRUD
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

  // Schedules CRUD
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

  // Court Bookings CRUD
  app.get("/api/court-bookings", async (req, res) => {
    try {
      if (!CourtBooking) return res.json([]);
      const bookings = await CourtBooking.find();
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch court bookings" });
    }
  });

  app.post("/api/court-bookings", async (req, res) => {
    console.log("[court-bookings POST] Body:", JSON.stringify(req.body));
    try {
      if (!CourtBooking) return res.status(503).json({ error: "Database not available" });
      const booking = new CourtBooking({
        ...req.body,
        status: 'pending'
      });
      await booking.save();
      
      console.log(`New court booking submitted: ${booking.fullName} for ${booking.date}`);
      
      res.status(201).json(booking);
    } catch (err) {
      console.error('Failed to create court booking:', err);
      res.status(400).json({ error: "Failed to create court booking" });
    }
  });

  app.put("/api/court-bookings/:id", async (req, res) => {
    try {
      if (!CourtBooking) return res.status(503).json({ error: "Database not available" });
      const booking = await CourtBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(booking);
    } catch (err) {
      res.status(400).json({ error: "Failed to update court booking" });
    }
  });

  app.delete("/api/court-bookings/:id", async (req, res) => {
    try {
      if (!CourtBooking) return res.status(503).json({ error: "Database not available" });
      await CourtBooking.findByIdAndDelete(req.params.id);
      res.json({ message: "Court booking deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete court booking" });
    }
  });

  // Basic Status
  app.get("/api/health", (req, res) => {
    const readyState = mongoose ? (mongoose.connection && mongoose.connection.readyState) : null;
    res.json({ status: "ok", db: dbConnected, modelsInitialized: !!Student, mongooseReadyState: readyState });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
      optimizeDeps: {
        include: []
      }
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