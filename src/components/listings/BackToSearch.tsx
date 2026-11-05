"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function BackToSearch() {
  const saved = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("preview-search") ?? "",
    () => "",
  );
  return (
    <Link href={saved ? `/preview/search${saved}` : "/preview/search"} className="text-sm font-medium text-coral">
      Back to sample search
    </Link>
  );
}
