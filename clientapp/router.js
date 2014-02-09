/*global me, app*/
var Backbone = require('backbone');
var HomePage = require('./pages/home');
var CollabPage = require('./pages/collaborate');
var ResultsPage = require('./pages/results');
var _404Page = require('./pages/404');
var Bracket = require('./models/bracket');
var InstantBracket = require('./models/instantBracket');
var Results = require('./collections/results');
var BracketValidator = require('bracket-validator');
var bd = new BracketValidator({year: '2013'});

var data = require('./data/2013.json');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'entry',
        'bracket': 'entry',
        'bracket/:bracket': 'entry',

        'collaborate/:room': 'collaborate',

        'results': 'results',

        '*path': '_404'
    },

    // ------- ROUTE HANDLERS ---------
    entry: function (bracket) {
        var history = app.localStorage('history') || [];
        var historyIndex = app.localStorage('historyIndex') || 0;
        if (bracket && history.length === 0) {
            history = [bracket];
        }
        if (!history[0] || history[0] !== bd.constants.EMPTY) {
            history.unshift(bd.constants.EMPTY);
            historyIndex++;
        }
        this.trigger('newPage', new HomePage({
            model: new Bracket({
                history: history,
                historyIndex: historyIndex
            })
        }));
    },

    collaborate: function (room) {
        this.trigger('newPage', new CollabPage({
            model: new InstantBracket({
                roomId: room
            })
        }));
    },

    results: function () {
        this.trigger('newPage', new ResultsPage({
            collection: new Results(data.entries, {masters: data.masters}),
        }));
    },

    _404: function () {
        this.trigger('newPage', new _404Page());
    }
});
