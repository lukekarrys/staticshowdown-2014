var HumanModel = require('human-model');
var BracketScorer = require('bracket-scorer');
var _ = require('underscore');


module.exports = HumanModel.define({
    type: 'user',
    session: {
        bracket: ['string', true, ''],
        username: ['string', true, ''],
        master: ['string', true, '']
    },
    derived: {
        score: {
            deps: ['bracket', 'master'],
            cache: true,
            fn: function () {
                return new BracketScorer({
                    userBracket: this.bracket,
                    masterBracket: this.collection.getMaster(this.master),
                    year: '2013'
                }).getScore();
            }
        },
        gooley: {
            deps: ['bracket', 'master'],
            cache: true,
            fn: function () {
                return new BracketScorer({
                    userBracket: this.bracket,
                    masterBracket: this.collection.getMaster(this.master),
                    year: '2013'
                }).gooley().gooley;
            }
        }
    }
});
