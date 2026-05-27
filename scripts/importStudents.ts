import mongoose from 'mongoose';

type RawStudent = {
  studentName: string | null;
  sportsSelected: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  parentName: string | null;
  permanentAddress: string | null;
  contactNumber: string | null;
  enrollmentDate: string | null;
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vendhan:vendhan123@cluster0.irfa0ip.mongodb.net/?appName=Cluster0';

const studentSchema = new mongoose.Schema({
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
  parentName: { type: String },
  dateOfBirth: { type: String },
  dateEnrolled: { type: Date },
  dateJoined: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  sportsJoined: { type: [String], default: [] }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

const rawStudents: RawStudent[] = [
  {
    studentName: 'AADHYAA. H',
    sportsSelected: 'Archery',
    dateOfBirth: '05-01-2014',
    gender: 'Female',
    parentName: 'L. Rahini',
    permanentAddress: '310, Dharapuram Road, odc',
    contactNumber: '99947903292 / 9443040233',
    enrollmentDate: '1-5-2026'
  },
  {
    studentName: 'AGASTHI V.U',
    sportsSelected: 'Shuttle',
    dateOfBirth: '17.03.2020',
    gender: 'Female',
    parentName: 'Vijaya kumar, Uma maheshwari',
    permanentAddress: '13B, GG Nagar, Near Akshaya Play School, Dharapuram road, odc.',
    contactNumber: '94443400330',
    enrollmentDate: null
  },
  {
    studentName: 'A. Jeevith',
    sportsSelected: 'Football',
    dateOfBirth: '21.12.2017',
    gender: 'Female',
    parentName: 'P. அறிவு, A. கவிதா',
    permanentAddress: 'A.S. Tex, Palani Road, Oddanchatram.',
    contactNumber: '6374898050, 9731109945',
    enrollmentDate: '7/7/25'
  },
  {
    studentName: 'ARDHANA. H',
    sportsSelected: 'Archery',
    dateOfBirth: '10-8-2015',
    gender: 'Female',
    parentName: 'L. Rahini',
    permanentAddress: '310, Dharapuram Road, odc',
    contactNumber: '99947903292 / 9443040233',
    enrollmentDate: '1-5-2026'
  },
  {
    studentName: 'ASRITH PANDIAN',
    sportsSelected: 'Skating',
    dateOfBirth: '28-05-2022',
    gender: 'Male',
    parentName: 'Radhakrishnan',
    permanentAddress: 'Nalla Goundan Nagar, Oddanchatram',
    contactNumber: '9443929180',
    enrollmentDate: '18/4/2026'
  },
  {
    studentName: 'ATHERA SURYA',
    sportsSelected: 'Skating',
    dateOfBirth: '29/09/2020',
    gender: 'Female',
    parentName: 'SUKUMAR P SURYA',
    permanentAddress: '111S METTUPATTI, ODDANCHATRAM 624619',
    contactNumber: '8870797888',
    enrollmentDate: null
  },
  {
    studentName: 'BALA ADHITHYA. K',
    sportsSelected: 'Shuttle',
    dateOfBirth: '11-NOV-2010',
    gender: 'Male',
    parentName: 'Krishnasamy. S',
    permanentAddress: 'VRIKSHAM, 333, SN pettai odc',
    contactNumber: '8489934999, 8072447532',
    enrollmentDate: '27-6-25'
  },
  {
    studentName: 'C.V. ARNAV',
    sportsSelected: 'Skating',
    dateOfBirth: '23/03/2019',
    gender: 'M',
    parentName: 'Sankar. M',
    permanentAddress: null,
    contactNumber: '9487538180, 9994477038',
    enrollmentDate: '25/4/26'
  },
  {
    studentName: 'DARSHA. V',
    sportsSelected: 'Skating',
    dateOfBirth: '26/6/2017',
    gender: 'F',
    parentName: 'VADIVEL / INEYAA',
    permanentAddress: 'Surya Garden, oddanchatram',
    contactNumber: '8508745468',
    enrollmentDate: '27/4/2026'
  },
  {
    studentName: 'D. ATHIBAN',
    sportsSelected: 'Skating',
    dateOfBirth: '07/01/2017',
    gender: 'Male',
    parentName: 'K. Dhanabal, P. Renugadevi',
    permanentAddress: '423/9/8, PSM Pettai, Oddanchatram',
    contactNumber: '9894599937, 9488867887',
    enrollmentDate: null
  },
  {
    studentName: 'DHEIKSHA. V',
    sportsSelected: 'Shuttle',
    dateOfBirth: '23-06-2012',
    gender: 'F',
    parentName: 'VADIVEL',
    permanentAddress: 'Surya Gardens, oddanchatram',
    contactNumber: '8508745468',
    enrollmentDate: '27/4/2026'
  },
  {
    studentName: 'Dhakshan. K',
    sportsSelected: 'Silambam',
    dateOfBirth: '08-04-2020',
    gender: 'M',
    parentName: 'Hema',
    permanentAddress: 'Nagaram patti',
    contactNumber: '9944880876',
    enrollmentDate: '7/5/26'
  },
  {
    studentName: 'Dhanvand Krishna',
    sportsSelected: 'Archery',
    dateOfBirth: '21.07.21',
    gender: 'MALE',
    parentName: 'DHIVYA',
    permanentAddress: 'KOVIL THOTTAM, VATKAPALAM, VIRUPATCHI',
    contactNumber: '6381459103',
    enrollmentDate: '27.04.2026'
  },
  {
    studentName: 'D. VENBA',
    sportsSelected: 'Silambam',
    dateOfBirth: '17.04.2021',
    gender: 'Female',
    parentName: 'T. DHAMODARAN, J. HEMALATHA',
    permanentAddress: '28/1, PALANI GOUNDEN PUDHUR, ODDANCHATRAM',
    contactNumber: '7502249871',
    enrollmentDate: '1.05.2026'
  },
  {
    studentName: 'G. Mahathi Pandisri',
    sportsSelected: 'Archery',
    dateOfBirth: '29-03-2018',
    gender: 'F',
    parentName: 'T. Ganesh Babu',
    permanentAddress: 'B-19, Kurinji Nagar, oddanchatram',
    contactNumber: '9566672112',
    enrollmentDate: '11-4-26'
  },
  {
    studentName: 'IMAI MANIYAN',
    sportsSelected: 'Archery, Phonics Activities',
    dateOfBirth: '10-10-2020',
    gender: 'MALE',
    parentName: 'ARUNMANIYAN, SUVATHI',
    permanentAddress: 'Interlock Mesh Belt, 7/612 Koochikalpudur, Namakkal',
    contactNumber: '8883139139, 9187403403',
    enrollmentDate: '11/04/2025'
  },
  {
    studentName: 'INBHA AATHIRAN. S',
    sportsSelected: 'Skating',
    dateOfBirth: '04-July-2022',
    gender: 'Male',
    parentName: 'Sivasamy. K, Sonia. S',
    permanentAddress: 'Maruti nagar, Thummachapatty odc.',
    contactNumber: '9036659597, 9380596982',
    enrollmentDate: null
  },
  {
    studentName: 'Infaya',
    sportsSelected: 'Shuttle',
    dateOfBirth: null,
    gender: 'F',
    parentName: 'Rasmi Mohammed, oddanchatram',
    permanentAddress: null,
    contactNumber: '9843701784',
    enrollmentDate: '15-04-2026'
  },
  {
    studentName: 'J. CHAANAKYA GNANA PRAKASH',
    sportsSelected: 'Skating',
    dateOfBirth: '24.7.2019',
    gender: 'Male',
    parentName: 'T. Jothiraj',
    permanentAddress: 'Kasthuri Nagar (odc)',
    contactNumber: '6369188137',
    enrollmentDate: '13.06.25'
  },
  {
    studentName: 'Jadon Paul',
    sportsSelected: 'Skating',
    dateOfBirth: '23.02.2022',
    gender: null,
    parentName: 'M. Prasath',
    permanentAddress: 'Christian Fellowship hospital (odc)',
    contactNumber: '8870340523',
    enrollmentDate: '11/4/26'
  },
  {
    studentName: 'K.A. SANTHOSH AYYANAR',
    sportsSelected: 'Silambam',
    dateOfBirth: '18/12/2020',
    gender: 'M',
    parentName: 'ARUN KUMAR',
    permanentAddress: '216/ APP NAGAR, Oddanchatram',
    contactNumber: '8825504284 / 8098532184',
    enrollmentDate: null
  },
  {
    studentName: 'K. Kishor prasath',
    sportsSelected: 'Skating',
    dateOfBirth: '14/10/2013',
    gender: 'Male',
    parentName: 'S. Kalidass.',
    permanentAddress: 'Kudalingapuram, oddanchatram.',
    contactNumber: '9790810614',
    enrollmentDate: null
  },
  {
    studentName: 'K. RAKSHANA SRI',
    sportsSelected: 'Skating',
    dateOfBirth: '8.3.2019',
    gender: 'Female',
    parentName: 'Senbaga priya',
    permanentAddress: 'D/O 88 APP. Nagar, oddanchatram',
    contactNumber: '9629390261',
    enrollmentDate: null
  },
  {
    studentName: 'K. SRINITHI',
    sportsSelected: 'Skating',
    dateOfBirth: '29.05.2017',
    gender: 'Female',
    parentName: 'P. KALIMUTHU',
    permanentAddress: 'D/No: 46 PONNU CORPORATION BACKSIDE, ODDANCHATRAM',
    contactNumber: '9944948087',
    enrollmentDate: '13.06.2025'
  },
  {
    studentName: 'K. VISHNU',
    sportsSelected: null,
    dateOfBirth: '26-06-2018',
    gender: 'M',
    parentName: 'Karthik',
    permanentAddress: '112-APP- Nagar -odc',
    contactNumber: '9865797076',
    enrollmentDate: '11-07-2025'
  },
  {
    studentName: 'K. VIKRANTH',
    sportsSelected: 'Skating, Archery',
    dateOfBirth: '10.05.2021',
    gender: 'MALE',
    parentName: 'M. KARTHIGAI PRIYA',
    permanentAddress: '423C, ASM PETTAI, ODDANCHATRAM',
    contactNumber: '7904687525, 7994823579',
    enrollmentDate: '1.05.2026'
  },
  {
    studentName: 'K.R. DEV',
    sportsSelected: 'Shuttle',
    dateOfBirth: '28-11-2018',
    gender: 'Male',
    parentName: 'k. Ranga durai',
    permanentAddress: '2/150, Periyakaraipatti, oddanchatram',
    contactNumber: '9788332294',
    enrollmentDate: '30-6-25'
  },
  {
    studentName: 'KAYAL. P',
    sportsSelected: 'Archery',
    dateOfBirth: null,
    gender: 'F',
    parentName: 'Muthu tamil selvi',
    permanentAddress: null,
    contactNumber: '9538210428',
    enrollmentDate: null
  },
  {
    studentName: 'LITHISH ADHAV',
    sportsSelected: 'Skating',
    dateOfBirth: '28-08-2021',
    gender: 'MALE',
    parentName: 'ABINAYA SABARINATH',
    permanentAddress: '2/366B, K.S. THOTTAM, THANGACHIAMMAPATTY, ODC',
    contactNumber: '9042299090',
    enrollmentDate: '11/04/2026'
  },
  {
    studentName: 'MAYA SURYA',
    sportsSelected: 'Skating',
    dateOfBirth: '07/03/2017',
    gender: 'Female',
    permanentAddress: '111S METTUPATTI, ODDANCHATRAM 624619',
    parentName: 'SUKUMAR P SURYA',
    contactNumber: '8870797888',
    enrollmentDate: null
  },
  {
    studentName: 'M. ASHWIN',
    sportsSelected: 'Archery',
    dateOfBirth: '02.03.2017',
    gender: 'MALE',
    parentName: 'Mahesh kumar. M',
    permanentAddress: '8m/10, Burma saw mill OPP, Dharapuram road oddanchatram',
    contactNumber: '9789456641',
    enrollmentDate: '11.04.26'
  },
  {
    studentName: 'M. KUNGUMA DHEESHITHAN',
    sportsSelected: 'Skating',
    dateOfBirth: '13-07-2021',
    gender: 'Male',
    parentName: 'S. MANIKANDAN',
    permanentAddress: '97/14, NEW KOOTAI MEEDU ST, DHARAPURAM',
    contactNumber: '9659642154, 7010970108',
    enrollmentDate: '20/04/2026'
  },
  {
    studentName: 'M. MUGIL VARUN. V',
    sportsSelected: null,
    dateOfBirth: '09-05-2021',
    gender: 'Male',
    parentName: 'S. VINOTH KUMAR',
    permanentAddress: '297-14, KARUPPANNAN STREET, Thumpichampatti',
    contactNumber: '9843696987, 9629277665',
    enrollmentDate: '25/04/26'
  },
  {
    studentName: 'M. PARSHITH BALAJI',
    sportsSelected: 'Chess',
    dateOfBirth: '6.8.2016',
    gender: 'Male',
    parentName: 'G. Muthupandi, G. Sivaranjani',
    permanentAddress: '477E-18-1, Aruna theater backside, Nallakovundan nagar',
    contactNumber: '8903190936',
    enrollmentDate: '2.5.2026'
  },
  {
    studentName: 'M. THARAVANANTH',
    sportsSelected: null,
    dateOfBirth: '17.2.2017',
    gender: null,
    parentName: 'P. THARAVANANTH',
    permanentAddress: 'odc.',
    contactNumber: '9965848540',
    enrollmentDate: '3-5-26'
  },
  {
    studentName: 'M. Vaishnavi',
    sportsSelected: 'Shuttle',
    dateOfBirth: '14-12-2016',
    gender: 'F',
    parentName: 'S. Manoj',
    permanentAddress: '186B Aruna theater back side, oddanchatram',
    contactNumber: '7373730088',
    enrollmentDate: '14-4-26'
  },
  {
    studentName: 'M. YAAZHINI SHREE',
    sportsSelected: 'Shuttle',
    dateOfBirth: '30.09.2014',
    gender: 'FEMALE',
    parentName: 'A. MANIKANDAN',
    permanentAddress: 'Kasthuri Nagar, oddanchatram',
    contactNumber: '9894874241',
    enrollmentDate: null
  },
  {
    studentName: 'M. YAZHINBAN',
    sportsSelected: 'Skating',
    dateOfBirth: '27.11.2019',
    gender: 'MALE',
    parentName: 'Mahesh kumar. M',
    permanentAddress: '8m/10, Burma saw mill OPP, Dharapuram road oddanchatram',
    contactNumber: '9789456641',
    enrollmentDate: '11.04.26'
  },
  {
    studentName: 'Mithun Mithran',
    sportsSelected: 'Fitness',
    dateOfBirth: '30.1.2013',
    gender: 'Male',
    parentName: 'Sri Vidya, Naresh Kumar',
    permanentAddress: '220. Kurungi nagar, iswarya garden',
    contactNumber: '9942517007',
    enrollmentDate: null
  },
  {
    studentName: 'N. Sanjeev',
    sportsSelected: 'Skating',
    dateOfBirth: '15.3.2019',
    gender: null,
    parentName: 'N. Shanthi',
    permanentAddress: '3/4, kuttiyagunda puthur, I. Vattipatti, ottanchantharam.',
    contactNumber: '8870277093',
    enrollmentDate: '18.4.2026'
  },
  {
    studentName: 'Nandha kumaran.S',
    sportsSelected: 'Football',
    dateOfBirth: '6/10/2016',
    gender: 'Male',
    parentName: 'Sivasubramaniyam & Vidhya',
    permanentAddress: 'APP Nagar, Oddanchatram',
    contactNumber: '7639525355, 8072788164',
    enrollmentDate: '15/7/2025'
  },
  {
    studentName: 'P. AADHIRA',
    sportsSelected: null,
    dateOfBirth: '29/04/2022',
    gender: 'Female',
    parentName: 'Priyanka',
    permanentAddress: '2/498 c, Sengattu street, Thangachiammapatti',
    contactNumber: '9566497802',
    enrollmentDate: null
  },
  {
    studentName: 'P. Jitesh kiruthik',
    sportsSelected: 'Skating, Shuttle',
    dateOfBirth: '15.09.2013',
    gender: 'M',
    parentName: 'K. Parthiban',
    permanentAddress: '255-C-1-J/q, Madhu Asmi Nivas, By pass Road, Oddanchatram',
    contactNumber: '95666 59124',
    enrollmentDate: '30.4.2026'
  },
  {
    studentName: 'P. MITRAN',
    sportsSelected: 'Archery',
    dateOfBirth: null,
    gender: 'M.',
    parentName: 'muthu tamil selvi',
    permanentAddress: null,
    contactNumber: '9538210428',
    enrollmentDate: null
  },
  {
    studentName: 'P. NAVVANTH',
    sportsSelected: 'Silambam',
    dateOfBirth: '04-12-2019',
    gender: 'Male',
    parentName: 'K. Ponnagulan, P. Kavitha',
    permanentAddress: 'E-15 Kurinji nagar, Nadar store back, Oddanchatram',
    contactNumber: '7845917290, 8489404170',
    enrollmentDate: null
  },
  {
    studentName: 'P. PON SHIVANI',
    sportsSelected: 'Skating',
    dateOfBirth: '4.01.2020',
    gender: 'FEMALE',
    parentName: 'K. PAVITHRAN, P. PRIVA',
    permanentAddress: 'THUMBACHIPATTI PUDHUR, KASTHURI NAGAR, ODDANCHTHRAM',
    contactNumber: '9629270361, 9025924634',
    enrollmentDate: '30.10.2025'
  },
  {
    studentName: 'P. SRI NAGA SOUNDRAVALLI',
    sportsSelected: null,
    dateOfBirth: '01.04.2016',
    gender: 'Female',
    parentName: 'R. PONRAJ (Father)',
    permanentAddress: '29 A1 KARUPPIMADAM, SRIRAMAPURAM',
    contactNumber: '6382879184',
    enrollmentDate: '17/04/2026'
  },
  {
    studentName: 'P. SABARIRAJ',
    sportsSelected: 'Shuttle',
    dateOfBirth: '27/4/2011',
    gender: 'Male',
    parentName: 'R. Pasupathi',
    permanentAddress: '254, Varthanagar, Thumichampatti, oddanchatram-624619',
    contactNumber: '9787035760, 9786138285',
    enrollmentDate: null
  },
  {
    studentName: 'Pranith. A',
    sportsSelected: 'Skating',
    dateOfBirth: null,
    gender: 'M.',
    parentName: 'Ayyappan',
    permanentAddress: null,
    contactNumber: '9894620021',
    enrollmentDate: '28-4-2026'
  },
  {
    studentName: 'Pramoy Sastha',
    sportsSelected: 'Archery, Skating',
    dateOfBirth: '18-Oct-2017',
    gender: 'Male',
    parentName: 'MANIKANDAN',
    permanentAddress: null,
    contactNumber: '9952156312, 9487762679',
    enrollmentDate: '21-4-26'
  },
  {
    studentName: 'R. CITHESH',
    sportsSelected: 'Silambam',
    dateOfBirth: '8/10/14',
    gender: 'M',
    parentName: 'Ravi',
    permanentAddress: 'Bank of India',
    contactNumber: '7904550189/9789216621',
    enrollmentDate: '1/5/2026'
  },
  {
    studentName: 'R. Cithesh',
    sportsSelected: 'Silambam',
    dateOfBirth: '8/10/14',
    gender: 'M',
    parentName: 'Ravi',
    permanentAddress: 'Bank of India',
    contactNumber: '7904550189/9789216621',
    enrollmentDate: '1/5/2026'
  },
  {
    studentName: 'R. Nikirthan',
    sportsSelected: 'Shuttle',
    dateOfBirth: '15.5.2014',
    gender: 'M',
    parentName: 'P. Raja',
    permanentAddress: 'Aar',
    contactNumber: '7904589665',
    enrollmentDate: null
  },
  {
    studentName: 'R. Nowdeepak',
    sportsSelected: 'Shuttle',
    dateOfBirth: '26.09.2011',
    gender: 'Male',
    parentName: 'V. Ravikumar',
    permanentAddress: '3/308, Anna Nagar check post, odc',
    contactNumber: '9487676460, 9486111153',
    enrollmentDate: null
  },
  {
    studentName: 'R. RASHMITHA VARMA',
    sportsSelected: 'Archery, Skating, Silambam',
    dateOfBirth: '02/04/2020',
    gender: 'Female',
    parentName: 'Rajavarma. V, Saranya Rajavarma. K',
    permanentAddress: '39-B, APP Nagar, opp veterinary hospital, oddanchatram',
    contactNumber: '9942423443',
    enrollmentDate: '20/4/26'
  },
  {
    studentName: 'R. SANJITH VARMA',
    sportsSelected: 'Shuttle',
    dateOfBirth: '03/07/2014',
    gender: 'Male',
    parentName: 'Rajavarma, Saranya Rajavarma',
    permanentAddress: '39/B, A.P.P Nagar, opp veterinary hospital, oddanchatram',
    contactNumber: '9942423443',
    enrollmentDate: '20/4/26'
  },
  {
    studentName: 'R. SAI YUGAN',
    sportsSelected: 'Skating',
    dateOfBirth: '03/10/2020',
    gender: 'M',
    parentName: 'T. RAMAMOORTHY',
    permanentAddress: 'A.P.B NAGAR',
    contactNumber: '9715431161',
    enrollmentDate: null
  },
  {
    studentName: 'R. SELVAMITHRAN',
    sportsSelected: 'Skating',
    dateOfBirth: '20-NOV-2020',
    gender: 'Male',
    parentName: 'M. Rathinasamy, K. vidya',
    permanentAddress: '957/2, suraikkaipatty, vadagadu-624619',
    contactNumber: '9080196856, 9884354142',
    enrollmentDate: '13.06.2025'
  },
  {
    studentName: 'R. SIDDHARTH',
    sportsSelected: 'Shuttle',
    dateOfBirth: '17-9-2013',
    gender: 'Male',
    parentName: 'K. Ranga durai',
    permanentAddress: '2/150, Periyakaraipatty, oddanchatram',
    contactNumber: '9788332294',
    enrollmentDate: '30-6-25'
  },
  {
    studentName: 'S.P. RIYAN',
    sportsSelected: 'Skating',
    dateOfBirth: '03.12.2020',
    gender: 'Male',
    parentName: 'SARAN, PRIYA',
    permanentAddress: 'The Ivy Den, Hope College',
    contactNumber: '9709709956',
    enrollmentDate: '18.04.26'
  },
  {
    studentName: 'S.PRIYADHARSHINI',
    sportsSelected: 'Skating',
    dateOfBirth: '19.03.2014',
    gender: 'FEMALE',
    parentName: 'K.SELVARAJ, S.SUDHA',
    permanentAddress: 'THUMBACHIPATTI PUDHUR, KASTHURI NAGAR, ODDACHITHRAM',
    contactNumber: '8217514241, 8072494794',
    enrollmentDate: '30.10.2025'
  },
  {
    studentName: 'S. AKIL RISWANTH',
    sportsSelected: null,
    dateOfBirth: '13/11/2017',
    gender: 'Male',
    parentName: 'A Sivakumar',
    permanentAddress: '308/9, SAP Illam, Oddanchatram',
    contactNumber: '9865859965',
    enrollmentDate: null
  },
  {
    studentName: 'S. R SAKTIDHARAN',
    sportsSelected: 'Silambam',
    dateOfBirth: '20.08.20',
    gender: 'Male',
    parentName: 'K. Saravanakumar',
    permanentAddress: '117/15, A.P.P. nagar, odc',
    contactNumber: '9489048082',
    enrollmentDate: '2/2/26'
  },
  {
    studentName: 'S. SAKTIDHARAN',
    sportsSelected: 'Silambam',
    dateOfBirth: '20.08.20',
    gender: 'Male',
    parentName: 'K. Saravanakumar',
    permanentAddress: '117/15, A.P.P. nagar, odc',
    contactNumber: '9489048082',
    enrollmentDate: '2/2/26'
  },
  {
    studentName: 'S. VARUN ADITYA',
    sportsSelected: 'Archery, Aerobics',
    dateOfBirth: '08/10/2020',
    gender: null,
    parentName: 'P. Soundra Pandian',
    permanentAddress: 'Naganam Patti, oddanchatram',
    contactNumber: '9940944323',
    enrollmentDate: null
  },
  {
    studentName: 'S. Yugadhana',
    sportsSelected: 'Silambam',
    dateOfBirth: '01.04.21',
    gender: 'Female',
    parentName: 'K. Suresh kumar, M. Poovizhi',
    permanentAddress: 'G.H (OPP)',
    contactNumber: '9025622408',
    enrollmentDate: '02.02.26'
  },
  {
    studentName: 'S.R. SASHWIN',
    sportsSelected: 'Skating',
    dateOfBirth: '15.09.2016',
    gender: 'Male',
    parentName: 'S. Ranjitha',
    permanentAddress: 'APP nagar',
    contactNumber: '8838584391',
    enrollmentDate: '13.06.2025'
  },
  {
    studentName: 'Saivith. R',
    sportsSelected: 'Silambam',
    dateOfBirth: '15-1-17',
    gender: 'F',
    parentName: 'Ramkumar',
    permanentAddress: 'Nagaram patti',
    contactNumber: '9944880876',
    enrollmentDate: '7/5/26'
  },
  {
    studentName: 'Samrakshan',
    sportsSelected: 'Archery',
    dateOfBirth: null,
    gender: 'Male',
    parentName: 'Sathesh & Shoola',
    permanentAddress: null,
    contactNumber: null,
    enrollmentDate: null
  },
  {
    studentName: 'SHASTIK PRAVIN',
    sportsSelected: 'Skating',
    dateOfBirth: '15-07-2021',
    gender: 'Male',
    parentName: 'M. PRAVIN KUMAR',
    permanentAddress: '1/6 ELLAI PATTI, PUNCHATRAM (PO) DINDIGUL-TK',
    contactNumber: '9941448140',
    enrollmentDate: '11-04-2026'
  },
  {
    studentName: 'SKANDA RAAYAN',
    sportsSelected: 'Skating',
    dateOfBirth: '18-09-2022',
    gender: 'MALE',
    parentName: 'MANJUNATH',
    permanentAddress: 'ODDANCHATRAM',
    contactNumber: '9360801177',
    enrollmentDate: '01/05/2026'
  },
  {
    studentName: 'S.K. hariganth',
    sportsSelected: 'Shuttle',
    dateOfBirth: '12.11.2014',
    gender: 'Male',
    parentName: 'Sivaganesh kumar',
    permanentAddress: 'Thiruvalluvar salai oddanchatram.',
    contactNumber: '9159054175',
    enrollmentDate: null
  },
  {
    studentName: 'T. IRA',
    sportsSelected: 'Archery',
    dateOfBirth: '4.10.2018',
    gender: 'F',
    parentName: 'Lavanya. S',
    permanentAddress: 'oddanchatram, siva complex',
    contactNumber: '8075752433',
    enrollmentDate: '11-4-2026'
  },
  {
    studentName: 'T. MITHULA',
    sportsSelected: 'Silambam',
    dateOfBirth: '28.08.2019',
    gender: 'FEMALE',
    parentName: 'R. JAGATHEESH, J. SINDU',
    permanentAddress: '5/532, R.S. NAGAR, BUDS SCHOOL (BACKSIDE)',
    contactNumber: '9500398125',
    enrollmentDate: '1.5.2026'
  },
  {
    studentName: 'VIDHUMITHRAN. I',
    sportsSelected: 'Shuttle',
    dateOfBirth: '30.12.2013',
    gender: 'Male',
    parentName: 'Ilango. V',
    permanentAddress: '2/34B, Veeramuthu Salai, C.K. Valasu',
    contactNumber: '9894590588',
    enrollmentDate: '02/07/2025'
  },
  {
    studentName: 'VIHAA SABARINATH',
    sportsSelected: 'Skating, Shuttle',
    dateOfBirth: '17-08-2017',
    gender: 'FEMALE',
    parentName: 'ABINAYA SABARINATH',
    permanentAddress: '2/366B, K.S. THOTTAM, THANGACHIAMMAPATTY, ODC',
    contactNumber: '9042299090',
    enrollmentDate: '12/4/26'
  },
  {
    studentName: 'YUGANILAN S',
    sportsSelected: 'Skating',
    dateOfBirth: '7.4.22',
    gender: 'male',
    parentName: 'Selvaraj',
    permanentAddress: "Teacher's colony backside, K. Atruicombai",
    contactNumber: '9442882392, 9488242618',
    enrollmentDate: '1.5.26'
  }
];

const normalizeName = (value: string | null) => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
};

const normalizePhone = (value: string | null) => {
  if (!value) return '';
  return value.replace(/[^\d]/g, '');
};

const normalizeParent = (value: string | null) => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
};

const normalizeDateString = (value: string | null) => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ');
};

