import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Company, CompanyFormData } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const companiesRef = collection(db, "companies");
    const q = query(companiesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const companiesData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const companyData = { id: docSnapshot.id, ...docSnapshot.data() } as Company;
          
          // Получаем количество активных вакансий для компании
          try {
            const vacanciesRef = collection(db, "vacancies");
            const vacanciesQuery = query(
              vacanciesRef, 
              where("company", "==", companyData.name),
              where("status", "==", "active")
            );
            const vacanciesSnapshot = await getDocs(vacanciesQuery);
            companyData.vacanciesCount = vacanciesSnapshot.size;
          } catch (error) {
            console.error("Ошибка получения количества вакансий:", error);
            companyData.vacanciesCount = 0;
          }
          
          return companyData;
        })
      );

      setCompanies(companiesData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createCompany = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      const companyData = {
        ...data,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "companies"), companyData);
      
      toast({
        title: "Компания создана",
        description: "Новая компания успешно добавлена",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка создания",
        description: error.message || "Не удалось создать компанию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id: string, data: Partial<CompanyFormData>) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "companies", id), data);
      
      toast({
        title: "Компания обновлена",
        description: "Изменения успешно сохранены",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить компанию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "companies", id));
      
      toast({
        title: "Компания удалена",
        description: "Компания успешно удалена",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: error.message || "Не удалось удалить компанию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    createCompany,
    updateCompany,
    deleteCompany,
  };
};
