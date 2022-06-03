export interface Appointment {
  nextOfKin: NextOfKin;
  patientInfo: PatientInfo;
  prescriptionInsurance: PrescriptionInsurance;
  medicareFields: MedicareFields;
  medicalIns: MedicalIns;
  uninsured: Uninsured;
  potentialContradiction: PotentialContradiction;
  potentialConsiderationFirst: PotentialConsiderationFirst;
  potentialConsiderationSecond: PotentialConsiderationSecond;
  requestType: string;
  insCardFront: string;
  insCardBack: string;
  govIssuedId: string;
  signature: string;
  isDeleted: boolean;
  _id: string;
  lastname: string;
  firstname: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  PCPname: string;
  PCPmobile: string;
  PCPfaxnumber: string;
  PCPaddress: string;
  PCPcity: string;
  PCPstate: string;
  PCPzip: string;
  race: string;
  ethnicity: string;
  registrySharingIndicator: string;
  insType: string;
  vaccineCenterId: VaccineCenterId;
  scheduleDate: string;
  scheduleTime: string;
  addedBy: string;
  dose: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VaccineCenterId {
  timings: Timings;
  _id: string;
  pharmacyName: string;
  address: string;
  state: string;
  city: string;
  zip: string;
}

export interface Timings {
  Monday: DayInfo;
  Tuesday: DayInfo;
  Wednesday: DayInfo;
  Thursday: DayInfo;
  Friday: DayInfo;
  Saturday: DayInfo;
  Sunday: DayInfo;
}
export interface DayInfo {
  maxDose: number;
  open: string;
  close: string;
}

interface PotentialConsiderationSecond {
  date: string;
  nameOfParent: string;
  mobile: string;
  relationship: string;
}

interface PotentialConsiderationFirst {
  haveBleedingDisorder: string;
  haveWeekImmuneSystem: string;
  isPregOrBreastfeeding: string;
}

interface PotentialContradiction {
  sick: string;
  receivedDose: string;
  vaccineCompany: string;
  hadSevereAllergy: string;
  hadAllergyAfterDose: string;
  hadAllergyAfterOtherDoseOrInjectable: string;
  hadAllergyRelatedToPolyGlycol: string;
  receivedDoseIn14Days: string;
  receivedAntibodies: string;
}

interface Uninsured {
  isUninsured?: any;
  socialSecurityNumber?: any;
  stateIdNumber?: any;
  driverLicenseNumber?: any;
}

interface MedicalIns {
  isPrimaryCardholder: string;
  dob?: any;
  medicalInsProvider: string;
  groupId: string;
  payerId?: any;
}

interface MedicareFields {
  patientAgeAbove65?: any;
  mbi?: any;
}

interface PrescriptionInsurance {
  isPrimaryCardholder?: any;
  dob?: any;
  cardHolderId?: any;
  rxGroupId?: any;
  bin?: any;
  pcn?: any;
}

interface PatientInfo {
  type: string;
  doseCount: number;
}

interface NextOfKin {
  name: string;
  mobile: string;
  relationship: string;
  address: string;
}