import type { MDXComponents } from "mdx/types";

const components = {
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-8 text-slate-700">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-r-xl border-l-4 border-teal-600 bg-teal-50 px-5 py-1 text-slate-800">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
