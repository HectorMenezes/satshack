import { getPublicKey, generateSecretKey } from 'nostr-tools/pure';
import { createBetEventHandler } from './events-handlers/create-bet.js';

const ESCROW_SK = generateSecretKey();
const ESCROW_PK = getPublicKey(ESCROW_SK);

const RELAYS = ['wss://relay.damus.io'];

export async function listenForEscrowEvents(): Promise<void> {
  const { SimplePool } = await import('nostr-tools');
  const pool = new SimplePool();

  console.log(`Listening for escrow events on public key: ${ESCROW_PK}`);

  pool.subscribeMany(
    RELAYS,
    {
      kinds: [30349],
    },
    {
      async onevent(event) {
        console.log('event', event);
        const { tags } = event;

        const betProposalId = tags.filter((tag) => tag[0] === 'e')[0]?.[1];

        if (!betProposalId) {
          return;
        }

        console.log('betProposalId', betProposalId);

        const betProposalEvent = await pool.get(RELAYS, {
          ids: [betProposalId],
        });

        if (!betProposalEvent) {
          console.log('it exists indeeed on this relay', event);
        }

        const parsedTages = Object.fromEntries(betProposalEvent?.tags || []);
        console.log(parsedTages);

        const pubkeys = {
          CLIENT_ONE_PUBK: event.pubkey,
          CLIENT_TWO_PUBK: parsedTages.counterparty,
          ESCROW_PUBK: parsedTages.escrow,
        };

        createBetEventHandler(pubkeys);
      },
    },
  );

  console.log('Subscription started...');
}
