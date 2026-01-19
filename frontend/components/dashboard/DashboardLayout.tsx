import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="wrapper py-10 space-y-10">
        <header className="flex items-end justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              CVision Workspace
            </h1>
            <p className="text-muted-foreground">
              AI-powered resume intelligence
            </p>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
