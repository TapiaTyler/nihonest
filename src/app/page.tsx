const principles = [
  {
    title: "Understand what matters",
    description:
      "Clear explanations will help connect official processes, practical steps, and the terms you will encounter.",
  },
  {
    title: "Follow reliable sources",
    description:
      "Important guidance will point back to the authorities responsible for the rules and procedures.",
  },
  {
    title: "Use it without an account",
    description:
      "The public knowledgebase will remain freely accessible. Personal features will always be optional.",
  },
];

export default function Home() {
  return (
    <>
      <section className="page-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow">A clearer path through life in Japan</p>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Find your place in Japan.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
            Nihonest is becoming a calm, practical knowledgebase for people preparing to move to Japan and those already building a life there.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-teal-800 px-6 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            Explore student guides
          </Link>
        </div>

        <aside className="rounded-3xl border border-teal-900/10 bg-teal-950 p-7 text-teal-50 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.55)] sm:p-9" aria-labelledby="foundation-status">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">Foundation in progress</p>
          <h2 id="foundation-status" className="mt-4 text-2xl font-semibold tracking-tight text-white">
            Built public first.
          </h2>
          <p className="mt-4 leading-7 text-teal-100/80">
            A complete student-arrival collection now covers planning, immigration, arrival documents, essential registrations, and settling into daily life.
          </p>
        </aside>
      </section>

      <section className="border-y border-slate-200 bg-white" aria-labelledby="what-to-expect">
        <div className="page-shell py-16 sm:py-20">
          <p className="eyebrow">What to expect</p>
          <h2 id="what-to-expect" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Useful information, presented with care.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <article key={principle.title} className="rounded-2xl border border-slate-200 bg-stone-50 p-6">
                <p className="text-sm font-semibold text-teal-700">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{principle.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
import Link from "next/link";
