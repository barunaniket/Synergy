export interface HealthData {
  region: string;
  date: string;
  totalPatients: number;
  symptomSpikes: {
    symptom: string;
    increasePercent: number;
  }[];
  drugConsumption: {
    drugName: string;
    changePercent: number;
  }[];
}

export const mockHealthData: HealthData[] = [
  {
    region: "Bengaluru",
    date: "2025-09-01",
    totalPatients: 1200,
    symptomSpikes: [
      { symptom: "Fever", increasePercent: 5 },
      { symptom: "Cough", increasePercent: 8 },
    ],
    drugConsumption: [
      { drugName: "Paracetamol", changePercent: 7 },
      { drugName: "Oseltamivir (Tamiflu)", changePercent: 2 },
    ],
  },
  {
    region: "Bengaluru",
    date: "2025-09-02",
    totalPatients: 1250,
    symptomSpikes: [
        { symptom: "Fever", increasePercent: 12 },
        { symptom: "Cough", increasePercent: 15 },
    ],
    drugConsumption: [
        { drugName: "Paracetamol", changePercent: 14 },
        { drugName: "Oseltamivir (Tamiflu)", changePercent: 25 },
    ],
  },
  {
    region: "Bengaluru",
    date: "2025-09-03",
    totalPatients: 1400,
    symptomSpikes: [
        { symptom: "Fever", increasePercent: 25 },
        { symptom: "Cough", increasePercent: 30 },
        { symptom: "Shortness of Breath", increasePercent: 10 },
    ],
    drugConsumption: [
        { drugName: "Paracetamol", changePercent: 28 },
        { drugName: "Oseltamivir (Tamiflu)", changePercent: 45 },
        { drugName: "Remdesivir", changePercent: 5 },
    ],
  },
   {
    region: "Bengaluru",
    date: "2025-09-04",
    totalPatients: 1650,
    symptomSpikes: [
        { symptom: "Fever", increasePercent: 40 },
        { symptom: "Cough", increasePercent: 55 },
        { symptom: "Shortness of Breath", increasePercent: 25 },
    ],
    drugConsumption: [
        { drugName: "Paracetamol", changePercent: 50 },
        { drugName: "Oseltamivir (Tamiflu)", changePercent: 70 },
        { drugName: "Remdesivir", changePercent: 15 },
    ],
  },
];