const parseDate = (value: string | null): Date | null => {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;

  const monthNames: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  const normalized = raw.replace(/\s+/g, '').replace(/\./g, '-').replace(/\//g, '-').toLowerCase();

  const monthNameMatch = normalized.match(/^(\d{1,2})-([a-z]+)-(\d{2,4})$/i);
  if (monthNameMatch) {
    const day = Number(monthNameMatch[1]);
    const monthKey = monthNameMatch[2].slice(0, 3);
    const year = Number(monthNameMatch[3].length === 2 ? `20${monthNameMatch[3]}` : monthNameMatch[3]);
    if (!Number.isNaN(day) && monthNames[monthKey] !== undefined && !Number.isNaN(year)) {
      return new Date(Date.UTC(year, monthNames[monthKey], day));
    }
  }

  const parts = normalized.split('-');
  if (parts.length === 3) {
    const [p1, p2, p3] = parts;
    const day = Number(p1);
    const month = Number(p2) - 1;
    let year = Number(p3);
    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
      if (p3.length === 2) {
        year = 2000 + year;
      }
      return new Date(Date.UTC(year, month, day));
    }
  }

  const fallback = new Date(raw);
  return Number.isNaN(fallback.getTime()) ? null : new Date(Date.UTC(fallback.getFullYear(), fallback.getMonth(), fallback.getDate()));
};

