import React from "react";
import { PersonaProvider } from "@/contexts/PersonaContext";
import PersonaManager from "@/components/sidebar/PersonaManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <PersonaProvider>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl bg-background">
        <div className="space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Persona Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and customize your AI personas with advanced editing
              capabilities.
            </p>
          </div>

          <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold text-card-foreground">
                Persona Management
              </CardTitle>
              <CardDescription className="text-card-foreground/80">
                Create, edit, and manage your AI assistant personas with
                customizable tone, knowledge domains, and response styles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonaManager isDashboard={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PersonaProvider>
  );
};

export { Dashboard };
export default Dashboard;
