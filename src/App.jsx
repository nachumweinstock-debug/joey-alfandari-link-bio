import {
  ArrowUpRight,
  Flame,
  Instagram,
  Mail,
  Sparkles,
} from "lucide-react";

const accent = "#f5b700";

// SWAP THIS: Replace public/joey-profile.jpg with Joey's real uploaded photo.
const profilePhotoUrl = "/joey-profile.jpg";

// SWAP THIS: Replace with Joey's real bio copy.
const bioParagraphs = [
  "Hey! I'm Brave Spark, a 43-year-old content creator from New York, USA, focused on motivation, mindset, and real-life growth.",
  "I create content that goes beyond just inspiration, content that makes people feel seen, challenged, and understood. My approach blends storytelling, humor, vulnerability, and powerful messages to create videos that connect on a human level and leave a lasting impact.",
  "Whether it's through relatable moments, cinematic visuals, or honest conversations, my goal is simple: to remind people that being brave doesn't mean having it all together, it means showing up anyway.",
  "Let's create content that feels real, sparks emotion, and inspires people to become stronger versions of themselves.",
];

// SWAP THESE: Replace href values with Joey's actual links.
const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/brave_spark_/",
    icon: Instagram,
  },
  {
    label: "Contact",
    href: "mailto:Bravesparkinsta@gmail.com",
    icon: Mail,
  },
];

function LinkCard({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      className="group flex min-h-[70px] items-center justify-between rounded-[8px] border border-neutral-900/15 bg-white/75 px-5 py-4 text-left shadow-[0_12px_35px_rgba(23,23,23,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-neutral-950 hover:bg-white hover:shadow-[0_18px_45px_rgba(23,23,23,0.12)] focus:outline-none focus:ring-4 focus:ring-yellow-500/30"
    >
      <span className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-yellow-400 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <span className="text-base font-semibold tracking-[0.01em] text-neutral-950 sm:text-lg">
          {label}
        </span>
      </span>
      <ArrowUpRight
        size={22}
        className="text-neutral-950 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-yellow-700"
      />
    </a>
  );
}

export default function App() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8df] text-neutral-950">
      <section className="relative px-5 py-10 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-yellow-500/25 blur-3xl" />

        <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl content-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="animate-rise-in text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-950/15 bg-white/55 px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm">
              <Sparkles size={16} color={accent} />
              <span>@brave_spark_</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-neutral-950 sm:text-6xl md:text-7xl lg:mx-0">
              Brave Spark
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-balance text-xl font-semibold leading-8 text-neutral-700 sm:text-2xl lg:mx-0">
              Motivation, mindset, and real-life growth with a human punch.
            </p>

            <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2 lg:mx-0">
              {links.map((link) => (
                <LinkCard key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div className="animate-rise-in mx-auto w-full [animation-delay:120ms]">
            <div className="relative rounded-[28px] border border-neutral-950/15 bg-white p-3 shadow-[0_24px_70px_rgba(23,23,23,0.15)]">
              <div className="absolute -right-4 -top-4 z-10 flex size-16 items-center justify-center rounded-full bg-yellow-400 text-neutral-950 shadow-[0_16px_35px_rgba(245,183,0,0.35)]">
                <Flame size={28} fill="currentColor" />
              </div>

              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Brave Spark"
                  className="aspect-[1596/656] h-auto w-full rounded-[20px] object-contain"
                />
              ) : (
                <div className="flex aspect-[1596/656] w-full items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#171717_0%,#2b2b2b_48%,#f5b700_100%)] text-center">
                  <div className="rounded-full border border-white/20 bg-white/10 px-8 py-7 text-white backdrop-blur">
                    <div className="text-5xl font-black tracking-normal">BS</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-white/75">
                      Photo
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <article className="animate-rise-in rounded-[8px] border border-neutral-950/15 bg-white/70 p-6 shadow-[0_14px_45px_rgba(23,23,23,0.07)] [animation-delay:220ms] sm:p-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-700">
              About
            </p>
            <div className="space-y-5 text-lg font-medium leading-8 text-neutral-800">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <footer className="px-5 pb-8 text-center text-sm font-semibold text-neutral-600 sm:px-8">
        Brave Spark · {year} · <span aria-label="spark">🔥</span>
      </footer>
    </main>
  );
}
