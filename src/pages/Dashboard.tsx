import React from "react";
import { PersonaProvider } from "@/contexts/PersonaContext";
import PersonaManager from "@/components/sidebar/PersonaManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <PersonaProvider>
      <div className="container mx-auto py-6 space-y-6">
        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">
              Persona Management Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonaManager isDashboard={true} />
          </CardContent>
        </Card>
      </div>
    </PersonaProvider>
  );
};

export { Dashboard };
export default Dashboard;
