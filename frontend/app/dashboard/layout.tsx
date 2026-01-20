import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Noise Overlay applied here specifically if not global, but global one exists in root layout. 
          The simplified global layout might not catch 'dashboard' specific nuances if stripped down too much.
          But root layout wrapper has noise-overlay div commented out in my previous read? 
          No, it was in Home page.tsx. The root layout is clean.
      */}

            {/* Re-adding noise overlay for dashboard consistency */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <Sidebar />

            <main className="pl-64 min-h-screen relative z-10">
                <div className="container mx-auto p-8 max-w-7xl animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}
