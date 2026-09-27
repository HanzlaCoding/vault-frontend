import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";

const API_BASE = `${import.meta.env.VITE_BASE_URL}/api/v0/thoughts`;

export default function Dashboard({ user, onLogout }) {
  const [thoughts, setThoughts] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
    withCredentials: true,
  };

  // 1. Fetch thoughts on mount
  const fetchThoughts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, authHeaders);
      setThoughts(res.data?.thoughts || []);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to load thoughts.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  // 2. Create Thought
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        API_BASE,
        { content: newContent.trim() },
        authHeaders,
      );

      // Prepend the new thought immediately
      setThoughts((prev) => [res.data.thought, ...prev]);
      setNewContent("");
      setToast({
        type: "success",
        message: "Thought recorded into Vault.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to save thought.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Update Thought
  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;

    try {
      const res = await axios.put(
        `${API_BASE}/${id}`,
        { content: editContent.trim() },
        authHeaders,
      );

      setThoughts((prev) =>
        prev.map((t) => (t._id === id ? res.data.thought : t)),
      );
      setEditingId(null);
      setEditContent("");
      setToast({
        type: "success",
        message: "Thought updated successfully.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to update thought.",
      });
    }
  };

  // 4. Delete Thought
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, authHeaders);
      setThoughts((prev) => prev.filter((t) => t._id !== id));
      setToast({
        type: "success",
        message: "Thought permanently expunged.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to delete thought.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] font-['Bricolage_Grotesque',sans-serif] text-neutral-100 antialiased selection:bg-orange-500/30 selection:text-orange-200">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_50%)]" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080808]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 shadow-inner">
              <span className="text-xs font-bold text-orange-400">V</span>
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-white">
                VAULT
              </span>
              <span className="ml-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                Encrypted
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-neutral-400 sm:inline-block">
              {user?.email}
            </span>
            <button
              onClick={onLogout}
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 transition duration-150 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative mx-auto max-w-3xl px-6 py-10">
        {/* Create Form */}
        <section className="mb-12">
          <form
            onSubmit={handleCreate}
            className="group relative rounded-2xl border border-white/10 bg-[#0d0d0e]/90 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition duration-200 focus-within:border-orange-500/50"
          >
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Capture a raw thought, insight, or architecture decision..."
              className="w-full resize-none bg-transparent p-2 text-sm text-neutral-100 placeholder-neutral-600 outline-none"
            />
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="text-[11px] text-neutral-500">
                {newContent.length} characters
              </span>
              <button
                type="submit"
                disabled={submitting || !newContent.trim()}
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-orange-400 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)]"
              >
                {submitting ? "Saving..." : "Record Thought"}
              </button>
            </div>
          </form>
        </section>

        {/* Thought Stream */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Vault Stream ({thoughts.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-neutral-500">
              Decrypting and fetching stored records...
            </div>
          ) : thoughts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-sm font-medium text-neutral-400">
                Your vault is completely empty.
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                Type above to record your first indexed thought.
              </p>
            </div>
          ) : (
            thoughts.map((item) => (
              <article
                key={item._id}
                className="group relative rounded-xl border border-white/[0.08] bg-[#0c0c0d]/70 p-5 backdrop-blur-xl transition duration-150 hover:border-white/20"
              >
                {editingId === item._id ? (
                  <div className="space-y-3">
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-lg border border-orange-500/40 bg-black/50 p-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg px-3 py-1 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdate(item._id)}
                        className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-black hover:bg-orange-400"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">
                      {item.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3 text-[11px] text-neutral-500">
                      <time dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>

                      <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(item._id);
                            setEditContent(item.content);
                          }}
                          className="hover:text-orange-400 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="hover:text-red-400 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
