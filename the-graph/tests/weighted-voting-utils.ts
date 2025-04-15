import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  VoteCast,
  VotingStarted,
  VotingStopped
} from "../generated/WeightedVoting/WeightedVoting"

export function createVoteCastEvent(
  voter: Address,
  power: i32,
  vote: boolean
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent())

  voteCastEvent.parameters = new Array()

  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "power",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(power))
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("vote", ethereum.Value.fromBoolean(vote))
  )

  return voteCastEvent
}

export function createVotingStartedEvent(
  id: BigInt,
  startTime: BigInt
): VotingStarted {
  let votingStartedEvent = changetype<VotingStarted>(newMockEvent())

  votingStartedEvent.parameters = new Array()

  votingStartedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  votingStartedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )

  return votingStartedEvent
}

export function createVotingStoppedEvent(
  id: BigInt,
  endTime: BigInt
): VotingStopped {
  let votingStoppedEvent = changetype<VotingStopped>(newMockEvent())

  votingStoppedEvent.parameters = new Array()

  votingStoppedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  votingStoppedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return votingStoppedEvent
}
