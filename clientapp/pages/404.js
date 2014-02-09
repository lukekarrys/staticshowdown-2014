var PageView = require('./base');
var templates = require('../templates');


module.exports = PageView.extend({
    pageTitle: '404',
    template: templates.pages._404,
    render: function () {
        this.renderAndBind();
    }
});
