import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyModal } from "./CompanyModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CompanyCardSkeleton } from "@/components/ui/skeleton-loader";
import { 
  Plus, 
  Building, 
  Globe, 
  Calendar, 
  Edit, 
  Trash2,
  MoreVertical
} from "lucide-react";
import { Company } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function CompaniesTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  const { companies, loading, deleteCompany } = useCompanies();

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  if (loading && companies.length === 0) {
    return (
      <div>
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Управление компаниями</h2>
            <p className="text-muted-foreground">Создавайте и редактируйте профили компаний</p>
          </div>
        </div>

        {/* Skeleton карточки компаний */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Управление компаниями</h2>
          <p className="text-muted-foreground">Создавайте и редактируйте профили компаний</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleCreateCompany} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Добавить компанию
          </Button>
        </div>
      </div>

      {/* Список компаний */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
        {companies.length === 0 ? (
          <div className="col-span-full fade-in">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {loading ? "Загрузка компаний..." : "Компании не найдены"}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          companies.map((company) => (
            <Card key={company.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Building className="text-primary-foreground text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {company.vacanciesCount || 0} активных вакансий
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {company.description || "Описание компании не указано"}
                </p>

                <div className="space-y-2 text-sm">
                  {company.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Добавлена {formatDistanceToNow(company.createdAt.toDate(), { 
                        addSuffix: true, 
                        locale: ru 
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    onClick={() => handleEditCompany(company)}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCompany(company.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Модальное окно */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={editingCompany}
      />
    </div>
  );
}
