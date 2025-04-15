
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class AURAPOINTSSCHEMA {
  timeStamp: u64;
  auraPoints: u32;

  constructor() {
    this.timeStamp = readMemory<u64>(0);
    this.auraPoints = readMemory<u32>(8);
  }
}


export class Attestations {
  static auraPointsSchema: AURAPOINTSSCHEMA = new AURAPOINTSSCHEMA();
}