const normalizeSports = (value: string | null) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const createSignature = (student: { name: string; phone: string; parentName: string; dateOfBirth: string }) => {
  const name = normalizeName(student.name);
  const phone = normalizePhone(student.phone);
  const parentName = normalizeParent(student.parentName);
  const dob = normalizeDateString(student.dateOfBirth);
  return `${name}|${phone}|${parentName}|${dob}`;
};

const buildStudentDocument = (raw: RawStudent) => {
  const name = raw.studentName?.trim() || 'Unknown';
  const dateEnrolled = parseDate(raw.enrollmentDate);
  const doc: Record<string, unknown> = {
    name,
    gender: raw.gender?.trim() || undefined,
    phone: raw.contactNumber?.trim() || '',
    address: raw.permanentAddress?.trim() || undefined,
    parentName: raw.parentName?.trim() || '',
    dateOfBirth: raw.dateOfBirth?.trim() || '',
    sportsJoined: normalizeSports(raw.sportsSelected),
    active: true
  };

  if (dateEnrolled) {
    doc.dateEnrolled = dateEnrolled;
  }

  return doc;
};

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingStudents = await Student.find({}, { name: 1, phone: 1, parentName: 1, dateOfBirth: 1 }).lean();
    const existingSignatures = new Set(existingStudents.map((s: any) => createSignature({
      name: s.name,
      phone: s.phone || '',
      parentName: s.parentName || '',
      dateOfBirth: s.dateOfBirth || ''
    })));
    const seenSignatures = new Set<string>();

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const raw of rawStudents) {
      const doc = buildStudentDocument(raw);
      const signature = createSignature({
        name: doc.name as string,
        phone: doc.phone as string || '',
        parentName: doc.parentName as string || '',
        dateOfBirth: raw.dateOfBirth?.trim() || ''
      });

      if (seenSignatures.has(signature)) {
        skippedCount += 1;
        continue;
      }
      seenSignatures.add(signature);

      const query = {
        name: doc.name,
        parentName: doc.parentName || '',
        phone: doc.phone || '',
        dateOfBirth: raw.dateOfBirth?.trim() || ''
      };

      const update: any = { $set: doc };
      if (!doc.dateEnrolled) {
        update.$unset = { dateEnrolled: '' };
      }

      const result = await Student.updateOne(query, update, { upsert: true });
      if (result.upsertedCount === 1) {
        insertedCount += 1;
      } else if (result.modifiedCount === 1) {
        updatedCount += 1;
      }
    }

    if (insertedCount > 0) {
      console.log(`Inserted ${insertedCount} new student records.`);
    }
    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} existing student records.`);
    }
    if (skippedCount > 0) {
      console.log(`Skipped ${skippedCount} duplicate source record(s).`);
    }
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

main();
