Template.editor.rendered = function() {
    this.$('textarea').textcomplete([
        { // emoji strategy
            match: /\B:([\-+\w]*)$/,
            search: function (term, callback) {
                callback($.map(Emoji.values, function (emoji) {
                    return emoji.indexOf(term) === 0 ? emoji : null;
                }));
            },
            template: function (value) {
                return '<img src="' + Emoji.baseImagePath + value + '.png"></img>' + value;
            },
            replace: function (value) {
                return ':' + value + ':';
            },
            index: 1
        }
    ]);
}
