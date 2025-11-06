# Idea

This project is an implementation of an time-locked escrow solution that leverages
from nostr and simplicity capabilities.


# Use case
Suppose Alice and Bob want to bet on something, and they choose _something_
or _someone_ to be their Escrow. They'll use nostr to communicate and the bet
will be settled in the Liquid network via a simplicity contract that handled
the `lBTC`.

# Sequence Diagram

Here every actor has a nostr client, and they're listening to events regarding
their possible actions.

With the proper tooling, the server would not be required and Escrow could
generate the address itself, propagate the message and sign the final transaction.
However, event with the server, parties can still verify if the contract and
address, since they only need to download to tools and check it on their side.

```mermaind
sequenceDiagram
    participant Alice
    participant Bob
    participant Escrow
    participant Server
    Alice ->> Bob: send bet
    Bob ->> Escrow: accept bet
    Escrow ->> Server: accept being escrow
    Server ->> Server: generate contract address with witness
    Server ->> Alice: funding address
    Alice ->> Alice: send funds
    Server ->> Bob: funding address
    Bob ->> Bob: send funds

    Server ->> Server: check for both funding
    Server ->> Escrow: ask for decision
    Escrow ->> Escrow: signs 
```

#### Parameters passed

Alice first sends the bet with parameters:
- Amount
- Alice's bitcoin address
- Bob's pub key
- Escrow's pub key
- Time to expire

Bob adds his bitcoin address and signs the message (confirming Bob is OK with
the contract params).

Escrow accepts being Escrow by signing the message.


