import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  ArrowUpRight,
  Clapperboard,
  Eye,
  EyeOff,
  GripVertical,
  Instagram,
  Link as LinkIcon,
  Loader2,
  Lock,
  Mail,
  Maximize2,
  Play,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const accent = "#f5b700";

const defaultSiteSettings = {
  profilePhotoUrl: "/profile-photo.jpg",
  handle: "@brave_spark_",
  name: "Brave Spark",
  tagline: "Motivation, mindset, and real-life growth with a human punch.",
  metaTitle: "Brave Spark | @brave_spark_",
  metaDescription:
    "Brave Spark, @brave_spark_, motivation, mindset, and creative video work.",
  videoEyebrow: "Video Work",
  videoHeadline: "Built for vertical stories.",
  links: [
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/brave_spark_/",
      variant: "light",
    },
    {
      id: "contact",
      label: "Contact",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSc_jZ6p4xNrtJxUqtxWcUkvZHlnmYXX48O3-wG4J_oe5H0Oug/viewform?usp=publish-editor",
      variant: "dark",
    },
  ],
  bio: [
    "I'm Brave Spark, a Long Island, New York creator making motivation feel human again.",
    "My work mixes storytelling, humor, vulnerability, and sharp real-life messages for people who want more than empty inspiration.",
    "Brave does not mean polished. Brave means showing up, telling the truth, and turning real moments into content that actually lands.",
    "If it feels honest, cinematic, and a little uncomfortable in the right way, that's the spark.",
  ].join("\n\n"),
};

