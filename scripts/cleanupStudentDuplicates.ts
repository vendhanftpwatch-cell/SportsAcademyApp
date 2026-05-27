import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vendhan:vendhan123@cluster0.irfa0ip.mongodb.net/?appName=Cluster0';

const studentSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Student = mongoose.model('Student', studentSchema);

const normalizeValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase();
};

const normalizePhone = (value: unknown) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[^\d]/g, '');
};

const getSignature = (doc: any) => {
  const name = normalizeValue(doc.name);
  const phone = normalizePhone(doc.phone);
  const parentName = normalizeValue(doc.parentName);
  const dob = normalizeValue(doc.dateOfBirth);
  return `${name}|${phone}|${parentName}|${dob}`;
};

const getScore = (doc: any) => {
  const enrolledTime = doc.dateEnrolled ? new Date(doc.dateEnrolled).getTime() : NaN;
  const joinedTime = doc.dateJoined ? new Date(doc.dateJoined).getTime() : NaN;
  if (!Number.isNaN(enrolledTime) && enrolledTime === joinedTime) return 100;
  if (Number.isNaN(enrolledTime) && Number.isNaN(joinedTime)) return 90;
  return 0;
};

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const students = await Student.find({}).lean();
    const groups = new Map<string, any[]>();

    students.forEach((student) => {
      const sig = getSignature(student);
      const group = groups.get(sig) || [];
      group.push(student);
      groups.set(sig, group);
    });

    const duplicateGroups = Array.from(groups.values()).filter((group) => group.length > 1);
    console.log(`Found ${duplicateGroups.length} duplicate group(s) among ${students.length} student records.`);

    let totalRemoved = 0;

    for (const group of duplicateGroups) {
      const sorted = group
        .map((doc) => ({ doc, score: getScore(doc) }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return String(a.doc._id).localeCompare(String(b.doc._id));
        });

      const keeper = sorted[0].doc;
      const toRemove = sorted.slice(1).map((item) => item.doc._id);
      if (toRemove.length > 0) {
        const result = await Student.deleteMany({ _id: { $in: toRemove } });
        totalRemoved += result.deletedCount ?? 0;
      }

      if (keeper.dateEnrolled && keeper.dateJoined) {
        await Student.updateOne({ _id: keeper._id }, { $set: { dateJoined: keeper.dateEnrolled } });
      }
    }

    console.log(`Removed ${totalRemoved} duplicate record(s).`);
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
})();
