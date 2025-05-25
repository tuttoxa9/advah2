import { useState, useEffect } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Company, CompanyFormData } from "@/types";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
}

export function CompanyModal({ isOpen, onClose, company }: CompanyModalProps) {
  const { createCompany, updateCompany, loading } = useCompanies();
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    website: ""
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        website: company.website || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        website: ""
      });
    }
  }, [company, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (company) {
        await updateCompany(company.id, formData);
      } else {
        await createCompany(formData);
      }
      
      onClose();
    } catch (error) {
      console.error("Ошибка сохранения компании:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {company ? "Редактировать компанию" : "Создать компанию"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-muted-foreground">Название компании *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Например: ООО 'Газпром нефть'"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-2 bg-muted border-border"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-muted-foreground">Описание компании *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Краткое описание деятельности компании..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 bg-muted border-border resize-none"
              required
            />
          </div>

          <div>
            <Label htmlFor="website" className="text-muted-foreground">Веб-сайт</Label>
            <Input
              id="website"
              type="text"
              placeholder="example.com"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="mt-2 bg-muted border-border"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Сохранить компанию
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
