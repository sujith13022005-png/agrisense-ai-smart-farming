export type UserRole = 'FARMER' | 'ADMIN';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: 'en' | 'ta';
  farmName?: string;
  location?: string;
  primaryCrop?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  farmId: string;
  userId: string;
  farmName: string;
  location: string;
  area: number; // in acres
  soilType: 'Loamy' | 'Clay' | 'Sandy' | 'Black Soil' | 'Red Soil' | 'Silty';
  irrigationType: 'Drip' | 'Sprinkler' | 'Flood / Furrow' | 'Rainfed';
  primaryCrop: string;
  createdAt: string;
  updatedAt: string;
}

export type CropStatus = 'Healthy' | 'Needs Attention' | 'Critical' | 'Harvest Ready';

export interface Crop {
  cropId: string;
  farmId: string;
  userId: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting/Harvest';
  harvestDate?: string;
  area: number; // in acres
  status: CropStatus;
  healthScore: number; // 0-100
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DiseaseSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CropAnalysis {
  analysisId: string;
  userId: string;
  farmId?: string;
  cropId?: string;
  imagePath: string; // URL or base64
  cropName: string;
  growthStage?: string;
  observedSymptoms?: string[];
  fieldNotes?: string;
  possibleDisease?: string;
  scientificName?: string;
  possiblePest?: string;
  confidence: number; // percentage (e.g. 96%)
  severity: DiseaseSeverity;
  severityLevel?: string; // e.g. "Level 2/4"
  healthScore: number; // 0-100
  affectedFoliagePercent?: number;
  thermalStress?: string;
  pestRiskPercent?: number;
  aiInsights: string; // narrative explanation
  recommendations: {
    bioOrganicRemedy?: string;
    chemicalContingency?: string;
    culturalSanitation?: string;
  };
  recoveryTasks?: {
    day: number;
    title: string;
    description: string;
    completed: boolean;
  }[];
  disclaimer: string;
  createdAt: string;
}

export interface SensorReading {
  sensorReadingId: string;
  farmId: string;
  userId?: string;
  temperature: number; // in Celsius
  humidity: number; // in percentage
  soilMoisture: number; // in percentage
  ambientLight?: string;
  npkStatus?: string;
  timestamp: string;
}

export type AlertType = 'Disease' | 'Pest' | 'Weather' | 'Irrigation' | 'Crop Health' | 'Sensor';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FarmAlert {
  alertId: string;
  userId: string;
  farmId?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface IrrigationRecommendation {
  crop: string;
  growthStage: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  status: 'Immediate' | 'Scheduled' | 'Delayed' | 'Optimal';
  nextSchedule: string;
  durationMinutes: number;
  waterSavingsLitres?: number;
  reasoning: string;
}

export interface FertilizerRecommendation {
  crop: string;
  growthStage: string;
  soilType: string;
  nutrientFocus: string;
  recommendedFertilizer: string;
  dosage: string;
  applicationSchedule: string;
  organicAlternatives: string;
  cautionNotes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  language?: 'en' | 'ta';
}
