import { useApplications } from "@/hooks/useApplications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApplicationCardSkeleton, StatCardSkeleton } from "@/components/ui/skeleton-loader";
import { 
  Search, 
  FileText, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  PhoneCall,
  X,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function ApplicationsTab() {
  const { 
    applications, 
    loading, 
    filters, 
    setFilters, 
    stats,
    markAsViewed,
    markAsContacted,
    rejectApplication
  } = useApplications();

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-500/20 text-blue-400",
      viewed: "bg-yellow-500/20 text-yellow-400",
      contacted: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400"
    };
    
    const labels = {
      new: "Новая",
      viewed: "Просмотрено",
      contacted: "Связались",
      rejected: "Отклонена"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div>
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Заявки от соискателей</h2>
            <p className="text-muted-foreground">Просматривайте и управляйте заявками</p>
          </div>
        </div>

        {/* Статистика skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>

        {/* Заявки skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ApplicationCardSkeleton key={index} />
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Заявки от соискателей</h2>
          <p className="text-muted-foreground">Просматривайте и управляйте заявками</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск заявок..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full sm:w-64 pl-10 bg-muted border-border"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Новые заявки</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.newApplications}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">В обработке</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.processingApplications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Связались</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.contactedApplications}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Phone className="text-green-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Отклонённые</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.rejectedApplications}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <X className="text-red-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Статус</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="viewed">Просмотренные</SelectItem>
                  <SelectItem value="contacted">Связались</SelectItem>
                  <SelectItem value="rejected">Отклонённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Вакансия</Label>
              <Select value={filters.vacancyId} onValueChange={(value) => setFilters(prev => ({ ...prev, vacancyId: value }))}>
                <SelectTrigger className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="Все вакансии" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все вакансии</SelectItem>
                  {Array.from(new Set(applications.map(app => app.vacancyId))).map(vacancyId => {
                    const app = applications.find(a => a.vacancyId === vacancyId);
                    return app?.vacancyTitle ? (
                      <SelectItem key={vacancyId} value={vacancyId}>
                        {app.vacancyTitle}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Период</Label>
              <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
                <SelectTrigger className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="За всё время" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">За всё время</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">За неделю</SelectItem>
                  <SelectItem value="month">За месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список заявок */}
      <div className="space-y-4 stagger-children">
        {applications.length === 0 ? (
          <Card className="fade-in">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {loading ? "Загрузка заявок..." : "Заявки не найдены"}
              </div>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{application.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {application.vacancyTitle && application.companyName 
                            ? `${application.vacancyTitle} • ${application.companyName}`
                            : "Вакансия не найдена"
                          }
                        </p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{application.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{application.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(application.createdAt.toDate(), { 
                            addSuffix: true, 
                            locale: ru 
                          })}
                        </span>
                      </div>
                    </div>

                    {application.message && (
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-muted-foreground text-sm">{application.message}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                    {application.status === "new" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => markAsViewed(application.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Просмотрено
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markAsContacted(application.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <PhoneCall className="w-4 h-4 mr-1" />
                          Связались
                        </Button>
                      </>
                    )}
                    
                    {application.status === "viewed" && (
                      <Button
                        size="sm"
                        onClick={() => markAsContacted(application.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <PhoneCall className="w-4 h-4 mr-1" />
                        Связались
                      </Button>
                    )}
                    
                    {application.status === "contacted" && (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        Обработана
                      </div>
                    )}
                    
                    {application.status !== "rejected" && application.status !== "contacted" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => rejectApplication(application.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
