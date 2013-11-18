Meteor.Router.add({
	'/'								 	 : 'decks',
	'/build-deck'				 : function(){
													Session.set('class', 'Druid');
													return 'builddeck';
 												},
 	'/'					 				 : function () {
 													Session.set('deck_sort', 'top');
 													return 'decks';
 												 },
 	'/latest'				 		 : function () {
 													Session.set('deck_sort', 'latest');
 													return 'decks';
 												 },
 	'/deck/:id'        	 : function(id){ 
	                         Session.set('singleDeck', id.substr(id.length-17, id.length));
	                         return 'singledeck';
	                       },
	'/card/:id'        	 : function(id){ 
	                         Session.set('singleCard', id.substr(id.length-6, id.length));
	                         return 'singlecard';
	                       },
});
