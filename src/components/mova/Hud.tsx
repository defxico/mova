import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HudPanel({
  title,
  code,
  actions,
  children,
  className,
  bodyClassName,
  as: Tag = "section",
  labelledBy,
}: {
  title?: string;
  code?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  as?: "section" | "div" | "article" | "aside";
  labelledBy?: string;
}) {
  const id = labelledBy ?? (title ? `hud-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : undefined);
  return (
    <Tag className={cn("glass hud-frame rounded-lg", className)} aria-labelledby={title ? id : undefined}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <h2 id={id} className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {code && <span className="label-hud hidden sm:inline">{code}</span>}
            {actions}
          </div>
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </Tag>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="relative border-b border-border bg-grid">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between lg:py-14">
        <div className="max-w-3xl">
          <p className="label-hud mb-3 text-primary">// {eyebrow}</p>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          {children && <div className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{children}</div>}
        </div>
        {aside}
      </div>
    </div>
  );
}

export function StatusDot({ tone = "primary", pulse = false }: { tone?: "primary" | "success" | "warning" | "accent" | "muted"; pulse?: boolean }) {
  const toneClass = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    accent: "bg-accent",
    muted: "bg-muted-foreground",
  }[tone];
  return <span className={cn("inline-block size-2.5 rounded-full", toneClass, pulse && "animate-pulse-ring")} aria-hidden="true" />;
}
