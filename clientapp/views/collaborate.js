var BaseView = require('./modal'),
    _ = require('underscore'),
    templates = require('../templates'),
    slugify = function (txt) {
        return txt.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    };

module.exports = BaseView.extend({
    template: templates.dialogs.collaborate,
    events: {
        'click [data-dismiss]': 'hideModal',
        'keyup input': 'setButtonHref',
        'submit form': 'setButtonHref'
    },
    setButtonHref: function (e) {
        e.preventDefault();
        this.$('.btn-primary').attr('href', '/collaborate/' + slugify(this.$('input').val()));
        if (e.type === 'submit') {
            this.$('.btn-primary').click();
        }
    }
});
