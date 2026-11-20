import { rotuloCompatibilidade } from "@/lib/matching";
import { cn } from "@/lib/utils";

export function CompatMeter({ score, ativo }: { score: number; ativo: boolean }) {
  if (!ativo) return null;
  const r = rotuloCompatibilidade(score);
  const tone = r === "alta" ? "bg-success" : r === "média" ? "bg-warning" : "bg-muted-foreground";
  const text =
    r === "alta" ? "text-success" : r === "média" ? "text-warning" : "text-muted-foreground";
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="label-hud">Compatibilidade</span>
        <span className={cn("font-mono text-sm font-semibold", text)}>
          {score}% · {r}
        </span>
      </div>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-label="Compatibilidade com seu perfil"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${score}%, compatibilidade ${r}`}
      >
        <div
          className={cn("h-full rounded-full transition-all", tone)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
