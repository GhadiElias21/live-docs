// hooks/useToast.ts
import CustomToast from "@/app/components/Toast/CustomToast";
import { toast } from "react-hot-toast";

interface UseToastReturn {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const useToast = (): UseToastReturn => {
  const success = (message: string) => {
    toast.custom((t) => <CustomToast type="success" message={message} />);
  };

  const error = (message: string) => {
    toast.custom((t) => <CustomToast type="error" message={message} />);
  };

  return { success, error };
};
