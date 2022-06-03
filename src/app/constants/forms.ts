export interface PHARMACY_FORM_TYPE {label: string, formControlName: string, value: string, type: string, isRequired:boolean,sortOrder:number}

export const PHARMACY_FORM = [
    { label: 'Pharmacy Name', formControlName: 'pharmacyName', value: '', type: 'text', isRequired: true, sortOrder : 1},
    { label: 'Phone Number', formControlName: 'phoneNumber', value: '', type: 'text', isRequired: true, sortOrder : 2},
    { label: 'Fax Number', formControlName: 'faxNumber', value: '', type: 'text', isRequired: true, sortOrder : 3},
    { label: 'Email Address', formControlName: 'emailId', value: '', type: 'text', isRequired: true, sortOrder : 4},
    { label: 'Street Address', formControlName: 'streetAddress', value: '', type: 'text', isRequired: true, sortOrder : 5},
    { label: 'City', formControlName: 'city', value: '', type: 'text', isRequired: true, sortOrder :6 },
    { label: 'Zip', formControlName: 'zip', value: '', type: 'text', isRequired: true, sortOrder :7 },
    { label: 'NCPDP Number', formControlName: 'NCPDP', value: '', type: 'text', isRequired: true, sortOrder : 8},
    { label: 'NPI Number', formControlName: 'NPI', value: '', type: 'text', isRequired: true, sortOrder :9 },
    { label: 'Pharmacist Name', formControlName: 'pharmacistName', value: '', type: 'text', isRequired: true, sortOrder : 10},
    { label: 'Pharmacist Email', formControlName: 'pharmacistEmail', value: '', type: 'text', isRequired: true, sortOrder : 11},
    { label: 'Pharmacist NPI Number', formControlName: 'pharmacistNPI', value: '', type: 'text', isRequired: true, sortOrder :12 },
]