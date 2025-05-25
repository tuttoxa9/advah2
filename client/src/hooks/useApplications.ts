import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Application } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    vacancyId: "",
    period: "",
    search: ""
  });
  const [stats, setStats] = useState({
    newApplications: 0,
    processingApplications: 0,
    contactedApplications: 0,
    rejectedApplications: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const applicationsRef = collection(db, "applications");
    let q = query(applicationsRef, orderBy("createdAt", "desc"));

    // Применяем фильтры
    if (filters.status && filters.status !== "all") {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.vacancyId && filters.vacancyId !== "all") {
      q = query(q, where("vacancyId", "==", filters.vacancyId));
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const applicationsData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const applicationData = { id: docSnapshot.id, ...docSnapshot.data() } as Application;
          
          // Получаем информацию о вакансии
          try {
            const vacancyDoc = await getDoc(doc(db, "vacancies", applicationData.vacancyId));
            if (vacancyDoc.exists()) {
              const vacancyData = vacancyDoc.data();
              applicationData.vacancyTitle = vacancyData.title;
              applicationData.companyName = vacancyData.company;
            }
          } catch (error) {
            console.error("Ошибка получения данных вакансии:", error);
          }
          
          return applicationData;
        })
      );

      // Применяем фильтры поиска на клиенте
      let filteredApplications = applicationsData;
      
      if (filters.search) {
        filteredApplications = filteredApplications.filter(app =>
          app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.phone.includes(filters.search) ||
          (app.vacancyTitle && app.vacancyTitle.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      // Применяем фильтр по периоду
      if (filters.period) {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.period) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "all":
          default:
            startDate = new Date(0); // Показать все
            break;
        }
        
        filteredApplications = filteredApplications.filter(app =>
          app.createdAt.toDate() >= startDate
        );
      }

      setApplications(filteredApplications);

      // Вычисляем статистику
      const newStats = {
        newApplications: applicationsData.filter(app => app.status === "new").length,
        processingApplications: applicationsData.filter(app => app.status === "viewed").length,
        contactedApplications: applicationsData.filter(app => app.status === "contacted").length,
        rejectedApplications: applicationsData.filter(app => app.status === "rejected").length,
      };
      setStats(newStats);
      
      setLoading(false);
    });

    return unsubscribe;
  }, [filters]);

  const updateApplicationStatus = async (id: string, status: Application["status"]) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "applications", id), {
        status,
        updatedAt: serverTimestamp(),
      });
      
      const statusMessages = {
        viewed: "отмечена как просмотренная",
        contacted: "отмечена как обработанная",
        rejected: "отклонена",
        new: "возвращена в новые"
      };
      
      toast({
        title: "Статус обновлен",
        description: `Заявка ${statusMessages[status]}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить статус заявки",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id: string) => updateApplicationStatus(id, "viewed");
  const markAsContacted = (id: string) => updateApplicationStatus(id, "contacted");
  const rejectApplication = (id: string) => updateApplicationStatus(id, "rejected");

  return {
    applications,
    loading,
    filters,
    setFilters,
    stats,
    markAsViewed,
    markAsContacted,
    rejectApplication,
    updateApplicationStatus,
  };
};
