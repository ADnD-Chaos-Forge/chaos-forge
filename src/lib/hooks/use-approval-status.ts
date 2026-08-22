"use client";

import { useEffect, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ApprovalStatus {
  isApproved: boolean;
  isLoading: boolean;
  userEmail: string | null;
}

/**
 * Tracks the current user's approval status with a realtime subscription so the
 * banner disappears immediately when the admin approves the user.
 */
export function useApprovalStatus(userId: string | null): ApprovalStatus {
  // ApprovalBanner lives in the root layout while ApprovalGate renders on
  // /characters, /party and /sessions — so two instances run with the same user
  // id. supabase.channel() hands back the existing channel for a known name, and
  // calling .on() on an already-subscribed channel throws, which takes the whole
  // page down through the error boundary. A per-instance suffix keeps them apart.
  // useId() produces colons, which have meaning in realtime topic names.
  const instanceId = useId().replace(/:/g, "");
  const [isApproved, setIsApproved] = useState(true); // optimistic: assume approved until we know otherwise
  // When no userId is present we don't need to load anything, so start non-loading.
  const [isLoading, setIsLoading] = useState(() => userId !== null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    let cancelled = false;

    async function fetchStatus() {
      const { data } = await supabase
        .from("profiles")
        .select("is_approved, email")
        .eq("id", userId)
        .maybeSingle();
      if (!cancelled && data) {
        setIsApproved(data.is_approved === true);
        setUserEmail(data.email ?? null);
      }
      if (!cancelled) setIsLoading(false);
    }

    fetchStatus();

    const channel = supabase
      .channel(`approval-${userId}-${instanceId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const next = payload.new as { is_approved?: boolean };
          if (typeof next.is_approved === "boolean") {
            setIsApproved(next.is_approved);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, instanceId]);

  return { isApproved, isLoading, userEmail };
}
