Meteor.Router.add({
	'/'					:function () {
							Session.set('pageTitle', Session.get('slogan'));
							Session.set('pageDescription', 'Build your decks, interact with other players, read and write deck reviews, view cards, and create new strategies. Easy to use. Try now!');
							Session.set('deck_sort', 'top');
							Session.set('user_deck_sub', false);
							return 'decks';
						},
	'/latest'			:function () {
							Session.set('pageTitle', "Latest Hearthstone Decks - " + Session.get('slogan'));
							Session.set('pageDescription', 'View the latest Hearthstone decks from Hearthstone lovers');
							Session.set('deck_sort', 'latest');
							Session.set('user_deck_sub', false);
							return 'decks';
						},

	'/build-deck'		:function(){
							Session.set('class', 'Druid');
							Session.set('pageTitle', "Build your Hearthstone decks - " + Session.get('slogan'));
							Session.set('pageDescription', 'The Cool, Hearthstone Deck Builder. Choose your hero (class) and start to build your deck.');
							return 'builddeck';
						},

	'/deck/:id'			:function(id){
							Session.set('pageTitle', Session.get('global_deckname') + ' - ' + Session.get('global_classname') + ' Deck - ' + Session.get('slogan'));
							Session.set('pageDescription', Session.get('global_deckname') + ' is a ' + Session.get('global_classname') + ' Class Hearthstone Deck built by '+ Session.get('global_username') + ' and waiting for your reviews here.');
							Session.set('singleDeck', id.substr(id.length-17, id.length));
							return 'singledeck';
	    				},

	'/card/:id'			:function(id){
							Session.set('pageTitle', "Card name: "+Session.get('global_cardname') + '. ' + Session.get('global_rarity') + " " +Session.get('global_cardclass') + " Card - " + Session.get('slogan'));
							Session.set('pageDescription', Session.get('global_cardclass') + "'s " + Session.get('global_rarity') + " card '"  + Session.get('global_cardname') + "' costs " + Session.get('global_cardcost') +  " mana, defends with " + Session.get('global_cardhp') + " HP/DUR and attacks with " + Session.get('global_cardattack') + ". Learn more about this card." );
							Session.set('singleCard', id.substr(id.length-6, id.length));
							return 'singlecard';
						},
	'/user/:id': function (id){
							Session.set('deck_sort', 'top');
							Session.set('user_deck_sub', true);
							return 'decks';
							},
	'/terms-of-service'		:function () {
							Session.set('pageTitle', Session.get('slogan'));
							Session.set('pageDescription', 'Hearthingo - Terms of Service');
							return 'terms';
						},
	'/privacy-policy'		:function () {
							Session.set('pageTitle', Session.get('slogan'));
							Session.set('pageDescription', 'Hearthingo - Privacy Policy');
							return 'privacy';
						}
});