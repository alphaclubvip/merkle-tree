import { ethers } from "ethers";
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import fs from 'fs';

function read() {
  try {
    const data = fs.readFileSync('.data/source.txt', 'utf-8');
    if (data) {
      let rlt = [];
      const arr = data.split('\r\n');
      arr.forEach((_row, _i) => {
        const s = _row.trim();
        if (s) {
          const address = ethers.utils.getAddress(s);
          rlt.push(address);
        }
      });

      return rlt;
    }
  }
  catch (e) {
    console.error(e);
    return [];
  }
}

const input = read();
const leafNodes = input.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

console.log('proof:');
input.forEach((_address, _i) => {
  const leaf = leafNodes[_i];
  const proof = merkleTree.getHexProof(leaf);
  const filename = `.data/.proof/${_address}.json`;

  fs.writeFileSync(filename, JSON.stringify(proof));
  console.log(filename);
});

console.log('\nroot:', rootHash.toString('hex'));
