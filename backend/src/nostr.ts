
import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';

const ESCROW_SK = generateSecretKey();
const ESCROW_PK = getPublicKey(ESCROW_SK);

const RELAYS = ['wss://relay.damus.io'];

export async function listenForEscrowEvents() {
  const { SimplePool } = await import('nostr-tools');
  const pool = new SimplePool();

  console.log(`Listening for escrow events on public key: ${ESCROW_PK}`);

  pool.subscribeMany(
    RELAYS,
    {
      kinds: [4],
      '#p': [ESCROW_PK],
    },
    {
      onevent(event) {
        console.log('Received event:', event);
        // Here we would handle the event, for example, by decrypting the message
        // and processing the escrow logic.
      },
    }
  );

  console.log('Subscription started...');
}
