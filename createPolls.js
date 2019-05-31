const mongoose = require("mongoose");

const topics = [
    "Should dogs be allowed to fly?",
    "Should doors be shut at night?",
    "Should developers use IDEs?",
    "Should cars have four wheels?",
    "Should humans be allowed to wear shoes?"
];

const pollName = ["General 1", "General 2", "General 3", "General 4", "General 5",]
const candidates = [
    {
        candidateId: "1",
        candidate: "AAA",
        votes: 0
    }, {
        candidateId: "2",
        candidate: "BBB",
        votes: 0
    }, {
        candidateId: "3",
        candidate: "CCC",
        votes: 0
    }
]
let Poll = require("./models/polls");

// empty the collection first
let creatPolls = function () {
    Poll.deleteMany({})
        .then(() => {
            let polls = [];
            for (let i = 0; i < 5; i++) {
                polls.push({
                    pollName: pollName[i],
                    options: candidates,
                    voters: []
                });
            }
            return Poll.create(polls);
        })
}

module.exports = {
    creatPolls: creatPolls
};