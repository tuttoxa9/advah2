import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size], className)} />
  );
}

export function ModernLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10", 
    lg: "h-16 w-16"
  };

  return (
    <div className="relative">
      <div className={cn("animate-pulse bg-primary rounded-xl flex items-center justify-center", sizeClasses[size])}>
        <Briefcase className="text-primary-foreground opacity-80" />
      </div>
      <div className="absolute inset-0 animate-ping rounded-xl border-2 border-primary opacity-25"></div>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Загрузка..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-10 border border-border/50 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <ModernLoader size="lg" />
            <div className="text-center space-y-2">
              <p className="text-foreground font-semibold text-lg">{message}</p>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-dark-700 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <Briefcase className="text-4xl text-primary-foreground" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto animate-ping rounded-2xl border-4 border-primary opacity-20"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Вахта CRM</h1>
          <p className="text-muted-foreground">Инициализация системы...</p>
          
          <div className="flex justify-center space-x-2 pt-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-primary/30 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
