import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clapperboard,
  Instagram,
  Lock,
  Mail,
  Play,
  Save,
  Sparkles,
  Upload,
  X,
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

const adminPassword = "3907";
const dbName = "brave-spark-admin";
const videoStore = "videos";

const defaultVideoSlots = [
  {
    id: 1,
    eyebrow: "Intro Reel",
    title: "Upload video one",
    src: "",
  },
  {
    id: 2,
    eyebrow: "Featured Reel",
    title: "Motivation that hits",
    src: "",
  },
  {
    id: 3,
    eyebrow: "Story Clip",
    title: "Real talk, sharp cut",
    src: "",
  },
];

function openVideoDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(videoStore, { keyPath: "id" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getVideoRecords() {
  const db = await openVideoDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(videoStore, "readonly");
    const request = transaction.objectStore(videoStore).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function getVideoRecord(id) {
  const db = await openVideoDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(videoStore, "readonly");
    const request = transaction.objectStore(videoStore).get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function saveVideoRecord(record) {
  const db = await openVideoDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(videoStore, "readwrite");
    const request = transaction.objectStore(videoStore).put(record);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

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

function IPhoneVideo({ eyebrow, src, title }) {
  const videoRef = useRef(null);

  function openFullscreen() {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  }

  return (
    <article className="group">
      <div className="mx-auto w-full max-w-[280px] rounded-[42px] bg-neutral-950 p-3 shadow-[0_30px_80px_rgba(23,23,23,0.28)] transition duration-300 group-hover:-translate-y-2">
        <div className="relative overflow-hidden rounded-[32px] bg-neutral-900">
          <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-neutral-950" />
          <div className="aspect-[9/16]">
            {src ? (
              <div className="relative h-full bg-black">
                <video
                  ref={videoRef}
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-xs font-black text-neutral-950 shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5"
                >
                  Fullscreen
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_18%,#fff0a3_0%,#f5b700_28%,#161616_72%)] text-neutral-950">
                <div className="flex size-20 items-center justify-center rounded-full bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
                  <Play size={34} fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-[280px]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-950/55">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black leading-tight tracking-normal text-neutral-950">
          {title}
        </h3>
      </div>
    </article>
  );
}

function AdminPanel({
  onClose,
  onSave,
  unlocked,
  setUnlocked,
  videoItems,
}) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const selectedVideo = videoItems.find((video) => video.id === selectedId);
  const [eyebrow, setEyebrow] = useState(selectedVideo?.eyebrow || "");
  const [title, setTitle] = useState(selectedVideo?.title || "");
  const [file, setFile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEyebrow(selectedVideo?.eyebrow || "");
    setTitle(selectedVideo?.title || "");
    setFile(null);
    setSaved(false);
  }, [selectedId, selectedVideo?.eyebrow, selectedVideo?.title]);

  function handlePasswordSubmit(event) {
    event.preventDefault();
    if (password === adminPassword) {
      setUnlocked(true);
      setPasswordError("");
      return;
    }

    setPasswordError("Wrong password.");
  }

  async function handleSave(event) {
    event.preventDefault();
    await onSave({
      eyebrow,
      file,
      id: selectedId,
      title,
    });
    setSaved(true);
    setFile(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/55 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-xl rounded-[12px] border border-neutral-950/15 bg-[#fff8df] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-700">
              Admin
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-normal">
              Video slots
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800"
            aria-label="Close admin panel"
          >
            <X size={20} />
          </button>
        </div>

        {!unlocked ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-neutral-800">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 text-lg font-bold outline-none ring-yellow-500/0 transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
                autoFocus
              />
            </label>
            {passwordError ? (
              <p className="text-sm font-bold text-red-700">{passwordError}</p>
            ) : null}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-neutral-950 px-5 py-4 font-black text-white transition hover:bg-neutral-800"
            >
              <Lock size={18} className="text-yellow-300" />
              Unlock
            </button>
          </form>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {videoItems.map((video) => (
                <button
                  type="button"
                  key={video.id}
                  onClick={() => setSelectedId(video.id)}
                  className={`rounded-[8px] border px-4 py-3 text-left text-sm font-black transition ${
                    selectedId === video.id
                      ? "border-neutral-950 bg-yellow-300"
                      : "border-neutral-950/15 bg-white hover:border-neutral-950"
                  }`}
                >
                  Slot {video.id}
                </button>
              ))}
            </div>

            <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-4 text-sm font-bold text-neutral-800">
              Uploading to <span className="text-yellow-800">Slot {selectedId}</span>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-neutral-800">
                Small label
              </span>
              <input
                type="text"
                value={eyebrow}
                onChange={(event) => setEyebrow(event.target.value)}
                className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-neutral-800">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
              />
            </label>

            <label className="block cursor-pointer rounded-[8px] border border-dashed border-neutral-950/30 bg-white/80 p-5 text-center font-black transition hover:border-neutral-950 hover:bg-white">
              <Upload className="mx-auto mb-2 text-yellow-700" size={24} />
              {file ? file.name : "Choose video for this slot"}
              <input
                type="file"
                accept="video/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>

            {saved ? (
              <p className="text-sm font-bold text-green-700">
                Saved to this browser.
              </p>
            ) : null}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-neutral-950 px-5 py-4 font-black text-white transition hover:bg-neutral-800"
            >
              <Save size={18} className="text-yellow-300" />
              Save Slot {selectedId}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const year = new Date().getFullYear();
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [videoItems, setVideoItems] = useState(defaultVideoSlots);

  useEffect(() => {
    let mounted = true;

    getVideoRecords()
      .then((records) => {
        if (!mounted) return;

        const nextVideos = defaultVideoSlots.map((slot) => {
          const record = records.find((item) => item.id === slot.id);
          if (!record) return slot;

          return {
            ...slot,
            eyebrow: record.eyebrow || slot.eyebrow,
            src: record.blob ? URL.createObjectURL(record.blob) : slot.src,
            title: record.title || slot.title,
          };
        });

        setVideoItems(nextVideos);
      })
      .catch(() => {
        setVideoItems(defaultVideoSlots);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      videoItems.forEach((video) => {
        if (video.src?.startsWith("blob:")) URL.revokeObjectURL(video.src);
      });
    };
  }, [videoItems]);

  async function handleVideoSave({ eyebrow, file, id, title }) {
    const existing = await getVideoRecord(id);
    const blob = file || existing?.blob || null;

    await saveVideoRecord({
      blob,
      eyebrow,
      id,
      title,
    });

    setVideoItems((currentVideos) =>
      currentVideos.map((video) => {
        if (video.id !== id) return video;
        if (video.src?.startsWith("blob:")) URL.revokeObjectURL(video.src);

        return {
          ...video,
          eyebrow,
          src: blob ? URL.createObjectURL(blob) : "",
          title,
        };
      })
    );
  }

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

      <section className="bg-[#f5b700] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-yellow-300 shadow-[0_18px_40px_rgba(23,23,23,0.22)]">
                <Clapperboard size={17} />
                <span>Video Work</span>
              </div>
              <h2 className="max-w-3xl text-5xl font-black leading-none tracking-normal text-neutral-950 sm:text-6xl">
                Built for vertical stories.
              </h2>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {videoItems.map((video) => (
              <IPhoneVideo key={video.id} {...video} />
            ))}
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8 text-center text-sm font-semibold text-neutral-600 sm:px-8">
        Brave Spark · {year} ·{" "}
        <button
          type="button"
          onClick={() => setAdminOpen(true)}
          className="inline-flex rounded-full px-1 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-500/30"
          aria-label="Open video admin"
        >
          🔥
        </button>
      </footer>

      {adminOpen ? (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
          onSave={handleVideoSave}
          setUnlocked={setAdminUnlocked}
          unlocked={adminUnlocked}
          videoItems={videoItems}
        />
      ) : null}
    </main>
  );
}
