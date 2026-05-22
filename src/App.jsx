import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  ArrowUpRight,
  Clapperboard,
  Instagram,
  Lock,
  Maximize2,
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
  "I'm Brave Spark, a Long Island, New York creator making motivation feel human again.",
  "My work mixes storytelling, humor, vulnerability, and sharp real-life messages for people who want more than empty inspiration.",
  "Brave does not mean polished. Brave means showing up, telling the truth, and turning real moments into content that actually lands.",
  "If it feels honest, cinematic, and a little uncomfortable in the right way, that's the spark.",
];

// SWAP THESE: Replace href values with Joey's actual links.
const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/brave_spark_/",
    icon: Instagram,
  },
];

const adminPasswords = new Set(["3907", "joey"]);

function isAdminPassword(value) {
  return adminPasswords.has(String(value || "").trim().toLowerCase());
}

const defaultVideoSlots = [
  {
    id: 1,
    eyebrow: "Intro Reel",
    title: "Upload video one",
    poster: "",
    src: "",
  },
  {
    id: 2,
    eyebrow: "Featured Reel",
    title: "Motivation that hits",
    poster: "",
    src: "",
  },
  {
    id: 3,
    eyebrow: "Story Clip",
    title: "Real talk, sharp cut",
    poster: "",
    src: "",
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

function IPhoneVideo({ eyebrow, onOpen, poster, src, title }) {
  return (
    <article className="group">
      <div className="mx-auto w-full max-w-[320px] rounded-[46px] bg-neutral-950 p-3 shadow-[0_30px_80px_rgba(23,23,23,0.28)] transition duration-300 group-hover:-translate-y-2">
        <div className="relative overflow-hidden rounded-[32px] bg-neutral-900">
          <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-neutral-950" />
          <div className="aspect-[9/16]">
            {src ? (
              <div className="relative h-full bg-black">
                <video
                  src={src}
                  poster={poster || undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={onOpen}
                  className="absolute right-4 top-8 flex size-10 items-center justify-center rounded-full bg-white text-neutral-950 shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5"
                  aria-label={`Open ${title}`}
                >
                  <Maximize2 size={17} />
                </button>
              </div>
            ) : (
              <div
                className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_18%,#fff0a3_0%,#f5b700_28%,#161616_72%)] bg-cover bg-center text-neutral-950"
                style={poster ? { backgroundImage: `url(${poster})` } : undefined}
              >
                <div className="flex size-20 items-center justify-center rounded-full bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
                  <Play size={34} fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-[320px]">
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

function VideoLightbox({ onClose, video }) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white text-neutral-950 transition hover:-translate-y-0.5"
        aria-label="Close video"
      >
        <X size={22} />
      </button>
      <div className="h-full max-h-[88vh] w-full max-w-5xl">
        <video
          src={video.src}
          poster={video.poster || undefined}
          controls
          autoPlay
          playsInline
          className="h-full w-full rounded-[12px] bg-black object-contain"
        />
      </div>
    </div>
  );
}

function AdminPanel({
  onClose,
  onAdd,
  onSave,
  unlocked,
  setUnlocked,
  videoItems,
}) {
  const frameVideoRef = useRef(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const selectedVideo = videoItems.find((video) => video.id === selectedId);
  const [eyebrow, setEyebrow] = useState(selectedVideo?.eyebrow || "");
  const [title, setTitle] = useState(selectedVideo?.title || "");
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [poster, setPoster] = useState(selectedVideo?.poster || "");
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setEyebrow(selectedVideo?.eyebrow || "");
    setTitle(selectedVideo?.title || "");
    setFile(null);
    setPoster(selectedVideo?.poster || "");
    setSaved(false);
    setSaveError("");
  }, [selectedId, selectedVideo?.eyebrow, selectedVideo?.poster, selectedVideo?.title]);

  useEffect(() => {
    if (!file) {
      setFilePreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setFilePreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  function handlePasswordSubmit(event) {
    event.preventDefault();
    if (isAdminPassword(password)) {
      setUnlocked(true);
      setPasswordError("");
      return;
    }

    setPasswordError("Wrong password.");
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);

    try {
      await onSave({
        eyebrow,
        file,
        id: selectedId,
        password,
        poster,
        title,
      });
      setSaved(true);
      setFile(null);
    } catch (error) {
      setSaveError(error?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function captureCurrentFrame() {
    const video = frameVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setSaveError("Load the video first, then choose a frame.");
      return;
    }

    const canvas = document.createElement("canvas");
    const maxWidth = 720;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPoster(canvas.toDataURL("image/jpeg", 0.82));
    setSaveError("");
  }

  async function handleAddSlot() {
    setAdding(true);
    setSaveError("");
    setSaved(false);

    try {
      const addedId = await onAdd(password);
      setSelectedId(addedId);
    } catch (error) {
      setSaveError(error?.message || "Could not add iPhone.");
    } finally {
      setAdding(false);
    }
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
            <button
              type="button"
              onClick={handleAddSlot}
              disabled={adding}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-neutral-950/20 bg-white px-5 py-3 font-black text-neutral-950 transition hover:-translate-y-0.5 hover:border-neutral-950 disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add iPhone"}
            </button>

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
                onChange={(event) => {
                  setFile(event.target.files?.[0] || null);
                  setPoster("");
                }}
                className="sr-only"
              />
            </label>

            {filePreviewUrl ? (
              <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-4">
                <video
                  ref={frameVideoRef}
                  src={filePreviewUrl}
                  controls
                  playsInline
                  className="mx-auto aspect-[9/16] max-h-[320px] rounded-[8px] bg-black object-contain"
                />
                <button
                  type="button"
                  onClick={captureCurrentFrame}
                  className="mt-3 w-full rounded-[8px] bg-yellow-300 px-4 py-3 font-black text-neutral-950 transition hover:-translate-y-0.5"
                >
                  Use Current Frame as Thumbnail
                </button>
              </div>
            ) : null}

            {poster ? (
              <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-4">
                <p className="mb-3 text-sm font-black text-neutral-800">
                  Thumbnail
                </p>
                <img
                  src={poster}
                  alt="Selected video thumbnail"
                  className="h-28 w-full rounded-[8px] object-cover"
                />
              </div>
            ) : null}

            {saved ? (
              <p className="text-sm font-bold text-green-700">
                Saved live for everyone.
              </p>
            ) : null}
            {saveError ? (
              <p className="text-sm font-bold text-red-700">{saveError}</p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-neutral-950 px-5 py-4 font-black text-white transition hover:bg-neutral-800"
            >
              <Save size={18} className="text-yellow-300" />
              {saving ? "Saving..." : `Save Slot ${selectedId}`}
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
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoItems, setVideoItems] = useState(defaultVideoSlots);
  const [storageMessage, setStorageMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/videos", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        if (data.videos) setVideoItems(data.videos);
        if (data.error) setStorageMessage(data.error);
      })
      .catch(() => {
        if (mounted) setVideoItems(defaultVideoSlots);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleVideoSave({ eyebrow, file, id, password, poster, title }) {
    let uploadedUrl;

    if (file) {
      const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
      const blob = await upload(`brave-spark/videos/slot-${id}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        multipart: true,
        clientPayload: JSON.stringify({
          eyebrow,
          id,
          password,
          title,
        }),
      });
      uploadedUrl = blob.url;
    }

    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eyebrow,
        id,
        password,
        poster,
        src: uploadedUrl,
        title,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not save video.");
    }
    setVideoItems(data.videos || defaultVideoSlots);
  }

  async function handleAddVideoSlot(password) {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "add",
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not add iPhone.");
    }

    setVideoItems(data.videos || defaultVideoSlots);
    return data.addedId;
  }

  function openAdmin() {
    setAdminUnlocked(false);
    setAdminOpen(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8df] text-neutral-950">
      <section className="relative px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-yellow-500/25 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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

      <section className="px-5 pb-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <article className="animate-rise-in rounded-[8px] border border-neutral-950/15 bg-white/70 p-6 shadow-[0_14px_45px_rgba(23,23,23,0.07)] [animation-delay:220ms] sm:p-8">
            <div className="space-y-5 text-lg font-medium leading-8 text-neutral-800">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#f5b700] px-5 py-16 sm:px-8 lg:px-10">
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
              <IPhoneVideo
                key={video.id}
                {...video}
                onOpen={() => setActiveVideo(video)}
              />
            ))}
          </div>
          {storageMessage ? (
            <p className="mt-8 text-sm font-bold text-neutral-950/65">
              {storageMessage}
            </p>
          ) : null}
        </div>
      </section>

      <footer className="px-5 pb-8 text-center text-sm font-semibold text-neutral-600 sm:px-8">
        Brave Spark · {year} ·{" "}
        <button
          type="button"
          onClick={openAdmin}
          className="inline-flex rounded-full px-1 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-500/30"
          aria-label="Open video admin"
        >
          🔥
        </button>
      </footer>

      {adminOpen ? (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
          onAdd={handleAddVideoSlot}
          onSave={handleVideoSave}
          setUnlocked={setAdminUnlocked}
          unlocked={adminUnlocked}
          videoItems={videoItems}
        />
      ) : null}
      <VideoLightbox
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </main>
  );
}
