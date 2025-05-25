import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Устанавливаем сохранение сессии в localStorage
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    }).catch((error) => {
      console.error("Ошибка настройки сохранения сессии:", error);
      setLoading(false);
    });
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в систему!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error.message || "Неверный email или пароль",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Выход выполнен",
        description: "До свидания!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка выхода",
        description: error.message,
      });
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    logout,
    isAuthenticated: !!user,
  };
};
