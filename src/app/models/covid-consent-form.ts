// export interface VaccinationForm {
//     totalForm: string;
//     data: CovidConcetForm[];
//   }
export interface CovidConcentForm {
      nextOfKin: NextOfKin;
      patientInfo: PatientInfo;
      // insuranceInfo: InsuranceInfo;
      insCardFront: string | File;
      insCardBack: string | File;
      govIssuedId: string | File;
      mobile: string,
      email: string,
      prescriptionInsurance: PrescriptionInsurance;
      medicareFields: MedicareFields;
      medicalIns: MedicalIns;
      privateIns: PrivateIns;
      uninsured: Uninsured;
      potentialContradiction: PotentialContradiction;
      potentialConsideration: PotentialConsideration;
      signature: string | File;
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
      vaccineCenterId: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      scheduleDate: string;
      scheduleTime: string;
    }
    
    interface PotentialConsideration {
      haveBleedingDisorder: string;
      haveWeekImmuneSystem: string;
      isPregOrBreastfeeding: string;
      // signature: string;
      date: string;
      nameOfParent: string;
      mobile: string;
      relationship: string;
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
      isUninsured: boolean;
      socialSecurityNumber: string;
      stateIdNumber: string;
      driverLicenseNumber: string;
    }
    
    interface PrivateIns {
      medicalInsProvider: string;
      cardHolderId: string;
      groupId: string;
      payerId: string;
    }
    
    interface MedicalIns {
      medicalInsProvider: string;
    }
    
    interface MedicareFields {
      patientAgeAbove65: string;
      mbi: string;
    }
    
    interface PrescriptionInsurance {
      isPrimaryCardholder: string;
      DOB: string;
      insType: string;
      cardHolderId: string;
      rxGroupId: string;
      bin: string;
      pcn: string;
    }
    
    interface InsuranceInfo {
      insCardFront: string;
      insCardBack: string;
      govIssuedId: string;
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