import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Sidebar, type NavItem } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Menu, Dumbbell, LogOut } from "lucide-react";

export function AppShell({ items, title }: { items: NavItem[]; title: string }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} title={title} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Gym Evolution</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <div className="px-5 py-5 text-sm font-bold">{title}</div>
              <nav className="space-y-1 px-3">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-accent",
                      )
                    }
                  >
                    <item.icon className="size-4.5" />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  <LogOut className="size-4.5" /> Cerrar sesión
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <p className="mb-1 text-xs text-muted-foreground md:hidden">Hola, {profile?.nombre}</p>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
