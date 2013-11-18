Meteor.Router.add({
	'/'								 	 : 'decks',
	'/deck/miracle-rogue': 'singledeck',
	'/card/fireball': 'singlecard',
	'/build-deck'				 : function(){
													Session.set('class', 'Druid');
													return 'builddeck';
 												},
 	'/'					 : function () {
 													Session.set('deck_sort', 'top');
 													return 'decks';
 												 },
 	'/latest'				 : function () {
 													Session.set('deck_sort', 'latest');
 													return 'decks';
 												 }
});
