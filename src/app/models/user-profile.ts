export interface UserProfile {
    _id: string;
    facilityId?: string;

    name: string;
    email: string;
    mobile: string;
    address: string;
    gender: string;
    birthdate: string;
    pharmacyName: string;
    city: string;
    state: string;
    zip: string;
    faxNo: string;
    // NCPDPNo: string;
    NPINo: string;
    pharmacistName: string;
    pharmacistEmail: string;
    pharmacistNpiNumber: string;
    patientNumber:string;
  }
  
  interface Timings {
    Monday: Monday;
    Tuesday: Monday;
    Wednesday: Monday;
    Thursday: Monday;
    Friday: Monday;
    Saturday: Monday;
    Sunday: Monday;
  }
  
  interface Monday {
    maxDose: number;
    open: string;
    close: string;
  }