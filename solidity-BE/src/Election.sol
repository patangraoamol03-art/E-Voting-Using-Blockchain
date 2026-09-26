// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {

    enum ElectionStatus {
        NotStarted,
        Running,
        Ended
    }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 votes;
        bool exists;
        address _address;
    }

    struct Voter {
        string name;
        bool exists;
    }

    address public admin;

    uint256 public startTime;
    uint256 public endTime;

    uint256 public totalVotes;
    uint256 public candidateCount;

    uint256 public electionId;

    ElectionStatus public status;

    mapping(uint256 => Candidate)
        public candidates;

    mapping(address => Voter)
        public voters;

    mapping(uint256 => mapping(address => bool))
        public hasVoted;

    constructor() {
        admin = msg.sender;

        status =
            ElectionStatus.NotStarted;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only admin"
        );
        _;
    }

    modifier electionRunning() {
        require(
            status ==
                ElectionStatus.Running,
            "Election not running"
        );
        _;
    }

    function addVoter(
        address voterAddress,
        string memory voterName
    )
        external
        onlyAdmin
    {
        voters[voterAddress] =
            Voter({
                name: voterName,
                exists: true
            });
    }

    function removeVoter(
        address voterAddress
    )
        external
        onlyAdmin
    {
        delete voters[voterAddress];
    }

    function addCandidate(
        string memory _name,
        string memory _party,
        address _candidateAddress
    )
        external
        onlyAdmin
    {
        require(
            status ==
                ElectionStatus.NotStarted,
            "Election already started"
        );

        candidates[candidateCount] =
            Candidate({
                id: candidateCount,
                name: _name,
                party: _party,
                votes: 0,
                exists: true,
                _address: _candidateAddress
            });

        voters[_candidateAddress]= Voter({
            name : _name,
            exists : true
        });


        candidateCount++;

    }

    function removeCandidate(
        uint256 _id
    )
        external
        onlyAdmin
    {
        require(
            status !=
                ElectionStatus.Running,
            "Election running"
        );

        require(
            candidates[_id].exists,
            "Candidate not found"
        );

        delete voters[candidates[_id]._address];
        delete candidates[_id];
    }

    function startElection(
        uint256 _startTime,
        uint256 _endTime
    )
        external
        onlyAdmin
    {

        require(candidateCount > 1, "Cannot start the election as there is only one candidate");
        require(
            status ==
                ElectionStatus.NotStarted,
            "Already started"
        );

        require(
            _endTime > _startTime,
            "Invalid timing"
        );

        startTime = _startTime;
        endTime = _endTime;

        status =
            ElectionStatus.Running;
    }

    function endElection()
        external
        onlyAdmin
    {
        require(
            status ==
                ElectionStatus.Running,
            "Election not running"
        );

        status =
            ElectionStatus.Ended;
    }

    function vote(
        uint256 _candidateId
    )
        external
        electionRunning
    {
        require(
            block.timestamp >=
                startTime,
            "Election not started"
        );

        require(
            block.timestamp <=
                endTime,
            "Election ended"
        );

        require(
            voters[msg.sender]
                .exists,
            "Not registered"
        );

        require(
            !hasVoted[electionId][msg.sender],
            "Already voted"
        );

        require(
            candidates[_candidateId]
                .exists,
            "Candidate not found"
        );

        candidates[_candidateId]
            .votes++;

        totalVotes++;

        hasVoted[electionId][msg.sender] =
            true;
    }

    function getCandidate(
        uint256 _id
    )
        external
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        Candidate memory c =
            candidates[_id];

        return (
            c.id,
            c.name,
            c.party,
            c.votes,
            c.exists
        );
    }

    function resetElection()
        external
        onlyAdmin
    {
        require(
            status ==
                ElectionStatus.Ended,
            "Election not ended"
        );

        for (
            uint256 i = 0;
            i < candidateCount;
            i++
        ) {
            delete candidates[i];
        }

        candidateCount = 0;

        totalVotes = 0;

        startTime = 0;
        endTime = 0;

        electionId++;

        status =
            ElectionStatus.NotStarted;
    }
}
