"use client";

import { useEffect } from "react";
import { API_BASE } from "../lib/api-config";

export default function SystemWakeup() {
  useEffect(() => {
    // Stealth ping to wake up Render Free Tier
    const wakeUp = async () => {
      try {
        console.log("Initializing Neural Handshake...");
        await fetch(`${API_BASE}/health`);
      } catch (e) {
        // Silently fail
      }
    };
    wakeUp();
  }, []);

  return null;
}
