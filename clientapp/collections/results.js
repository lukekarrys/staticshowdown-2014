var Backbone = require('backbone');
var User = require('../models/user');
var _ = require('underscore');


module.exports = Backbone.Collection.extend({
    model: User,
    initialize: function (models, options) {
        options || (options = {});
        this.masters = options.masters || [];
        this.masterIndex = options.masterIndex || 0;
        _.each(models, this.setModelMaster, this);
    },
    comparator: function (m) {
        return this.byTotal(m);
    },
    byTotal: function (m) {
        return -m.score.totalScore;
    },
    byGooley: function (m) {
        return -m.gooley;
    },
    getMaster: function (index) {
        index = typeof index === 'number' ? index : this.masterIndex;
        return this.masters[index];
    },
    setModelsMaster: function (master) {
        this.each(this.setModelMaster, this);
        this.sort();
    },
    setModelMaster: function (m) {
        m.master = this.getMaster();
    },
    canRewind: function () {
        return this.masters.length > 0 && this.masterIndex > 0;
    },
    canFastForward: function () {
        return this.masters.length > 0 && this.masterIndex < this.masters.length - 1;
    },
    previous: function () {
        this.masterIndex = Math.max(0, this.masterIndex - 1);
        this.setModelsMaster();
    },
    next: function () {
        this.masterIndex = Math.min(this.masterIndex + 1, this.masters.length - 1);
        this.setModelsMaster();
    },
    first: function () {
        this.masterIndex = 0;
        this.setModelsMaster();
    },
    last: function () {
        this.masterIndex = this.masters.length - 1;
        this.setModelsMaster();
    }
});