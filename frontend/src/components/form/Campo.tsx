import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controle =
  "mt-2 block w-full border-b bg-transparent py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground aria-invalid:border-destructive";

interface Base {
  id: string;
  label: string;
  erro?: string;
}

function Moldura({ id, label, erro, children }: Base & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}

const acessibilidade = (id: string, erro?: string) => ({
  "aria-invalid": erro ? true : undefined,
  "aria-describedby": erro ? `${id}-erro` : undefined,
});

export function Campo({
  id,
  label,
  erro,
  ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Moldura id={id} label={label} erro={erro}>
      <input
        id={id}
        className={controle}
        {...acessibilidade(id, erro)}
        {...props}
      />
    </Moldura>
  );
}

export function CampoTexto({
  id,
  label,
  erro,
  ...props
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Moldura id={id} label={label} erro={erro}>
      <textarea
        id={id}
        className={`${controle} min-h-28 resize-y`}
        {...acessibilidade(id, erro)}
        {...props}
      />
    </Moldura>
  );
}

export function CampoSelect({
  id,
  label,
  erro,
  children,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Moldura id={id} label={label} erro={erro}>
      <select
        id={id}
        className={`${controle} cursor-pointer`}
        {...acessibilidade(id, erro)}
        {...props}
      >
        {children}
      </select>
    </Moldura>
  );
}