function getBioParagraphs(bio) {
  return String(bio || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const defaultVideoSlots = [
  {
    id: 1,
    hidden: false,
    order: 1,
    title: "Upload video one",
    poster: "",
    src: "",
  },
  {
    id: 2,
    hidden: false,
    order: 2,
    title: "Motivation that hits",
    poster: "",
    src: "",
  },
  {
    id: 3,
    hidden: false,
    order: 3,
    title: "Real talk, sharp cut",
    poster: "",
    src: "",
  },
];

function getLinkIcon(link) {
  const key = `${link.id || ""} ${link.label || ""}`.toLowerCase();
  if (key.includes("instagram")) return Instagram;
  if (key.includes("contact") || key.includes("mail") || key.includes("email")) return Mail;
  return LinkIcon;
}

function normalizeLink(link, index) {
  return {
    id: link.id || `link-${Date.now()}-${index}`,
    label: link.label || `Link ${index + 1}`,
    url: link.url || "#",
    variant: link.variant === "dark" ? "dark" : "light",
  };
}

function Spinner() {
  return <Loader2 size={18} className="animate-spin" />;
}

function LinkCard({ icon: Icon, label, url, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`group flex min-h-[70px] items-center justify-between rounded-[8px] border px-5 py-4 text-left shadow-[0_12px_35px_rgba(23,23,23,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(23,23,23,0.12)] focus:outline-none focus:ring-4 focus:ring-yellow-500/30 ${
        isDark
          ? "border-yellow-300 bg-black text-yellow-300 hover:bg-black"
          : "border-neutral-900/15 bg-white/75 text-neutral-950 hover:border-neutral-950 hover:bg-white"
      }`}
    >
      <span className="flex items-center gap-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105 ${
            isDark ? "bg-yellow-300 text-neutral-950" : "bg-neutral-950 text-yellow-400"
          }`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <span className="text-base font-semibold tracking-[0.01em] sm:text-lg">
          {label}
        </span>
      </span>
      <ArrowUpRight
        size={22}
        className={`transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
          isDark ? "text-yellow-300" : "text-neutral-950 group-hover:text-yellow-700"
        }`}
      />
    </a>
  );
}

function IPhoneVideo({ onOpen, poster, src, title }) {
  const hasPoster = Boolean(poster);
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
                style={hasPoster ? { backgroundImage: `url(${poster})` } : undefined}
              >
                {!hasPoster ? (
                  <div className="text-center">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
                      <Play size={34} fill="currentColor" />
                    </div>
                    <p className="mt-4 text-xl font-black">Brave Spark</p>
                  </div>
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-white/95 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
                    <Play size={34} fill="currentColor" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-[320px]">
        <h3 className="text-2xl font-black leading-tight tracking-normal text-neutral-950">
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
  onDelete,
  onReorder,
  onSave,
  onSaveSettings,
  onToggleHidden,
  onUploadAsset,
  settings,
  unlocked,
  setUnlocked,
  videoItems,
}) {
  const frameVideoRef = useRef(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const selectedVideo = videoItems.find((video) => video.id === selectedId);
  const [title, setTitle] = useState(selectedVideo?.title || "");
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [poster, setPoster] = useState(selectedVideo?.poster || "");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);
  const [saveError, setSaveError] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [handle, setHandle] = useState(settings.handle);
  const [links, setLinks] = useState(settings.links || defaultSiteSettings.links);
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription);
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle);
  const [name, setName] = useState(settings.name);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(settings.profilePhotoUrl);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [tagline, setTagline] = useState(settings.tagline);
  const [bio, setBio] = useState(settings.bio);
  const [toast, setToast] = useState(null);
  const [videoEyebrow, setVideoEyebrow] = useState(settings.videoEyebrow);
  const [videoHeadline, setVideoHeadline] = useState(settings.videoHeadline);
  const bioParagraphs = getBioParagraphs(bio);

  useEffect(() => {
    setTitle(selectedVideo?.title || "");
    setFile(null);
    setPoster(selectedVideo?.poster || "");
    setSaveError("");
    setUploadProgress(0);
  }, [selectedId, selectedVideo?.poster, selectedVideo?.title]);

  useEffect(() => {
    setHandle(settings.handle);
    setLinks(settings.links || defaultSiteSettings.links);
    setMetaDescription(settings.metaDescription);
    setMetaTitle(settings.metaTitle);
    setName(settings.name);
    setProfilePhotoUrl(settings.profilePhotoUrl);
    setTagline(settings.tagline);
    setBio(settings.bio);
    setVideoEyebrow(settings.videoEyebrow);
    setVideoHeadline(settings.videoHeadline);
    setSettingsError("");
  }, [settings]);

  useEffect(() => {
    if (!file) {
      setFilePreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setFilePreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(profileFile);
    setProfilePreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [profileFile]);

  function showToast(type, message) {
    setToast({ id: Date.now(), message, type });
  }

  function draftSettings() {
    return {
      bio,
      handle,
      links: links.map(normalizeLink),
      metaDescription,
      metaTitle,
      name,
      profilePhotoUrl: profilePreviewUrl || profilePhotoUrl,
      tagline,
      videoEyebrow,
      videoHeadline,
    };
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError("");
    const nextPassword = password.trim();
    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: nextPassword }),
      });
      if (!response.ok) throw new Error("Wrong password.");
      setPassword(nextPassword);
      setUnlocked(true);
      showToast("success", "Admin unlocked.");
    } catch (error) {
      setPasswordError(error.message || "Wrong password.");
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const nextTitle = title.trim() || selectedVideo?.title || `Video ${selectedId}`;

      await onSave({
        file,
        hidden: Boolean(selectedVideo?.hidden),
        id: selectedId,
        password,
        poster,
        setUploadProgress,
        title: nextTitle,
      });
      setTitle(nextTitle);
      setFile(null);
      showToast("success", "Video saved live.");
    } catch (error) {
      const message = error?.message || "Save failed.";
      setSaveError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function handleSettingsSave(event) {
    event.preventDefault();
    setSettingsSaving(true);
    setSettingsError("");

    try {
      let nextProfilePhotoUrl = profilePhotoUrl;
      if (profileFile) {
        nextProfilePhotoUrl = await onUploadAsset(profileFile, password, setProfileProgress);
      }
      await onSaveSettings({
        bio,
        handle,
        links: links.map(normalizeLink),
        metaDescription,
        metaTitle,
        name,
        password,
        profilePhotoUrl: nextProfilePhotoUrl,
        tagline,
        videoEyebrow,
        videoHeadline,
      });
      setProfileFile(null);
      setProfilePhotoUrl(nextProfilePhotoUrl);
      showToast("success", "Site settings saved live.");
    } catch (error) {
      const message = error?.message || "Site settings save failed.";
      setSettingsError(message);
      showToast("error", message);
    } finally {
      setSettingsSaving(false);
      setProfileProgress(0);
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

    try {
      const addedId = await onAdd(password);
      setSelectedId(addedId);
      showToast("success", "iPhone added.");
    } catch (error) {
      const message = error?.message || "Could not add iPhone.";
      setSaveError(message);
      showToast("error", message);
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteSlot() {
    if (!selectedVideo || !window.confirm(`Delete Slot ${selectedId}?`)) return;
    setDeleting(true);
    try {
      const nextVideos = await onDelete(selectedId, password);
      setSelectedId(nextVideos[0]?.id || 1);
      showToast("success", "Video slot deleted.");
    } catch (error) {
      showToast("error", error?.message || "Could not delete slot.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleHidden(video) {
    try {
      await onToggleHidden(video.id, !video.hidden, password);
      showToast("success", video.hidden ? "Video shown." : "Video hidden.");
    } catch (error) {
      showToast("error", error?.message || "Could not update visibility.");
    }
  }

  async function handleDrop(targetId) {
    if (!draggedId || draggedId === targetId) return;
    const ids = videoItems.map((video) => video.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setDraggedId(null);
    try {
      await onReorder(ids, password);
      showToast("success", "Video order saved.");
    } catch (error) {
      showToast("error", error?.message || "Could not save order.");
    }
  }

  function updateLink(index, patch) {
    setLinks((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link
      )
    );
  }

  function addLink() {
    setLinks((current) => [
      ...current,
      {
        id: `link-${Date.now()}`,
        label: `Link ${current.length + 1}`,
        url: "",
        variant: current.length % 2 ? "dark" : "light",
      },
    ]);
  }

  function removeLink(index) {
    setLinks((current) => current.filter((_, linkIndex) => linkIndex !== index));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/55 p-3 backdrop-blur-sm sm:p-6">
      <div className="max-h-[calc(100vh-24px)] w-full max-w-xl overflow-y-auto rounded-[12px] border border-neutral-950/15 bg-[#fff8df] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:max-h-[calc(100vh-48px)] sm:p-6">
        <div className="sticky -top-5 z-10 mb-5 flex items-center justify-between gap-4 border-b border-neutral-950/10 bg-[#fff8df] pb-4 pt-1 sm:-top-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-700">
              Admin
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-normal">
              Site controls
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
        {toast ? (
          <div
            className={`mb-4 rounded-[8px] px-4 py-3 text-sm font-black ${
              toast.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {toast.message}
          </div>
        ) : null}

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
          <div className="space-y-6">
            <form
              onSubmit={handleSettingsSave}
              className="space-y-4 rounded-[10px] border border-neutral-950/15 bg-white/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-black tracking-normal">Site controls</h3>
                <button
                  type="button"
                  onClick={() => setPreviewMode((value) => !value)}
                  className="rounded-[8px] border border-neutral-950/20 bg-white px-3 py-2 text-sm font-black"
                >
                  {previewMode ? "Hide preview" : "Preview unsaved"}
                </button>
              </div>
              {previewMode ? (
                <div className="rounded-[10px] bg-black p-4 text-yellow-300">
                  <p className="inline-flex rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-black">
                    {draftSettings().handle}
                  </p>
                  <h4 className="mt-4 text-4xl font-black">{draftSettings().name}</h4>
                  <p className="mt-2 text-yellow-100">{draftSettings().tagline}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {draftSettings().links.map((link, index) => {
                      const Icon = getLinkIcon(link);
                      return (
                        <LinkCard key={link.id || index} icon={Icon} {...link} />
                      );
                    })}
                  </div>
                  <div className="mt-4 space-y-3 border border-yellow-300/30 p-4 text-sm text-yellow-100">
                    {bioParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}
              <label className="block">
                <span className="mb-2 block text-sm font-black text-neutral-800">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-neutral-800">
                  Profile photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setProfileFile(event.target.files?.[0] || null)}
                  className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold"
                />
                <img
                  src={profilePreviewUrl || profilePhotoUrl}
                  alt="Profile preview"
                  className="mt-3 aspect-[1600/657] w-full rounded-[8px] object-cover"
                />
              </label>
              {profileProgress > 0 ? (
                <div>
                  <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${profileProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-bold">{profileProgress}% uploaded</p>
                </div>
              ) : null}
              <label className="block">
                <span className="mb-2 block text-sm font-black text-neutral-800">
                  Handle
                </span>
                <input
                  type="text"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                  className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
                />
              </label>
              <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-black">Hero links</h4>
                  <button
                    type="button"
                    onClick={addLink}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-neutral-950 px-3 py-2 text-sm font-black text-white"
                  >
                    <Plus size={16} /> Add link button
                  </button>
                </div>
                <div className="space-y-4">
                  {links.map((link, index) => (
                    <div key={link.id || index} className="rounded-[8px] border border-neutral-950/10 bg-white p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={link.label}
                          onChange={(event) => updateLink(index, { label: event.target.value })}
                          placeholder="Button label"
                          className="rounded-[8px] border border-neutral-950/20 px-3 py-2 font-bold"
                        />
                        <input
                          value={link.url}
                          onChange={(event) => updateLink(index, { url: event.target.value })}
                          placeholder="https://..."
                          className="rounded-[8px] border border-neutral-950/20 px-3 py-2 font-bold"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-black">
                          <input
                            type="checkbox"
                            checked={link.variant === "dark"}
                            onChange={(event) =>
                              updateLink(index, { variant: event.target.checked ? "dark" : "light" })
                            }
                          />
                          Black/yellow style
                        </label>
                        {links.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="text-sm font-black text-red-700"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-neutral-800">
                  Tagline
                </span>
                <textarea
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  rows={2}
                  className="w-full resize-y rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-neutral-800">
                  Bio
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={7}
                  className="w-full resize-y rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold leading-7 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-yellow-500/25"
                />
              </label>
              <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-4">
                <div className="mb-3 flex flex-wrap gap-3 text-sm font-black text-neutral-700">
                  <span>{bio.length} characters</span>
                  <span>{bioParagraphs.length} paragraphs</span>
                </div>
                <div className="space-y-3 rounded-[8px] bg-black p-4 text-sm font-semibold text-yellow-100">
                  {bioParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-neutral-800">
                    Video eyebrow
                  </span>
                  <input
                    type="text"
                    value={videoEyebrow}
                    onChange={(event) => setVideoEyebrow(event.target.value)}
                    className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-neutral-800">
                    Video headline
                  </span>
                  <input
                    type="text"
                    value={videoHeadline}
                    onChange={(event) => setVideoHeadline(event.target.value)}
                    className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-neutral-800">
                    Page title
                  </span>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(event) => setMetaTitle(event.target.value)}
                    className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-neutral-800">
                    Meta description
                  </span>
                  <textarea
                    value={metaDescription}
                    onChange={(event) => setMetaDescription(event.target.value)}
                    rows={3}
                    className="w-full rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-bold"
                  />
                </label>
              </div>
              {settingsError ? (
                <p className="text-sm font-bold text-red-700">{settingsError}</p>
              ) : null}
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-neutral-950 px-5 py-4 font-black text-white transition hover:bg-neutral-800"
              >
                {settingsSaving ? <Spinner /> : <Save size={18} className="text-yellow-300" />}
                {settingsSaving ? "Saving..." : "Save site controls"}
              </button>
            </form>

            <form onSubmit={handleSave} className="space-y-4 rounded-[10px] border border-neutral-950/15 bg-white/70 p-4">
              <h3 className="text-xl font-black tracking-normal">Video slots</h3>
            <div className="grid gap-3">
              {videoItems.map((video) => (
                <button
                  type="button"
                  draggable
                  key={video.id}
                  onDragStart={() => setDraggedId(video.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(video.id)}
                  onClick={() => setSelectedId(video.id)}
                  className={`flex items-center justify-between rounded-[8px] border px-4 py-3 text-left text-sm font-black transition ${
                    selectedId === video.id
                      ? "border-neutral-950 bg-yellow-300"
                      : "border-neutral-950/15 bg-white hover:border-neutral-950"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GripVertical size={16} />
                    Slot {video.id}: {video.title}
                  </span>
                  <span className="flex items-center gap-2">
                    {video.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
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

            <div className="rounded-[8px] border border-neutral-950/15 bg-white/80 p-3 text-sm font-bold text-neutral-800">
              Editing <span className="text-yellow-800">iPhone {selectedId}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => selectedVideo && handleToggleHidden(selectedVideo)}
                className="inline-flex items-center gap-2 rounded-[8px] border border-neutral-950/20 bg-white px-4 py-3 font-black"
              >
                {selectedVideo?.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                {selectedVideo?.hidden ? "Show slot" : "Hide slot"}
              </button>
              <button
                type="button"
                onClick={handleDeleteSlot}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-[8px] bg-red-700 px-4 py-3 font-black text-white disabled:opacity-60"
              >
                {deleting ? <Spinner /> : <Trash2 size={18} />}
                Delete slot
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-neutral-800">
                Video title
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Type the title that shows under this iPhone"
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
                  className="mx-auto aspect-[9/16] max-h-[240px] rounded-[8px] bg-black object-contain sm:max-h-[300px]"
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
            {uploadProgress > 0 ? (
              <div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-bold">{uploadProgress}% uploaded</p>
              </div>
            ) : null}

            {saveError ? (
              <p className="text-sm font-bold text-red-700">{saveError}</p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-neutral-950 px-5 py-4 font-black text-white transition hover:bg-neutral-800"
            >
              {saving ? <Spinner /> : <Save size={18} className="text-yellow-300" />}
              {saving ? "Saving..." : "Save changes live"}
            </button>
          </form>
          </div>
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
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [videoItems, setVideoItems] = useState(defaultVideoSlots);
  const [storageMessage, setStorageMessage] = useState("");
  const bioParagraphs = getBioParagraphs(siteSettings.bio);

  useEffect(() => {
    document.title = siteSettings.metaTitle || defaultSiteSettings.metaTitle;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      siteSettings.metaDescription || defaultSiteSettings.metaDescription
    );
  }, [siteSettings.metaDescription, siteSettings.metaTitle]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/site-settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;
        if (data.settings) setSiteSettings(data.settings);
      })
      .catch(() => {
        if (mounted) setSiteSettings(defaultSiteSettings);
      });

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

  async function handleVideoSave({ file, hidden, id, password, poster, setUploadProgress, title }) {
    let uploadedUrl;

    if (file) {
      const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
      const blob = await upload(`brave-spark/videos/slot-${id}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        multipart: true,
        onUploadProgress: ({ percentage }) => {
          setUploadProgress?.(Math.round(percentage));
        },
        clientPayload: JSON.stringify({
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
        hidden,
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

  async function handleDeleteVideoSlot(id, password) {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not delete slot.");
    setVideoItems(data.videos || defaultVideoSlots);
    return data.videos || defaultVideoSlots;
  }

  async function handleReorderVideoSlots(orderedIds, password) {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", orderedIds, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not reorder slots.");
    setVideoItems(data.videos || defaultVideoSlots);
  }

  async function handleToggleVideoHidden(id, hidden, password) {
    const current = videoItems.find((video) => video.id === id);
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hidden,
        id,
        password,
        poster: current?.poster,
        src: current?.src,
        title: current?.title,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not update visibility.");
    setVideoItems(data.videos || defaultVideoSlots);
  }

  async function handleAssetUpload(file, password, setProgress) {
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
    const blob = await upload(`brave-spark/assets/${Date.now()}-${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/asset-upload",
      onUploadProgress: ({ percentage }) => {
        setProgress?.(Math.round(percentage));
      },
      clientPayload: JSON.stringify({ password }),
    });
    return blob.url;
  }

  async function handleSettingsSave({
    bio,
    handle,
    links,
    metaDescription,
    metaTitle,
    name,
    password,
    profilePhotoUrl,
    tagline,
    videoEyebrow,
    videoHeadline,
  }) {
    const response = await fetch("/api/site-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bio,
        handle,
        links,
        metaDescription,
        metaTitle,
        name,
        password,
        profilePhotoUrl,
        tagline,
        videoEyebrow,
        videoHeadline,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not save account text.");
    }

    setSiteSettings(data.settings || defaultSiteSettings);
  }

  function openAdmin() {
    setAdminUnlocked(false);
    setAdminOpen(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-yellow-300">
      <section className="relative bg-black px-5 py-12 text-yellow-300 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="animate-rise-in text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/35 bg-yellow-300 px-4 py-2 text-sm font-black text-black shadow-sm">
              <Sparkles size={16} color={accent} />
              <span>{siteSettings.handle}</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-yellow-300 sm:text-6xl md:text-7xl lg:mx-0">
              {siteSettings.name}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-balance text-xl font-semibold leading-8 text-yellow-100 sm:text-2xl lg:mx-0">
              {siteSettings.tagline}
            </p>

            <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2 lg:mx-0">
              {(siteSettings.links || defaultSiteSettings.links).map((link, index) => {
                const normalized = normalizeLink(link, index);
                const Icon = getLinkIcon(normalized);
                return <LinkCard key={normalized.id} icon={Icon} {...normalized} />;
              })}
            </div>
          </div>

          <div className="animate-rise-in mx-auto w-full [animation-delay:120ms]">
            <div className="relative rounded-[28px] border border-yellow-300/55 bg-yellow-300 p-3 shadow-[0_24px_90px_rgba(245,183,0,0.18)]">
              {siteSettings.profilePhotoUrl ? (
                <img
                  src={siteSettings.profilePhotoUrl}
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

      <section className="bg-black px-5 pb-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <article className="animate-rise-in rounded-[8px] border border-yellow-300/35 bg-yellow-300/8 p-6 shadow-[0_20px_70px_rgba(245,183,0,0.08)] [animation-delay:220ms] sm:p-8">
            <div className="space-y-5 text-lg font-semibold leading-8 text-yellow-100">
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
                <span>{siteSettings.videoEyebrow}</span>
              </div>
              <h2 className="max-w-3xl text-5xl font-black leading-none tracking-normal text-neutral-950 sm:text-6xl">
                {siteSettings.videoHeadline}
              </h2>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {videoItems.filter((video) => !video.hidden).map((video) => (
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

      <footer className="bg-black px-5 pb-8 text-center text-sm font-semibold text-yellow-300 sm:px-8">
        {siteSettings.name} · {year} ·{" "}
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
          onDelete={handleDeleteVideoSlot}
          onReorder={handleReorderVideoSlots}
          onSave={handleVideoSave}
          onSaveSettings={handleSettingsSave}
          onToggleHidden={handleToggleVideoHidden}
          onUploadAsset={handleAssetUpload}
          settings={siteSettings}
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
