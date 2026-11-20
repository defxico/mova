import { Link } from "@tanstack/react-router";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-display font-bold tracking-[0.25em]">MOVA</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Mobilidade, Oportunidade, Voz e Autonomia. Protótipo CitizenTech — Global Solution 2026.
            Robôs, empresas e vagas desta demonstração são simulados.
          </p>
        </div>
        <nav aria-label="Plataforma">
          <h2 className="label-hud mb-3">Plataforma</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/oportunidades" className="hover:text-primary">
                Oportunidades
              </Link>
            </li>
            <li>
              <Link to="/robos" className="hover:text-primary">
                Central de robôs
              </Link>
            </li>
            <li>
              <Link to="/controle" className="hover:text-primary">
                Simulador de controle
              </Link>
            </li>
            <li>
              <Link to="/painel" className="hover:text-primary">
                Painel profissional
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Projeto">
          <h2 className="label-hud mb-3">Projeto</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/impacto" className="hover:text-primary">
                Impacto e ODS
              </Link>
            </li>
            <li>
              <Link to="/cadastro" className="hover:text-primary">
                Cadastro inclusivo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center font-mono text-xs text-muted-foreground">
        A tecnologia não deve adaptar as pessoas ao mercado de trabalho. Deve transformar o mercado
        para que mais pessoas participem.
      </div>
    </footer>
  );
}
