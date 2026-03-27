import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceForm } from "@/components/services/service-form";

export default function NewServicePage() {
  return (
    <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="font-heading text-xl font-bold leading-none">
            Novo Serviço
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            O checklist será gerado automaticamente
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Tipo de serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
