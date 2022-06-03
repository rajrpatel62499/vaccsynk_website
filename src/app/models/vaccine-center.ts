export interface VaccineCenter {
    timings: Timings;
    _id: string;
    pharmacyName: string;
    address: string;
    mobile: string;
    faxNo: string;
    email: string;
    NCPDPNo: string;
    NPINo: string;
    pharmacistName: string;
    pharmacistEmail: string;
  }
  
export interface Timings {
    Monday: SlotInfo;
    Tuesday: SlotInfo;
    Wednesday: SlotInfo;
    Thursday: SlotInfo;
    Friday: SlotInfo;
    Saturday: SlotInfo;
    Sunday: SlotInfo;
  }

export interface SlotInfo {
    maxDose?: number;
    open: string;
    close: string;
    noOfVaccinator: number;
    slots: Slot[];
}

export interface Slot {
  _id: string;
  limit: number;
  start: string;
  end: string;
}
