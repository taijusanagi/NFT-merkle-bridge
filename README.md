# GenerativeMIDIs

## Deployed Contract

The contract is deployed on Polygon
https://mumbai.polygonscan.com/address/0xcf25C7F62D3198ecd1bEe331F247B9d8BeeE8fE7#code

Static data is served in IPFS
https://github.com/taijusanagi/GenerativeMIDIs/blob/main/packages/contracts/contracts/GenerativeMIDIsSeries1.sol#L14

## Description

GenerativeMIDIs is a project which generates MIDI data fully on-chain. It encodes MIDI raw data in solidity, then generates token URI in a contract.

There are so many generative music projects, but there is fewer fully on-chain generative music project. I think this is because of the difficulty encoding the music data in the smart contract. (not like SVG data)

This can be used for the template of a new kind of full-on-chain NFT project.

We can prove how the music is generated and who built this logic. This is difficult in the current music industry without smart contract.

## How it's made

I researched how MIDI data works from this web page.
http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html

The code in solidity one by one to make it possible.
https://www.npmjs.com/package/midi-writer-js

This coding is almost like generating raw binary MIDI data in solidity, so it was tough, but I successfully developed the simple MIDI data.

I used a polygon and IPFS for this project.
