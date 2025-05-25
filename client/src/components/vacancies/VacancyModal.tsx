import { useState, useEffect } from "react";
import { useVacancies } from "@/hooks/useVacancies";
import { useCompanies } from "@/hooks/useCompanies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, X } from "lucide-react";
import { Vacancy, VacancyFormData } from "@/types";

interface VacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy?: Vacancy | null;
}

export function VacancyModal({ isOpen, onClose, vacancy }: VacancyModalProps) {
  const { createVacancy, updateVacancy, loading } = useVacancies();
  const { companies } = useCompanies();
  
  const [formData, setFormData] = useState<VacancyFormData>({
    title: "",
    company: "",
    location: "",
    experience: "Не требуется",
    salary: {
      min: "",
      max: "",
      currency: "₽"
    },
    description: "",
    requirements: [],
    benefits: [],
    status: "active",
    employment_type: "Вахтовый метод"
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (vacancy) {
      setFormData({
        title: vacancy.title,
        company: vacancy.company,
        location: vacancy.location,
        experience: vacancy.experience,
        salary: {
          min: vacancy.salary.min || "",
          max: vacancy.salary.max || "",
          currency: vacancy.salary.currency
        },
        description: vacancy.description,
        requirements: vacancy.requirements,
        benefits: vacancy.benefits,
        status: vacancy.status === "deleted" ? "draft" : vacancy.status,
        employment_type: vacancy.employment_type
      });
    } else {
      setFormData({
        title: "",
        company: "",
        location: "",
        experience: "Не требуется",
        salary: {
          min: "",
          max: "",
          currency: "₽"
        },
        description: "",
        requirements: [],
        benefits: [],
        status: "active",
        employment_type: "Вахтовый метод"
      });
    }
  }, [vacancy, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        salary: {
          min: formData.salary.min ? Number(formData.salary.min) : 0,
          max: formData.salary.max ? Number(formData.salary.max) : 0,
          currency: formData.salary.currency
        }
      };

      if (vacancy) {
        await updateVacancy(vacancy.id, submitData);
      } else {
        await createVacancy(submitData);
      }
      
      onClose();
    } catch (error) {
      console.error("Ошибка сохранения вакансии:", error);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {vacancy ? "Редактировать вакансию" : "Создать вакансию"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-muted-foreground">Название вакансии *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Например: Бурильщик на нефтяной вышке"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2 bg-muted border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-muted-foreground">Компания *</Label>
              <Select 
                value={formData.company} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
              >
                <SelectTrigger className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="Выберите компанию" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location" className="text-muted-foreground">Город *</Label>
              <Input
                id="location"
                type="text"
                placeholder="Например: Тюмень"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-2 bg-muted border-border"
                required
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Опыт работы</Label>
              <Select 
                value={formData.experience} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, experience: value }))}
              >
                <SelectTrigger className="mt-2 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Не требуется">Не требуется</SelectItem>
                  <SelectItem value="От 1 года">От 1 года</SelectItem>
                  <SelectItem value="От 3 лет">От 3 лет</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Зарплата</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                type="number"
                placeholder="От (₽)"
                value={formData.salary.min}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  salary: { ...prev.salary, min: e.target.value }
                }))}
                className="bg-muted border-border"
              />
              <Input
                type="number"
                placeholder="До (₽)"
                value={formData.salary.max}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  salary: { ...prev.salary, max: e.target.value }
                }))}
                className="bg-muted border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-muted-foreground">Описание вакансии *</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Подробное описание обязанностей и условий работы..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 bg-muted border-border resize-none"
              required
            />
          </div>

          <div>
            <Label className="text-muted-foreground">Требования</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Добавить требование"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="flex-1 bg-muted border-border"
                />
                <Button type="button" onClick={addRequirement} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                    {req}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Преимущества</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Добавить преимущество"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  className="flex-1 bg-muted border-border"
                />
                <Button type="button" onClick={addBenefit} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                    {benefit}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Статус</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft" className="text-muted-foreground">Черновик</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="text-muted-foreground">Активная</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Сохранить вакансию
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
