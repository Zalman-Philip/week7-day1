type StatusOptions = "scheduled" | "complete" | "cancelled";
abstract class Person {
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  constructor(
    firstName: string,
    lastName: string,
    age: number,
    address: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.address = address;
  }
}

class Patient extends Person {
  #patientID: string;
  phoneNumber: string;
  emergencyContact: string;
  medicalHistory: Array<Appointment>;
  constructor(
    firstName: string,
    lastName: string,
    patientID: string,
    age: number,
    address: string,
    phoneNumber: string,
    emergencyContact: string,
    medicalHistory: Array<Appointment>
  ) {
    super(firstName, lastName, age, address);
    this.#patientID = patientID;
    this.phoneNumber = phoneNumber;
    this.emergencyContact = emergencyContact;
    this.medicalHistory = medicalHistory;
  }
  info() {
    return `${this.firstName} ${this.lastName}`;
  }
  getID() {
    return this.#patientID;
  }
  addMedicalHistory(appointment: Appointment) {
    this.medicalHistory.push(appointment);
  }
}

class MedicalStaff extends Person {
  staffID: string;
  position: string;
  department: string;
  constructor(
    staffID: string,
    position: string,
    department: string,
    firstName: string,
    lastName: string,
    age: number,
    address: string
  ) {
    super(firstName, lastName, age, address);
    this.staffID = staffID;
    this.position = position;
    this.department = department;
  }
}

class Doctor extends MedicalStaff {
  specialization: string;
  #doctorID: string;
  availability: { [key: string]:  false|{ [key: string]: boolean } };
  range: { min: number; max: number };
  constructor(
    firstName: string,
    lastName: string,
    specialization: string,
    doctorID: string,
    age: number,
    address: string,
    availability: { [key: string]: false|{ [key: string]: boolean } },
    staffID: string,
    position: string,
    department: string,
    range: { min: number; max: number }
  ) {
    super(staffID, position, department, firstName, lastName, age, address);
    this.specialization = specialization;
    this.#doctorID = doctorID;
    this.availability = availability;
    this.range = range;
  }
  info() {
    return `${this.firstName} ${this.lastName} ${this.specialization}`;
  }
  getID() {
    return this.#doctorID;
  }
}

class Appointment {
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  status: StatusOptions;
  constructor(
    patient: Patient,
    doctor: Doctor,
    date: string,
    time: string,
    status: StatusOptions
  ) {
    this.patient = patient;
    this.doctor = doctor;
    this.date = date;
    this.time = time;
    this.status = status;
  }
  AppointmentInfo() {
    return `patient ${this.patient.info()} has an appointment on ${this.date} ${
      this.time
    } with Doctor ${this.doctor.info()}`;
  }
  setStatus(status: StatusOptions) {
    this.status = status;
  }
}

class MedicalRecord {
  patient: Patient;
  doctor: Doctor;
  diagnosis: string;
  prescription: string;

  constructor(
    patient: Patient,
    doctor: Doctor,
    diagnosis: string,
    prescription: string
  ) {
    this.patient = patient;
    this.doctor = doctor;
    this.diagnosis = diagnosis;
    this.prescription = prescription;
  }
}

class Hospital {
  name: string;
  doctors: Array<Doctor>;
  patients: Array<Patient>;
  appointments: Array<Appointment>;
  medicalRecord: Array<MedicalRecord>;
  constructor(
    name: string,
    doctors: Array<Doctor>,
    patients: Array<Patient>,
    appointments: Array<Appointment>,
    medicalRecord: Array<MedicalRecord>
  ) {
    this.name = name;
    this.doctors = doctors;
    this.patients = patients;
    this.appointments = appointments;
    this.medicalRecord = medicalRecord;
  }
  addPatient(patient: Patient) {
    this.patients.push(patient);
    return this;
  }

