// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract WeightedVoting {
    address public owner;

    struct Voting {
        uint256 id;         // Unique identifier for each voting session
        bool isActive;      // Whether the voting is currently active
        uint256 yesCount;   // Weighted "yes" votes
        uint256 noCount;    // Weighted "no" votes
        uint256 totalVotes; // Total votes cast (weighted)
        uint256 startTime;  // Timestamp when voting started
        uint256 endTime;    // Timestamp when voting ended
    }

    uint256 public votingCounter; // Counter to assign unique IDs to each voting session
    Voting public currentVoting;

    mapping(address => bool) public hasVoted; // Tracks if an address has already voted

    event VotingStarted(uint256 id, uint256 startTime);
    event VotingStopped(uint256 id, uint256 endTime);
    event VoteCast(address voter, uint8 power, bool vote);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingActive() {
        require(currentVoting.isActive, "Voting is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingCounter = 0;
    }

    // Starts a new voting session
    function startVoting() external onlyOwner {
        require(!currentVoting.isActive, "A voting session is already active");

        votingCounter++;
        currentVoting = Voting({
            id: votingCounter,
            isActive: true,
            yesCount: 0,
            noCount: 0,
            totalVotes: 0,
            startTime: block.timestamp,
            endTime: 0
        });

        emit VotingStarted(votingCounter, block.timestamp);
    }

    // Stops the current voting session
    function stopVoting() external onlyOwner {
        require(currentVoting.isActive, "No active voting session to stop");

        currentVoting.isActive = false;
        currentVoting.endTime = block.timestamp;

        emit VotingStopped(currentVoting.id, block.timestamp);
    }

    // Casts a vote
    function castVote(bool vote, uint8 power) external votingActive returns (bool){
        require(power >= 1 && power <= 5, "Power must be between 1 and 5");
        require(!hasVoted[msg.sender], "You have already voted");

        hasVoted[msg.sender] = true;

        if (vote) {
            currentVoting.yesCount += power;
        } else {
            currentVoting.noCount += power;
        }

        currentVoting.totalVotes += power;

        emit VoteCast(msg.sender, power, vote);

        return true;
    }

    // Returns the current vote status
    function getVoteStatus()
        external
        view
        returns (
            uint256 id,
            uint256 yes,
            uint256 no,
            uint256 total,
            bool isActive,
            uint256 startTime,
            uint256 endTime
        )
    {
        Voting memory v = currentVoting;
        return (
            v.id,
            v.yesCount,
            v.noCount,
            v.totalVotes,
            v.isActive,
            v.startTime,
            v.endTime
        );
    }
}
