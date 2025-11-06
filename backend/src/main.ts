import { listenForEscrowEvents } from './nostr.js';

async function main() {
  try {
    await listenForEscrowEvents();
  } catch (error) {
    console.error('Error in main application:', error);
  }
}

main();
