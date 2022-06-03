export interface AppointmentReminder {
    isDeleted: boolean;
    _id: string;
    date: string;
    other: string;
    patientId: string;
    addedBy: string;
    // appointmentId: AppointmentId;
    createdAt: string;
    updatedAt: string;
    __v: number;

    dose: string;
    vaccineCenterId: VaccineCenterId;
  }
  interface VaccineCenterId {
    _id: string;
    pharmacyName: string;
  }
  interface AppointmentId {
    _id: string;
    scheduleDate: string;
    scheduleTime: string;
  }