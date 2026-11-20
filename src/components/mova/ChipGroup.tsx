import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChipGroup({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
  type = "checkbox",
}: {
  name: string;
  legend: string;
  hint?: string | undefined;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: string | undefined;
  type?: "checkbox" | "radio";
}) {
  const errId = `${name}-erro`;
  const hintId = `${name}-dica`;
  return (
    <fieldset
      id={`campo-${name}`}
      tabIndex={-1}
      aria-invalid={!!error}
      aria-describedby={
        [hint ? hintId : "", error ? errId : ""].filter(Boolean).join(" ") || undefined
      }
      className="rounded-md"
    >
      <legend className="text-sm font-semibold">{legend}</legend>
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o);
          return (
            <label
              key={o}
              className={cn(
                "tap-target inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                checked
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface/60 hover:border-primary/60",
              )}
            >
              <input
                type={type}
                name={name}
                value={o}
                checked={checked}
                onChange={() => {
                  if (type === "radio") onChange([o]);
                  else onChange(checked ? value.filter((v) => v !== o) : [...value, o]);
                }}
                className="sr-only"
              />
              {checked && <Check className="size-4" aria-hidden="true" />}
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errId} role="alert" className="mt-2 text-sm font-medium text-accent">
          ⚠ {error}
        </p>
      )}
    </fieldset>
  );
}
