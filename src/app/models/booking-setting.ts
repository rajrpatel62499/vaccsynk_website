export class BookingSetting {
    currentVaccineCenter: string | CurrentVaccineCenter | any;
    startTime: number;
    endTime: number;
    scheduleDate: string; // MM/DD/YYYY
}


export interface CurrentVaccineCenter {
    timings: Timings;
    dosePerSlot?: any;
    _id: string;
    pharmacyName: string;
    address: string;
  }
  interface Timings {
    Monday: DayInfo;
    Tuesday: DayInfo;
    Wednesday: DayInfo;
    Thursday: DayInfo;
    Friday: DayInfo;
    Saturday: DayInfo;
    Sunday: DayInfo;
  }
  interface DayInfo {
    maxDose: number;
    slots: Slot[];
    open: string;
    close: string;
  }
  interface Slot {
    limit: number;
    _id: string;
    start: string;
    end: string;
  }