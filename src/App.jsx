import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Flame,
  Instagram,
  Mail,
  Sparkles,
} from "lucide-react";

const accent = "#f5b700";

// SWAP THIS: Replace public/joey-profile.jpg with Joey's real uploaded photo.
const profilePhotoUrl = "/joey-profile.jpg";

// SWAP THIS: Replace with Joey's real bio copy.
const bioText =
  "Hey! I'm Brave Spark, a 43-year-old content creator from New York, USA, focused on motivation, mindset, and real-life growth. I create content that goes beyond just inspiration, content that makes people feel seen, challenged, and understood. My approach blends storytelling, humor, vulnerability, and powerful messages to create videos that connect on a human level and leave a lasting impact. Whether it's through relatable moments, cinematic visuals, or honest conversations, my goal is simple: to remind people that being brave doesn't mean having it all together, it means showing up anyway. Let's create content that feels real, sparks emotion, and inspires people to become stronger versions of themselves.";

// SWAP THESE: Replace href values with Joey's actual links.
const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/brave_spark_/",
    icon: Instagram,
    note: "Instagram is ready for Brave Spark.",
  },
  {
    label: "Projects",
    href: "#projects",
    icon: BriefcaseBusiness,
    note: "Featured work placeholder. Add Brave Spark's latest videos, campaigns, or collaborations here.",
  },
  {
    label: "Contact",
    href: "mailto:Bravesparkinsta@gmail.com",
    icon: Mail,
    note: "Email copied. Reach Brave Spark directly for content, collabs, and bookings.",
  },
];

function LinkCard({ href, icon: Icon, label }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("joey-link-selected", {
        detail: { label, href },
      })
    );

    if (navigator.clipboard && href && !href.startsWith("#")) {
      navigator.clipboard.writeText(href).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
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
      {copied ? (
        <Check size={22} className="text-yellow-700" />
      ) : (
        <ArrowUpRight
          size={22}
          className="text-neutral-950 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-yellow-700"
        />
      )}
    </button>
  );
}

export default function App() {
  const year = new Date().getFullYear();
  const [selectedLink, setSelectedLink] = useState(links[0]);
  const [photoReady, setPhotoReady] = useState(Boolean(profilePhotoUrl));

  useEffect(() => {
    function handleSelected(event) {
      const match = links.find((link) => link.label === event.detail.label);
      if (match) setSelectedLink(match);
    }

    window.addEventListener("joey-link-selected", handleSelected);
    return () => window.removeEventListener("joey-link-selected", handleSelected);
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8df] text-neutral-950">
      <section className="relative flex min-h-screen items-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 right-0 h-48 w-48 translate-x-1/3 rounded-full bg-yellow-500/20 blur-3xl" />

        <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_340px] lg:items-center">
          <div className="animate-rise-in text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-950/15 bg-white/55 px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm">
              <Sparkles size={16} color={accent} />
              <span>@brave_spark_</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-balance text-6xl font-black leading-[0.92] tracking-normal text-neutral-950 sm:text-7xl md:text-8xl lg:mx-0">
              Joey Alfandari
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-xl font-medium leading-8 text-neutral-700 sm:text-2xl lg:mx-0">
              Building things. Telling stories. Sparking something.
            </p>
          </div>

          <div className="animate-rise-in mx-auto w-full max-w-[300px] [animation-delay:120ms] lg:max-w-none">
            <div className="relative aspect-square rounded-[32px] border border-neutral-950/15 bg-white p-3 shadow-[0_24px_70px_rgba(23,23,23,0.15)]">
              <div className="absolute -right-4 -top-4 flex size-16 items-center justify-center rounded-full bg-yellow-400 text-neutral-950 shadow-[0_16px_35px_rgba(245,183,0,0.35)]">
                <Flame size={28} fill="currentColor" />
              </div>

              {profilePhotoUrl && photoReady ? (
                <img
                  src={profilePhotoUrl}
                  alt="Joey Alfandari"
                  onError={() => setPhotoReady(false)}
                  className="h-full w-full rounded-[24px] object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#171717_0%,#2b2b2b_48%,#f5b700_100%)] text-center">
                  <div className="rounded-full border border-white/20 bg-white/10 px-8 py-7 text-white backdrop-blur">
                    <div className="text-5xl font-black tracking-normal">JA</div>
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
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="animate-rise-in rounded-[8px] border border-neutral-950/15 bg-white/55 p-6 shadow-[0_14px_45px_rgba(23,23,23,0.07)] [animation-delay:220ms] sm:p-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-700">
              About
            </p>
            <p className="text-lg font-medium leading-8 text-neutral-800">
              {bioText}
            </p>
          </article>

          <div className="animate-rise-in [animation-delay:320ms]">
            <section
              id="projects"
              className="space-y-4"
              aria-label="Joey Alfandari links"
            >
              {links.map((link) => (
                <LinkCard key={link.label} {...link} />
              ))}
            </section>

            <div className="mt-5 rounded-[8px] border border-yellow-700/25 bg-yellow-400/20 p-4 text-sm font-semibold leading-6 text-neutral-800">
              <span className="text-yellow-800">{selectedLink.label}:</span>{" "}
              {selectedLink.note}
              <div className="mt-2 break-all font-mono text-xs font-medium text-neutral-600">
                {selectedLink.href}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8 text-center text-sm font-semibold text-neutral-600 sm:px-8">
        Joey Alfandari · {year} · <span aria-label="spark">🔥</span>
      </footer>
    </main>
  );
}
