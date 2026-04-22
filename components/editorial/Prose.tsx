// Shared long-form reading wrapper for the /about editorial pages.
// Applies the design-system §Typography rules via Tailwind child-selector
// utilities so the three page files stay focused on content, not styling.
// If a new editorial long-form page ships, use this wrapper.

export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <article
      className={[
        "max-w-[640px] mx-auto px-6 sm:px-8 py-16 sm:py-20",
        // Headings
        "[&_h2]:font-display [&_h2]:text-h2 [&_h2]:font-bold [&_h2]:text-ink [&_h2]:tracking-tight [&_h2]:mt-16 [&_h2]:mb-5 [&_h2]:leading-[1.15]",
        "[&_h3]:font-display [&_h3]:text-h3 [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-3",
        "[&_h4]:font-display [&_h4]:text-h4 [&_h4]:font-semibold [&_h4]:text-ink [&_h4]:mt-6 [&_h4]:mb-2",
        // Body
        "[&_p]:text-body-lg [&_p]:text-ink [&_p]:leading-[1.7] [&_p]:mb-5",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-body-lg [&_ul]:text-ink [&_ul]:space-y-2 [&_ul]:mb-6",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-body-lg [&_ol]:text-ink [&_ol]:space-y-2 [&_ol]:mb-6",
        "[&_li]:leading-[1.65]",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_em]:italic",
        // Links
        "[&_a]:text-rust [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-stone hover:[&_a]:decoration-rust hover:[&_a]:text-ember [&_a]:transition-colors",
        // Rules
        "[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-stone [&_hr]:my-16",
        // Tables
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:text-body",
        "[&_thead]:border-b [&_thead]:border-stone",
        "[&_th]:text-micro [&_th]:font-bold [&_th]:tracking-[0.12em] [&_th]:uppercase [&_th]:text-stone-deep [&_th]:text-left [&_th]:py-3 [&_th]:pr-4",
        "[&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_td]:text-body [&_td]:text-ink [&_td]:border-b [&_td]:border-stone/60",
      ].join(" ")}
    >
      {children}
    </article>
  );
}
