import { describe, it, expect, vi } from 'vitest';
import { listenForEscrowEvents } from '../../src/nostr.js';

const mockSubscribeMany = vi.fn();
const mockSimplePool = vi.fn(() => ({
  subscribeMany: mockSubscribeMany,
}));

vi.mock('nostr-tools', async () => {
  const original = await vi.importActual('nostr-tools');
  return {
    ...original,
    SimplePool: mockSimplePool,
  };
});

describe('listenForEscrowEvents', () => {
  it('should subscribe to the correct events', async () => {
    await listenForEscrowEvents();

    expect(mockSimplePool).toHaveBeenCalledOnce();
    expect(mockSubscribeMany).toHaveBeenCalledWith(
      ['wss://relay.damus.io'],
      {
        kinds: [4],
        '#p': [expect.any(String)],
      },
      { onevent: expect.any(Function) }
    );
  });
});
