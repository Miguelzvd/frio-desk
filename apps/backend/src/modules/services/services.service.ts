import { ServiceType } from "@field-report/shared";
import * as servicesRepository from "./services.repository";
import {
  ServiceSelect,
  ChecklistItemSelect,
  PhotoSelect,
} from "../../db/schema";

const DEFAULT_CHECKLISTS: Record<ServiceType, string[]> = {
  preventiva: [
    "Limpeza de filtros",
    "Verificação de gás",
    "Teste de temperatura",
    "Inspeção elétrica",
  ],
  corretiva: [
    "Diagnóstico do problema",
    "Substituição de peça",
    "Teste pós-reparo",
  ],
  instalação: [
    "Fixação da unidade",
    "Conexão elétrica",
    "Carga de gás",
    "Teste de funcionamento",
  ],
  inspeção: [
    "Verificação visual",
    "Medição de corrente",
    "Relatório de estado",
  ],
};

export interface ServiceDetail extends ServiceSelect {
  checklist: ChecklistItemSelect[];
  photos: PhotoSelect[];
}

export async function createService(
  userId: string,
  type: ServiceType,
): Promise<ServiceDetail> {
  const service = await servicesRepository.createService({ userId, type });

  const checklistLabels = DEFAULT_CHECKLISTS[type];
  const checklistItems = await servicesRepository.createChecklistItems(
    checklistLabels.map((label) => ({ serviceId: service.id, label })),
  );

  return { ...service, checklist: checklistItems, photos: [] };
}

export async function listServices(userId: string): Promise<ServiceSelect[]> {
  return servicesRepository.findServicesByUserId(userId);
}

export async function getServiceDetail(
  id: string,
  userId: string,
): Promise<ServiceDetail> {
  const service = await servicesRepository.findServiceByIdAndUserId(id, userId);

  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), {
      statusCode: 404,
    });
  }

  const [checklist, photos] = await Promise.all([
    servicesRepository.findChecklistByServiceId(id),
    servicesRepository.findPhotosByServiceId(id),
  ]);

  return { ...service, checklist, photos };
}

export async function updateService(
  id: string,
  userId: string,
  data: Partial<{
    type: ServiceType;
    status: "open" | "finished";
    finishedAt: Date | null;
  }>,
): Promise<ServiceSelect> {
  const existing = await servicesRepository.findServiceByIdAndUserId(
    id,
    userId,
  );

  if (!existing) {
    throw Object.assign(new Error("Serviço não encontrado"), {
      statusCode: 404,
    });
  }

  return servicesRepository.updateService(id, data);
}

export async function deleteService(id: string, userId: string): Promise<void> {
  const existing = await servicesRepository.findServiceByIdAndUserId(
    id,
    userId,
  );

  if (!existing) {
    throw Object.assign(new Error("Serviço não encontrado"), {
      statusCode: 404,
    });
  }

  await servicesRepository.deleteService(id);
}
