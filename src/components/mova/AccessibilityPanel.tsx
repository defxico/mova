import { useEffect } from "react";
import { toast } from "sonner";
import {
  Accessibility,
  Contrast,
  Hand,
  Keyboard,
  MousePointerClick,
  RotateCcw,
  ScanLine,
  Type,
  Wind,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { acoes, useMova, type ModoControle, type PreferenciasA11y } from "@/lib/mova-store";
import { cn } from "@/lib/utils";

/** Applies the saved accessibility preferences to <html>. Mounted once in the root. */
export function A11yApplier() {
  const a = useMova((s) => s.a11y);
  useEffect(() => {
    const el = document.documentElement;
    el.style.setProperty("--font-scale", String(a.escalaFonte));
    el.classList.toggle("a11y-contrast", a.altoContraste);
    el.classList.toggle("a11y-readable", a.fonteLegivel);
    el.classList.toggle("a11y-reduce-motion", a.reduzirMovimento);
    el.classList.toggle("a11y-large-targets", a.alvosGrandes);
  }, [a]);
  return null;
}

const ESCALAS: PreferenciasA11y["escalaFonte"][] = [1, 1.15, 1.3, 1.5];

const MODOS: { valor: ModoControle; titulo: string; desc: string; icon: typeof Hand }[] = [
  {
    valor: "clique",
    titulo: "Toque único",
    desc: "Cada toque move um passo.",
    icon: MousePointerClick,
  },
  {
    valor: "segurar",
    titulo: "Pressionar e segurar",
    desc: "O robô anda enquanto o botão estiver pressionado.",
    icon: Hand,
  },
  {
    valor: "varredura",
    titulo: "Varredura (acionador único)",
    desc: "Os controles se destacam um por vez; aperte Espaço ou um acionador para escolher.",
    icon: ScanLine,
  },
];

function Toggle({
  id,
  label,
  desc,
  icon: Icon,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  desc: string;
  icon: typeof Hand;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-surface/60 p-3">
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <Label htmlFor={id} className="text-sm font-semibold text-foreground">
            {label}
          </Label>
          <p id={`${id}-desc`} className="text-xs text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-describedby={`${id}-desc`}
      />
    </div>
  );
}

export function AccessibilityPanel({ compact = false }: { compact?: boolean }) {
  const a = useMova((s) => s.a11y);
  const set = (p: Partial<PreferenciasA11y>) => acoes.atualizarA11y(p);

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Type className="size-4 text-primary" aria-hidden="true" /> Tamanho do texto
        </legend>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Tamanho do texto">
          {ESCALAS.map((e) => (
            <button
              key={e}
              type="button"
              role="radio"
              aria-checked={a.escalaFonte === e}
              onClick={() => set({ escalaFonte: e })}
              className={cn(
                "tap-target rounded-md border px-2 py-2 font-mono text-sm transition-colors",
                a.escalaFonte === e
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border hover:border-primary/60",
              )}
            >
              {Math.round(e * 100)}%
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Toggle
          id="a11y-contraste"
          label="Alto contraste"
          desc="Fundo preto puro, textos brancos e bordas mais fortes."
          icon={Contrast}
          checked={a.altoContraste}
          onChange={(v) => set({ altoContraste: v })}
        />
        <Toggle
          id="a11y-legivel"
          label="Fonte de alta legibilidade"
          desc="Troca as fontes futuristas por Atkinson Hyperlegible."
          icon={Type}
          checked={a.fonteLegivel}
          onChange={(v) => set({ fonteLegivel: v })}
        />
        <Toggle
          id="a11y-movimento"
          label="Reduzir animações"
          desc="Desliga brilhos pulsantes, varreduras e transições."
          icon={Wind}
          checked={a.reduzirMovimento}
          onChange={(v) => set({ reduzirMovimento: v })}
        />
        <Toggle
          id="a11y-alvos"
          label="Botões maiores"
          desc="Aumenta a área de toque de botões e controles."
          icon={Hand}
          checked={a.alvosGrandes}
          onChange={(v) => set({ alvosGrandes: v })}
        />
        <Toggle
          id="a11y-atalhos"
          label="Atalhos de teclado no controle"
          desc="Setas ou W A S D movem o robô; Esc aciona a parada de emergência."
          icon={Keyboard}
          checked={a.atalhosTeclado}
          onChange={(v) => set({ atalhosTeclado: v })}
        />
      </div>

      <fieldset>
        <legend className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Accessibility className="size-4 text-primary" aria-hidden="true" /> Forma de controlar o
          robô
        </legend>
        <div
          className={cn("grid gap-2", !compact && "sm:grid-cols-1")}
          role="radiogroup"
          aria-label="Forma de controlar o robô"
        >
          {MODOS.map((m) => (
            <button
              key={m.valor}
              type="button"
              role="radio"
              aria-checked={a.modoControle === m.valor}
              onClick={() => set({ modoControle: m.valor })}
              className={cn(
                "tap-target flex items-start gap-3 rounded-md border p-3 text-left transition-colors",
                a.modoControle === m.valor
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/60",
              )}
            >
              <m.icon
                className={cn(
                  "mt-0.5 size-5 shrink-0",
                  a.modoControle === m.valor ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span>
                <span className="block text-sm font-semibold">{m.titulo}</span>
                <span className="block text-xs text-muted-foreground">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
        {a.modoControle === "varredura" && (
          <div className="mt-3">
            <Label htmlFor="a11y-intervalo" className="text-sm">
              Velocidade da varredura: {(a.intervaloVarredura / 1000).toFixed(1)} s por controle
            </Label>
            <input
              id="a11y-intervalo"
              type="range"
              min={600}
              max={3000}
              step={200}
              value={a.intervaloVarredura}
              onChange={(e) => set({ intervaloVarredura: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--primary)]"
            />
          </div>
        )}
      </fieldset>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          acoes.resetarA11y();
          toast.success("Preferências de acessibilidade restauradas.");
        }}
      >
        <RotateCcw aria-hidden="true" /> Restaurar padrão
      </Button>
    </div>
  );
}

export function AccessibilitySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="hud" size="sm" aria-label="Abrir configurações de acessibilidade">
          <Accessibility aria-hidden="true" />
          <span className="hidden md:inline">Acessibilidade</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto border-border bg-popover sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display tracking-wider text-primary">
            Acessibilidade
          </SheetTitle>
          <SheetDescription>
            As preferências ficam salvas neste dispositivo e valem para todas as telas.
          </SheetDescription>
        </SheetHeader>
        <AccessibilityPanel compact />
      </SheetContent>
    </Sheet>
  );
}
