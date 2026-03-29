import axios from "axios";
import { toast } from "sonner";

export function handleApiError(
  err: unknown,
  fallbackMessage: string = "Erro ao processar requisição"
) {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK" || err.response?.status === 500) {
      toast.error("Erro de conexão com servidor");
      return;
    }
    toast.error(err.response?.data?.message ?? fallbackMessage);
    return;
  }
  toast.error("Erro desconhecido");
}
