import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceForm } from "@/components/services/service-form";

export default function NewServicePage() {
  return (
    <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          nativeButton={false}
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

      <div className="flex flex-col items-center">
        <Card className="max-w-xl w-full">
          <CardContent>
            <ServiceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
