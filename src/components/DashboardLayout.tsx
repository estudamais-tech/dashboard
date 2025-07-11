import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div
        className="w-[80%] h-[65vh] rounded-[50%] bg-[#00A895] absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
        style={{ filter: "blur(400px)", opacity: 0.8 }} // Adicionado opacity
      ></div>
      {/* Adicionando o efeito de linhas e grão ao div principal */}
      <div 
        className="min-h-screen flex w-full relative overflow-hidden 
                   bg-white bg-grid-light bg-grid 
                   dark:bg-[#000000] dark:bg-grid-dark dark:bg-grid  " 
        style={{ backgroundSize: '45px 45px' }} 
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(https://beserragoadv.com/images/Grain-effect-3.gif)',
            backgroundPosition: '0px 0px',
            backgroundSize: 'auto',
            mixBlendMode: 'overlay',
            opacity: 0.10,
            
          }}
        ></div>

        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 z-10"> 
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}