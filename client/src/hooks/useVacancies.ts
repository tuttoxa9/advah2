import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Vacancy, VacancyFormData } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    company: "",
    experience: "",
    location: "",
    search: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const vacanciesRef = collection(db, "vacancies");
    let q = query(vacanciesRef, orderBy("createdAt", "desc"));

    // Применяем фильтры
    if (filters.status && filters.status !== "all") {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.company && filters.company !== "all") {
      q = query(q, where("company", "==", filters.company));
    }
    if (filters.experience && filters.experience !== "all") {
      q = query(q, where("experience", "==", filters.experience));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vacanciesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vacancy[];

      // Применяем фильтры поиска и локации на клиенте
      let filteredVacancies = vacanciesData;
      
      if (filters.search) {
        filteredVacancies = filteredVacancies.filter(vacancy =>
          vacancy.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          vacancy.company.toLowerCase().includes(filters.search.toLowerCase()) ||
          vacancy.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.location) {
        filteredVacancies = filteredVacancies.filter(vacancy =>
          vacancy.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      setVacancies(filteredVacancies);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters]);

  const createVacancy = async (data: VacancyFormData) => {
    try {
      setLoading(true);
      const now = new Date();
      const vacancyData = {
        ...data,
        employment_type: "Вахтовый метод",
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      await addDoc(collection(db, "vacancies"), vacancyData);
      
      toast({
        title: "Вакансия создана",
        description: "Новая вакансия успешно добавлена",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка создания",
        description: error.message || "Не удалось создать вакансию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVacancy = async (id: string, data: Partial<VacancyFormData>) => {
    try {
      setLoading(true);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "vacancies", id), updateData);
      
      toast({
        title: "Вакансия обновлена",
        description: "Изменения успешно сохранены",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить вакансию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVacancy = async (id: string) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "vacancies", id), {
        status: "deleted",
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Вакансия удалена",
        description: "Вакансия перемещена в архив",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: error.message || "Не удалось удалить вакансию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const duplicateVacancy = async (vacancy: Vacancy) => {
    try {
      setLoading(true);
      const { id, createdAt, updatedAt, deletedAt, viewCount, ...vacancyData } = vacancy;
      
      const duplicatedData = {
        ...vacancyData,
        title: `${vacancy.title} (копия)`,
        status: "draft" as const,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "vacancies"), duplicatedData);
      
      toast({
        title: "Вакансия скопирована",
        description: "Создана копия вакансии в черновиках",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка копирования",
        description: error.message || "Не удалось скопировать вакансию",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleVacancyStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "active" ? "draft" : "active";
      
      await updateDoc(doc(db, "vacancies", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Статус изменен",
        description: `Вакансия ${newStatus === "active" ? "активирована" : "деактивирована"}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка изменения статуса",
        description: error.message || "Не удалось изменить статус",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (id: string) => {
    try {
      await updateDoc(doc(db, "vacancies", id), {
        viewCount: increment(1),
      });
    } catch (error) {
      console.error("Ошибка увеличения счетчика просмотров:", error);
    }
  };

  return {
    vacancies,
    loading,
    filters,
    setFilters,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    duplicateVacancy,
    toggleVacancyStatus,
    incrementViewCount,
  };
};
