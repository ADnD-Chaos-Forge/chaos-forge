import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const channelNames: string[] = [];
const removedChannels: unknown[] = [];

function makeChannel(name: string) {
  const channel = {
    name,
    subscribed: false,
    on: vi.fn(() => {
      // Mirrors realtime-js: registering a callback after subscribe() throws.
      if (channel.subscribed) {
        throw new Error(
          `cannot add \`postgres_changes\` callbacks for realtime:${name} after \`subscribe()\`.`
        );
      }
      return channel;
    }),
    subscribe: vi.fn(() => {
      channel.subscribed = true;
      return channel;
    }),
  };
  return channel;
}

// One client per app, mirroring the real singleton: asking for the same channel
// name twice hands back the very same (already subscribed) channel object.
const openChannels = new Map<string, ReturnType<typeof makeChannel>>();

const mockClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({ data: { is_approved: true, email: "a@b.test" } }),
      }),
    }),
  }),
  channel: (name: string) => {
    channelNames.push(name);
    const existing = openChannels.get(name);
    if (existing) return existing;
    const created = makeChannel(name);
    openChannels.set(name, created);
    return created;
  },
  removeChannel: (channel: unknown) => {
    removedChannels.push(channel);
    for (const [name, value] of openChannels) {
      if (value === channel) openChannels.delete(name);
    }
  },
};

vi.mock("@/lib/supabase/client", () => ({ createClient: () => mockClient }));

const { useApprovalStatus } = await import("./use-approval-status");

describe("useApprovalStatus", () => {
  beforeEach(() => {
    channelNames.length = 0;
    removedChannels.length = 0;
    openChannels.clear();
  });

  /**
   * ApprovalBanner sits in the root layout while ApprovalGate renders on
   * /characters, /party and /sessions — so two instances run with the same
   * user id. Sharing a channel name made the second one call `.on()` on an
   * already-subscribed channel, which throws and takes the whole page down
   * via the error boundary.
   */
  it("gives two parallel instances distinct channel names", async () => {
    const first = renderHook(() => useApprovalStatus("user-1"));
    const second = renderHook(() => useApprovalStatus("user-1"));

    await waitFor(() => expect(channelNames.length).toBeGreaterThanOrEqual(2));

    expect(new Set(channelNames).size).toBe(channelNames.length);

    first.unmount();
    second.unmount();
  });

  it("removes its channel on unmount", async () => {
    const { unmount } = renderHook(() => useApprovalStatus("user-2"));
    await waitFor(() => expect(channelNames.length).toBe(1));

    unmount();
    expect(removedChannels).toHaveLength(1);
  });

  it("does not open a channel without a user", () => {
    renderHook(() => useApprovalStatus(null));
    expect(channelNames).toHaveLength(0);
  });
});
