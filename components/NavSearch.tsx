"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, Store, X } from "lucide-react";
import type { SearchResult } from "@/lib/queries";
import { getCategorySingular } from "@/lib/utils";

export default function NavSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(term)}`,
          { signal: ac.signal }
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(handle);
  }, [q]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/discover?q=${encodeURIComponent(term)}`);
  }

  const showDropdown = open && q.trim().length >= 2;

  return (
    <div ref={wrapperRef} className="relative w-44 sm:w-64">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center h-10 rounded-full border transition-colors ${
          open
            ? "bg-paper border-rust/40"
            : "bg-stone/50 border-transparent hover:bg-stone"
        }`}
      >
        <Search className="ml-4 w-5 h-5 text-stone-deep shrink-0" aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Search"
          className="flex-1 min-w-0 bg-transparent px-3 text-body-sm text-ink placeholder:text-stone-deep focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            aria-label="Clear"
            className="pr-3 text-stone-deep hover:text-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute right-0 top-12 w-[320px] sm:w-[420px] rounded-2xl bg-paper border border-stone overflow-hidden z-50">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-body-sm text-stone-deep">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-body-sm text-stone-deep">
              No venues match &ldquo;{q}&rdquo;.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/venue/${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone/50 transition-colors"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-stone">
                      {r.featured_photo_url ? (
                        <Image
                          src={r.featured_photo_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-deep">
                          <Store className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-body-sm font-semibold text-ink truncate">
                        {r.name}
                      </div>
                      <div className="text-body-sm text-stone-deep truncate">
                        {getCategorySingular(r.category)}
                        {r.neighborhood_name ? ` · ${r.neighborhood_name}` : ""}
                      </div>
                    </div>
                    {r.final_score != null && (
                      <span className="shrink-0 inline-flex items-center justify-center px-1.5 rounded-md bg-rust text-paper text-micro font-bold min-w-[26px]">
                        {r.final_score.toFixed(1)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 border-t border-stone text-body-sm text-rust font-semibold hover:bg-stone/50 transition-colors"
                >
                  See all results for &ldquo;{q}&rdquo;
                  <ArrowRight className="w-4 h-4" />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
