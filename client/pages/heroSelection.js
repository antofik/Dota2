define([
    'jquery',
    'server'
], function($, Server){
    var page, list;

    $(function(){
        page = $('#list_of_heroes');
        list = $('ul', page);
    });

    Server.on('list of heroes', function(e) {
        showHeroSelection(e);
    });

    var timer;
    function showHeroSelection(e) {
        var heroes = e.heroes;
        clearTimeout(timer);

        list.html('');
        for(var i=0;i<heroes.length;i++) {
            var hero = heroes[i];
            list.append('<li data-name="' + hero.name + '"">' + hero.name + ' - ' + (hero.player || 'free') + '</li>');
        }
        $('li', list).click(function(e){
            var name = $(this).data('name');
            Server.emit('select hero', name);
        });
    }

    return {
        show: function() {
            page.show();
        },

        hide: function() {
            page.hide();
            clearTimeout(timer);
        }
    };
});