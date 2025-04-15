import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { VoteCast } from "../generated/schema"
import { VoteCast as VoteCastEvent } from "../generated/WeightedVoting/WeightedVoting"
import { handleVoteCast } from "../src/weighted-voting"
import { createVoteCastEvent } from "./weighted-voting-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let voter = Address.fromString("0x0000000000000000000000000000000000000001")
    let power = 123
    let vote = "boolean Not implemented"
    let newVoteCastEvent = createVoteCastEvent(voter, power, vote)
    handleVoteCast(newVoteCastEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("VoteCast created and stored", () => {
    assert.entityCount("VoteCast", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "voter",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "power",
      "123"
    )
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vote",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
