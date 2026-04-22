"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
            ? "bg-white border-terra/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            : "bg-[#F1EEE9] border-transparent hover:bg-[#E8E5E0]"
        }`}
      >
        <span
          className="material-symbols-outlined pl-4 text-secondary"
          style={{ fontSize: 20 }}
        >
          search
        </span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Search"
          className="flex-1 min-w-0 bg-transparent px-3 text-[14px] text-body placeholder:text-secondary focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            aria-label="Clear"
            className="pr-3 text-secondary hover:text-body"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              close
            </span>
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute right-0 top-12 w-[320px] sm:w-[420px] rounded-2xl bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)] border border-border overflow-hidden z-50">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-secondary">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-secondary">
              No venues match &ldquo;{q}&rdquo;.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/venue/${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-page transition-colors"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-page">
                      {r.featured_photo_url ? (
                        <Image
                          src={r.featured_photo_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-border">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 20 }}
                          >
                            storefront
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-body truncate">
                        {r.name}
                      </div>
                      <div className="text-[12px] text-secondary truncate">
                        {getCategorySingular(r.category)}
                        {r.neighborhood_name ? ` · ${r.neighborhood_name}` : ""}
                      </div>
                    </div>
                    {r.final_score != null && (
                      <span className="shrink-0 inline-flex items-center justify-center px-1.5 rounded-md bg-terra text-white text-[11px] font-bold min-w-[26px]">
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
                  className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 border-t border-border text-[13px] text-terra font-medium hover:bg-page transition-colors"
                >
                  See all results for &ldquo;{q}&rdquo;
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    arrow_forward
                  </span>
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
