import "dotenv/config";
import { db } from "./index";
import { users, services, checklistItems, photos, reports } from "./schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // Limpar dados existentes (ordem importa por causa das foreign keys)
    console.log("🗑️  Clearing existing data...");
    await db.delete(photos);
    await db.delete(reports);
    await db.delete(checklistItems);
    await db.delete(services);
    await db.delete(users);

    // Hash da senha padrão: "123456"
    const passwordHash = await bcrypt.hash("123456", 10);

    // Criar usuários
    console.log("👤 Creating users...");
    const [admin, tech1, tech2, tech3] = await db
      .insert(users)
      .values([
        {
          name: "Administrador",
          email: "admin@fieldreport.com",
          passwordHash,
          role: "admin",
        },
        {
          name: "João Silva",
          email: "joao.silva@fieldreport.com",
          passwordHash,
          role: "technician",
        },
        {
          name: "Maria Santos",
          email: "maria.santos@fieldreport.com",
          passwordHash,
          role: "technician",
        },
        {
          name: "Pedro Oliveira",
          email: "pedro.oliveira@fieldreport.com",
          passwordHash,
          role: "technician",
        },
      ])
      .returning();

    console.log(`✅ Created ${[admin, tech1, tech2, tech3].length} users`);

    // Criar serviços
    console.log("🔧 Creating services...");
    const servicesList = await db
      .insert(services)
      .values([
        // Serviços finalizados do João
        {
          userId: tech1.id,
          type: "preventiva",
          status: "finished",
          createdAt: new Date("2026-03-01T08:00:00"),
          finishedAt: new Date("2026-03-01T11:30:00"),
        },
        {
          userId: tech1.id,
          type: "corretiva",
          status: "finished",
          createdAt: new Date("2026-03-05T09:30:00"),
          finishedAt: new Date("2026-03-05T14:00:00"),
        },
        {
          userId: tech1.id,
          type: "inspeção",
          status: "finished",
          createdAt: new Date("2026-03-10T10:00:00"),
          finishedAt: new Date("2026-03-10T12:45:00"),
        },
        // Serviços finalizados da Maria
        {
          userId: tech2.id,
          type: "instalação",
          status: "finished",
          createdAt: new Date("2026-03-03T07:30:00"),
          finishedAt: new Date("2026-03-03T16:00:00"),
        },
        {
          userId: tech2.id,
          type: "preventiva",
          status: "finished",
          createdAt: new Date("2026-03-12T08:15:00"),
          finishedAt: new Date("2026-03-12T10:30:00"),
        },
        {
          userId: tech2.id,
          type: "corretiva",
          status: "finished",
          createdAt: new Date("2026-03-15T13:00:00"),
          finishedAt: new Date("2026-03-15T15:45:00"),
        },
        // Serviços finalizados do Pedro
        {
          userId: tech3.id,
          type: "inspeção",
          status: "finished",
          createdAt: new Date("2026-03-08T09:00:00"),
          finishedAt: new Date("2026-03-08T11:00:00"),
        },
        {
          userId: tech3.id,
          type: "preventiva",
          status: "finished",
          createdAt: new Date("2026-03-18T08:00:00"),
          finishedAt: new Date("2026-03-18T10:15:00"),
        },
        // Serviços abertos (em andamento)
        {
          userId: tech1.id,
          type: "preventiva",
          status: "open",
          createdAt: new Date("2026-03-20T08:30:00"),
        },
        {
          userId: tech1.id,
          type: "corretiva",
          status: "open",
          createdAt: new Date("2026-03-22T09:00:00"),
        },
        {
          userId: tech2.id,
          type: "instalação",
          status: "open",
          createdAt: new Date("2026-03-24T07:45:00"),
        },
        {
          userId: tech2.id,
          type: "inspeção",
          status: "open",
          createdAt: new Date("2026-03-25T10:00:00"),
        },
        {
          userId: tech3.id,
          type: "corretiva",
          status: "open",
          createdAt: new Date("2026-03-26T08:00:00"),
        },
        {
          userId: tech3.id,
          type: "preventiva",
          status: "open",
          createdAt: new Date("2026-03-27T09:30:00"),
        },
      ])
      .returning();

    console.log(`✅ Created ${servicesList.length} services`);

    // Criar checklist items para os serviços
    console.log("✅ Creating checklist items...");
    const checklistData = servicesList.flatMap((service) => {
      const isFinished = service.status === "finished";

      // Checklist baseado no tipo de serviço
      const checklistsByType = {
        preventiva: [
          { label: "Limpeza geral do equipamento", checked: isFinished },
          {
            label: "Verificação de componentes elétricos",
            checked: isFinished,
          },
          { label: "Lubrificação das partes móveis", checked: isFinished },
          { label: "Teste de funcionamento", checked: isFinished },
          { label: "Documentação fotográfica", checked: isFinished },
        ],
        corretiva: [
          { label: "Diagnóstico do problema", checked: isFinished },
          { label: "Identificação de peças danificadas", checked: isFinished },
          { label: "Substituição de componentes", checked: isFinished },
          { label: "Teste pós-reparo", checked: isFinished },
          { label: "Validação com cliente", checked: isFinished },
        ],
        instalação: [
          { label: "Preparação do local", checked: isFinished },
          { label: "Montagem do equipamento", checked: isFinished },
          { label: "Conexões elétricas", checked: isFinished },
          { label: "Configuração inicial", checked: isFinished },
          { label: "Treinamento do usuário", checked: isFinished },
          { label: "Entrega de documentação", checked: isFinished },
        ],
        inspeção: [
          { label: "Inspeção visual externa", checked: isFinished },
          { label: "Verificação de segurança", checked: isFinished },
          { label: "Medições e testes", checked: isFinished },
          { label: "Registro de anomalias", checked: isFinished },
          { label: "Elaboração de relatório", checked: isFinished },
        ],
      };

      return checklistsByType[service.type].map((item) => ({
        serviceId: service.id,
        ...item,
      }));
    });

    await db.insert(checklistItems).values(checklistData);
    console.log(`✅ Created ${checklistData.length} checklist items`);

    // Criar fotos para serviços finalizados
    console.log("📷 Creating photos...");
    const finishedServices = servicesList.filter(
      (s) => s.status === "finished",
    );
    const photosData = finishedServices.flatMap((service, idx) => {
      // 2-4 fotos por serviço finalizado
      const photoCount = 2 + (idx % 3);
      return Array.from({ length: photoCount }, (_, photoIdx) => ({
        serviceId: service.id,
        url: `https://placehold.co/800x600/e2e8f0/1e293b?text=Foto+${photoIdx + 1}+Serviço`,
        publicId: `field-report/service-${service.id}-photo-${photoIdx + 1}`,
      }));
    });

    await db.insert(photos).values(photosData);
    console.log(`✅ Created ${photosData.length} photos`);

    // Criar relatórios para serviços finalizados
    console.log("📋 Creating reports...");
    const reportsData = finishedServices.map((service, idx) => {
      const techName =
        service.userId === tech1.id
          ? tech1.name
          : service.userId === tech2.id
            ? tech2.name
            : tech3.name;

      const reportNotes = [
        "Serviço concluído com sucesso. Equipamento funcionando dentro dos parâmetros esperados. Cliente satisfeito com o atendimento.",
        "Manutenção realizada conforme procedimento padrão. Identificadas pequenas irregularidades que foram corrigidas durante o atendimento.",
        "Trabalho executado sem intercorrências. Todas as verificações realizadas apresentaram resultados satisfatórios.",
        "Serviço finalizado dentro do prazo estimado. Equipamento testado e aprovado. Orientações repassadas ao responsável local.",
        "Atendimento realizado com êxito. Observadas boas condições gerais do equipamento. Recomendada nova inspeção em 6 meses.",
        "Manutenção concluída. Substituídas peças desgastadas. Sistema operando normalmente após os ajustes realizados.",
        "Instalação/Reparo finalizado. Testes funcionais aprovados. Documentação técnica entregue ao cliente.",
        "Serviço executado conforme escopo. Ambiente adequado e equipe colaborativa. Próxima visita agendada para acompanhamento.",
      ];

      return {
        serviceId: service.id,
        responsibleName: techName,
        notes: reportNotes[idx % reportNotes.length],
      };
    });

    await db.insert(reports).values(reportsData);
    console.log(`✅ Created ${reportsData.length} reports`);

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Users: 4 (1 admin, 3 technicians)`);
    console.log(
      `   • Services: ${servicesList.length} (${finishedServices.length} finished, ${servicesList.length - finishedServices.length} open)`,
    );
    console.log(`   • Checklist items: ${checklistData.length}`);
    console.log(`   • Photos: ${photosData.length}`);
    console.log(`   • Reports: ${reportsData.length}`);
    console.log("\n🔑 Login credentials (all users):");
    console.log("   • Email: admin@fieldreport.com (admin)");
    console.log("   • Email: joao.silva@fieldreport.com (technician)");
    console.log("   • Email: maria.santos@fieldreport.com (technician)");
    console.log("   • Email: pedro.oliveira@fieldreport.com (technician)");
    console.log("   • Password: 123456");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
