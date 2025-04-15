import {
  VoteCast as VoteCastEvent,
  VotingStarted as VotingStartedEvent,
  VotingStopped as VotingStoppedEvent
} from "../generated/WeightedVoting/WeightedVoting"
import { VoteCast, VotingStarted, VotingStopped } from "../generated/schema"

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.power = event.params.power
  entity.vote = event.params.vote

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVotingStarted(event: VotingStartedEvent): void {
  let entity = new VotingStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.WeightedVoting_id = event.params.id
  entity.startTime = event.params.startTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVotingStopped(event: VotingStoppedEvent): void {
  let entity = new VotingStopped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.WeightedVoting_id = event.params.id
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
