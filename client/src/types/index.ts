import { Timestamp } from "firebase/firestore";

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: "Не требуется" | "От 1 года" | "От 3 лет";
  employment_type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: "active" | "deleted" | "draft";
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}

export interface Application {
  id: string;
  vacancyId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "new" | "viewed" | "contacted" | "rejected";
  createdAt: Timestamp;
  vacancyTitle?: string;
  companyName?: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  createdAt: Timestamp;
  vacanciesCount?: number;
}

export interface VacancyFormData {
  title: string;
  company: string;
  location: string;
  experience: "Не требуется" | "От 1 года" | "От 3 лет";
  salary: {
    min: number | "";
    max: number | "";
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  status: "active" | "draft";
  employment_type: string;
}

export interface CompanyFormData {
  name: string;
  description: string;
  website?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  phone: string;
  smsCode: string;
}
