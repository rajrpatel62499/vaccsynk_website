export interface Dose {
    clinicInfo: ClinicInfo;
    isActive: boolean;
    isDeleted: boolean;
    _id: string;
    doseNumber: string;
    patientId: PatientId;
    administrationDate: string;
    vaccine: string;
    VISDate: string;
    manufacturer: string;
    volume: string;
    lot: string;
    expDate: string;
    route: string;
    site: string;
    patientTemp: string;
    administrationName: string;
    administrationSignature: string;
    patientNumber: string;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface PatientId {
    _id: string;
    name: string;
    birthdate?: string;
    patientNumber: string;
  }
  
  interface ClinicInfo {
    clinicId: string;
    name: string;
    telephone: string;
    storeNumber: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }