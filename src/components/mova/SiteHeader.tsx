import { Link } from "@tanstack/react-router";
import { Briefcase, Bot, Gamepad2, LayoutDashboard, Menu, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { AccessibilitySheet } from "./AccessibilityPanel";

const NAV = [
  { to: "/oportunidades", label: "Oportunidades", icon: Briefcase },
  { to: "/robos", label: "Robôs", icon: Bot },
  { to: "/controle", label: "Central de controle", icon: Gamepad2 },
  { to: "/painel", label: "Meu painel", icon: LayoutDashboard },
  { to: "/impacto", label: "Impacto", icon: Sparkles },
] as const;

const linkCls =
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
const activeCls = "!text-primary bg-primary/10";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className={linkCls} activeProps={{ className: activeCls, "aria-current": "page" }}>
                  <n.icon className="size-4" aria-hidden="true" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <AccessibilitySheet />
          <Button asChild variant="neon" size="sm" className="hidden sm:inline-flex">
            <Link to="/cadastro">
              <UserPlus aria-hidden="true" /> Cadastrar
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="hud" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-border bg-popover">
              <SheetHeader>
                <SheetTitle className="font-display tracking-wider text-primary">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Navegação móvel" className="mt-6">
                <ul className="space-y-1">
                  {[{ to: "/", label: "Início", icon: Sparkles } as const, ...NAV, { to: "/cadastro", label: "Cadastrar", icon: UserPlus } as const].map((n) => (
                    <li key={n.to}>
                      <SheetClose asChild>
                        <Link to={n.to} className={`${linkCls} tap-target text-base`} activeProps={{ className: activeCls }} activeOptions={{ exact: n.to === "/" }}>
                          <n.icon className="size-5" aria-hidden="true" />
                          {n.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