  addDoctor(doctor: Doctor) {
    this.doctors.push(doctor);
    return this;
  }
  logAllAppointments() {
    this.appointments.forEach((appointment) =>
      console.log(appointment.AppointmentInfo())
    );
  }
  logAppointmentsByDoctorID(id: string) {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.doctor.getID() === id
    );
    filteredAppointments.forEach((appointment) =>
      console.log(appointment.AppointmentInfo())
    );
  }

  logAppointmentsByPatientID(id: string) {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.patient.getID() === id
    );
    filteredAppointments.forEach((appointment) =>
      console.log(appointment.AppointmentInfo())
    );
  }

  logAppointmentsByDate(date: string) {
    const filteredAppointments = this.appointments.filter(
      (appointment) => appointment.date === date
    );
    filteredAppointments.forEach((appointment) =>
      console.log(appointment.AppointmentInfo())
    );
  }
  getDoctorBySpecialty(specialty: string) {
    return this.doctors.find((doctor) => doctor.specialization === specialty);
  }
  createMedicalRecord(medicalRecord: MedicalRecord) {
    this.medicalRecord.push(medicalRecord);
  }
  getMedicalRecords(patientID: string) {
    return this.medicalRecord.filter(
      (record) => record.patient.getID() === patientID
    );
  }
  getDoctorSchedule(doctorID: string, date: string) {
    const doctor = this.doctors.find((doctor) => doctor.getID() === doctorID);
    if (!doctor) return;
    const day = doctor.availability[date];
    if (!day) return;
    const arr = Object.keys(day);
    const available = arr.filter((key) => day[key] === false);
    return available;
  }
  getDoctorAvailability(doctorID: string, date: string) {
    const doctor = this.doctors.find((doctor) => doctor.getID() === doctorID);
    if (!doctor) return;
    const day = doctor.availability[date];
    if (!day) return;
    const arr = Object.keys(day);
    const available = arr.filter((key) => day[key] === true);
    return available;
  }
  addAppointment(appointment: Appointment) {
    const { date, time } = appointment;
    const doctorID = appointment.doctor.getID();
    const doctor = this.doctors.find((doctor) => doctor.getID() === doctorID);
    if (!doctor) return;
    const day = doctor.availability[date];
    if (!day||!day[time]||appointment.patient.age > doctor.range.max ||
        appointment.patient.age < doctor.range.min) return;
      this.appointments.push(appointment);
      day[time] = false
  }
}

const doctor1 = new Doctor(
  "David",
  "Salomon",
  "Surgeon",
  "dfg%%%^",
  35,
  "123 Main St",
  {
    "08/30/2023": {
      "09:00": true,
      "10:00": false,
      "11:00": true,
    },
    "08/31/2023": {
      "09:00": true,
      "10:00": true,
      "11:00": true,
    },
  },
  "staff123",
  "Senior Surgeon",
  "Surgery Department",
  { min: 15, max: 30 }
);

const doctor2 = new Doctor(
  "Sarah",
  "Johnson",
  "Pediatrician",
  "abc123",
  40,
  "456 Elm St",
  {
    "08/30/2023": {
      "09:00": true,
      "10:00": true,
      "11:00": false,
    },
    "08/31/2023": {
      "09:00": false,
      "10:00": true,
      "11:00": true,
    },
  },
  "staff456",
  "Pediatric Department",
  "Pediatrics",
  { min: 20, max: 35 }
);

const doctor3 = new Doctor(
  "Michael",
  "Smith",
  "Cardiologist",
  "xyz789",
  45,
  "789 Oak St",
  {
    "08/30/2023": {
      "09:00": false,
      "10:00": true,
      "11:00": true,
    },
    "08/31/2023": {
      "09:00": true,
      "10:00": true,
      "11:00": true,
    },
  },
  "staff789",
  "Cardiology Department",
  "Cardiology",
  { min: 25, max: 40 }
);
const patient1 = new Patient(
  "Alice",
  "Johnson",
  "p12345",
  28,
  "123 Elm St",
  "555-1234",
  "555-5678",
  []
);

const patient2 = new Patient(
  "Bob",
  "Smith",
  "p67890",
  35,
  "456 Oak St",
  "555-5678",
  "555-9012",
  []
);

const patient3 = new Patient(
  "Eva",
  "Williams",
  "p23456",
  34,
  "789 Maple St",
  "555-7890",
  "555-1234",
  []
);

const patients = [patient1, patient2, patient3];
const doctors = [doctor1, doctor2, doctor3];
const appointment1 = new Appointment(
  patient1,
  doctor1,
  "23/05/2023",
  "14:30",
  "scheduled"
);
const appointment2 = new Appointment(
  patient2,
  doctor2,
  "23/05/2023",
  "09:34",
  "cancelled"
);
const appointment3 = new Appointment(
  patient3,
  doctor3,
  "07/08/2023",
  "17:55",
  "scheduled"
);
const appointments = [appointment1, appointment2, appointment3];

const hospital = new Hospital("Hospital1", doctors, patients, appointments, []);
const appointment4 = new Appointment(
  patient3,
  doctor2,
  "08/30/2023",
  "11:00",
  "scheduled"
);

const result = hospital.addAppointment(appointment4);

hospital.logAllAppointments();
hospital.logAppointmentsByDate("23/05/2023");
hospital.logAppointmentsByDoctorID("dfg%%%^");
hospital.logAppointmentsByPatientID("p67890");
console.log("in app");
console.log(result);
