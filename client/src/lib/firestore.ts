import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Vacancy, Application, Company } from '@/types';

// Вакансии
export const vacanciesCollection = collection(db, 'vacancies');

export const getVacancies = async (filters?: {
  status?: string;
  company?: string;
  experience?: string;
  location?: string;
}): Promise<Vacancy[]> => {
  let q = query(vacanciesCollection, orderBy('createdAt', 'desc'));

  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  if (filters?.company) {
    q = query(q, where('company', '==', filters.company));
  }
  if (filters?.experience) {
    q = query(q, where('experience', '==', filters.experience));
  }
  if (filters?.location) {
    q = query(q, where('location', '==', filters.location));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vacancy));
};

export const createVacancy = async (vacancy: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(vacanciesCollection, {
    ...vacancy,
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateVacancy = async (id: string, updates: Partial<Vacancy>): Promise<void> => {
  const docRef = doc(vacanciesCollection, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteVacancy = async (id: string): Promise<void> => {
  const docRef = doc(vacanciesCollection, id);
  await updateDoc(docRef, {
    status: 'deleted',
    deletedAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

export const incrementVacancyViews = async (id: string): Promise<void> => {
  const docRef = doc(vacanciesCollection, id);
  await updateDoc(docRef, {
    viewCount: increment(1)
  });
};

// Заявки
export const applicationsCollection = collection(db, 'applications');

export const getApplications = async (filters?: {
  status?: string;
  vacancyId?: string;
}): Promise<Application[]> => {
  let q = query(applicationsCollection, orderBy('createdAt', 'desc'));

  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  if (filters?.vacancyId) {
    q = query(q, where('vacancyId', '==', filters.vacancyId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
};

export const createApplication = async (application: Omit<Application, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(applicationsCollection, {
    ...application,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateApplicationStatus = async (id: string, status: Application['status']): Promise<void> => {
  const docRef = doc(applicationsCollection, id);
  await updateDoc(docRef, { status });
};

// Компании
export const companiesCollection = collection(db, 'companies');

export const getCompanies = async (): Promise<Company[]> => {
  const q = query(companiesCollection, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
};

export const createCompany = async (company: Omit<Company, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(companiesCollection, {
    ...company,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateCompany = async (id: string, updates: Partial<Company>): Promise<void> => {
  const docRef = doc(companiesCollection, id);
  await updateDoc(docRef, updates);
};

export const deleteCompany = async (id: string): Promise<void> => {
  const docRef = doc(companiesCollection, id);
  await deleteDoc(docRef);
};
