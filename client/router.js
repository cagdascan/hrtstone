Meteor.Router.add({
	'/'								: 'decks',
	'/deck/miracle-rogue'			: 'singledeck',
	'/build-deck/druid'				: function(){
										Session.set('class', 'Druid');
										return 'builddeck';
 									},
	'/build-deck/hunter'				: function(){
										Session.set('class', 'Hunter');
										return 'builddeck';
 									},
	'/build-deck/mage'				: function(){
										Session.set('class', 'Mage');
										return 'builddeck';
 									},
	'/build-deck/paladin'				: function(){
										Session.set('class', 'Paladin');
										return 'builddeck';
 									},
	'/build-deck/priest'				: function(){
										Session.set('class', 'Priest');
										return 'builddeck';
 									},
	'/build-deck/rogue'				: function(){
										Session.set('class', 'Rogue');
										return 'builddeck';
 									},
	'/build-deck/shaman'				: function(){
										Session.set('class', 'Shaman');
										return 'builddeck';
 									},
	'/build-deck/warlock'				: function(){
										Session.set('class', 'Warlock');
										return 'builddeck';
 									},
	'/build-deck/warrior'				: function(){
										Session.set('class', 'Warrior');
										return 'builddeck';
 									}
});
