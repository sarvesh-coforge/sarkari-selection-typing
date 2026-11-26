"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ExamModeView from "@/components/ExamModeView";

export default function DefaultRootPage() {
  const router = useRouter();

  // Backward compatibility for legacy ?tab=... URLs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    const routeMap: Record<string, string> = {
      home: "/home",
      test: "/typing-test",
      "test-result": "/typing-test",
      exam: "/exam-mode",
      tutor: "/typing-tutor",
      tools: "/tools",
      game: "/word-blaster",
      blog: "/blog",
    };
    if (tabParam && routeMap[tabParam]) {
      router.replace(routeMap[tabParam]);
    }
  }, [router]);

  return <ExamModeView />;
}
