import {
  ExtensionAccount,
  PrivateKeyAccount,
} from "applesauce-accounts/accounts";
import { ExtensionSigner, PrivateKeySigner } from "applesauce-signers";
import { nip19 } from "nostr-tools";
import { accounts } from "./accounts";
import { BaseAccount } from "applesauce-accounts";

export type AuthMethod = "nip07" | "nsec";

export async function signIn(
  method: AuthMethod,
  nsec?: string,
  pubkey?: string,
  remoteRelay?: string
) {
  let account: BaseAccount<any, any, any> | undefined;

  if (method === "nip07" && window.nostr) {
    const signer = new ExtensionSigner();
    const pubkey = await signer.getPublicKey();
    account = new ExtensionAccount(pubkey, signer);
  } else if ("nsec" === method && nsec) {
    const decoded = nip19.decode(nsec);
    if (decoded.type !== "nsec") throw new Error("Invalid nsec");

    const key = decoded.data;
    const signer = new PrivateKeySigner(key);
    const pubkey = await signer.getPublicKey();
    account = new PrivateKeyAccount(pubkey, signer);
  }

  if (account) {
    accounts.addAccount(account);
    accounts.setActive(account);
  }

  return account;
}
