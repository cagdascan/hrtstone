Cards = new Meteor.Collection('cards01');

if (Meteor.isClient){

	Deps.autorun(function() {
		if (Meteor.Router.page() == 'builddeck'){ 
	    var card_query = function(){
	    	if (Session.get('abilities').length == 0){
	    		return { $or:[
	      							 {'class'    : Session.get('class'), 
	      							  'deckable' : true
	      							 },
	      							 {'class'		 : "Neutral", 
	      							  'deckable' : true
	      							 }
	      							]
	      				 
	      			 };	
	    	}
	    	else
		      return { $or:[
		      							 {'class'    : Session.get('class'), 
		      							  'deckable' : true,
		      							  'ability'  : {$all:Session.get('abilities')}
		      							 },
		      							 {'class'		 : "Neutral", 
		      							  'deckable' : true,
		      							  'ability'  : {$all:Session.get('abilities')}
		      							 }
		      							]
		      				 
		      			 };
	    }
	    card_query = card_query();
	  }

	  else if (Meteor.Router.page() == 'singlecard'){
			var card_query = function() {
	  		var cardid = Session.get('singleCard');
	  		return {'cardid': cardid};
	  	}
	  	card_query = card_query();
	  }

    Meteor.subscribe('cards01', card_query);
  });

  Template.cards.helpers({
  	cards: function () {
  		if (Session.get('neutral_selected') == true){
				if (Session.get('cost') == 'All'){
					var limited_array = [];
					var card_array = Cards.find({'class': "Neutral", 
																			 'ability': {$all:Session.get('abilities')}
																			},
																			{sort:{'cost':1}}
																			).fetch();

					_.each(card_array, function(obj){limited_array.push(obj);});

					Session.set('page_count', Math.ceil(card_array.length / 8));

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
					else if (Session.get('page_number') == 2)
						return limited_array.slice(16, 24);
					else if (Session.get('page_number') == 3)
						return limited_array.slice(24, 32);
					else if (Session.get('page_number') == 4)
						return limited_array.slice(32, 40);
					else if (Session.get('page_number') == 5)
						return limited_array.slice(40, 48);
					else if (Session.get('page_number') == 6)
						return limited_array.slice(48, 56);
					else if (Session.get('page_number') == 7)
						return limited_array.slice(56, 64);
					else if (Session.get('page_number') == 8)
						return limited_array.slice(64, 72);
					else if (Session.get('page_number') == 9)
						return limited_array.slice(72, 80);
					else if (Session.get('page_number') == 10)
						return limited_array.slice(80, 88);
					else if (Session.get('page_number') == 11)
						return limited_array.slice(88, 96);
					else if (Session.get('page_number') == 12)
						return limited_array.slice(96, 104);
					else if (Session.get('page_number') == 13)
						return limited_array.slice(104, 112);
					else if (Session.get('page_number') == 14)
						return limited_array.slice(112, 120);
					else if (Session.get('page_number') == 15)
						return limited_array.slice(120, 128);
					else if (Session.get('page_number') == 16)
						return limited_array.slice(128, 136);
					else if (Session.get('page_number') == 17)
						return limited_array.slice(136, 144);
					else if (Session.get('page_number') == 18)
						return limited_array.slice(144, 152);
					else if (Session.get('page_number') == 19)
						return limited_array.slice(152, 160);
					else if (Session.get('page_number') == 20)
						return limited_array.slice(160, 168);
					else if (Session.get('page_number') == 21)
						return limited_array.slice(168, 176);
					else if (Session.get('page_number') == 22)
						return limited_array.slice(176, 184);
					else if (Session.get('page_number') == 23)
						return limited_array.slice(184, 192);
					else if (Session.get('page_number') == 24)
						return limited_array.slice(192, 200);
					else if (Session.get('page_number') == 25)
						return limited_array.slice(200, 208);
					else if (Session.get('page_number') == 26)
						return limited_array.slice(208, 216);
				}
				else if (Session.get('cost') == '7'){
					var limited_array = [];
					var card_array = Cards.find(
																			{$or:[
																						{'class'  : "Neutral",
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost'   : 7
																		 	 			},
																		 	 			{'class': "Neutral",
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 8
																		 	 			},
																		 	 			{'class': "Neutral",
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 9
																		 	 			},
																		 	 			{'class': "Neutral",
																		 	 			 'cost' : 10,
																						 'ability': {$all: Session.get('abilities')}
																		 	 			},
																		 	 			{'class': "Neutral",
																		 	 			 'cost' : 12,
																						 'ability': {$all: Session.get('abilities')}
																		 	 			},
																		 	 			{'class': "Neutral",
																						 'ability': {$all: Session.get('abilities')},
																		 	 		   'cost' : 20
																		 	 		  }
																		 	 		 ]
																			},
																			{sort:{'cost':1}}
																			).fetch();

					Session.set('page_count', Math.ceil(card_array.length / 8));

					_.each(card_array, function(obj){limited_array.push(obj);});

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
				}
				else{
					var limited_array = [];
					var card_array = Cards.find({'class': "Neutral",
																			 'ability': {$all: Session.get('abilities')},
																		 	 'cost' : Session.get('cost')
																			},
																			{sort:{'cost':1}}
																			).fetch();
					Session.set('page_count', Math.ceil(card_array.length / 8));

					_.each(card_array, function(obj){limited_array.push(obj);});

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
					else if (Session.get('page_number') == 2)
						return limited_array.slice(16, 24);
					else if (Session.get('page_number') == 3)
						return limited_array.slice(24, 32);
					else if (Session.get('page_number') == 4)
						return limited_array.slice(32, 40);
					else if (Session.get('page_number') == 5)
						return limited_array.slice(40, 48);
					else if (Session.get('page_number') == 6)
						return limited_array.slice(48, 56);
					else if (Session.get('page_number') == 7)
						return limited_array.slice(56, 64);

				}
			}
			else if (Session.get('neutral_selected') == false)
			{
				if (Session.get('cost') == 'All'){
					var limited_array = [];
					var card_array = Cards.find({'class': Session.get('class'),
																			 'ability': {$all: Session.get('abilities')},
												  	     			},{sort:{'cost':1}}).fetch();
					_.each(card_array, function(obj){limited_array.push(obj);});

					Session.set('page_count', Math.ceil(card_array.length / 8));

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
					else if (Session.get('page_number') == 2)
						return limited_array.slice(16, 24);
					else if (Session.get('page_number') == 3)
						return limited_array.slice(24, 32);
					else if (Session.get('page_number') == 4)
						return limited_array.slice(32, 40);
					else if (Session.get('page_number') == 5)
						return limited_array.slice(40, 48);
					else if (Session.get('page_number') == 6)
						return limited_array.slice(48, 56);
				}
				else if (Session.get('cost') == '7'){
					var limited_array = [];
					var card_array = Cards.find(
																			{$or:[
																						{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 7
																		 	 			},
																		 	 			{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 8
																		 	 			},
																		 	 			{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 9
																		 	 			},
																		 	 			{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 10
																		 	 			},
																		 	 			{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 12
																		 	 			},
																		 	 			{'class': Session.get('class'),
																						 'ability': {$all: Session.get('abilities')},
																		 	 			 'cost' : 20
																		 	 			}
																		 	 		 ]
																			},{sort:{'cost':1}}).fetch();
					Session.set('page_count', Math.ceil(card_array.length / 8));

					_.each(card_array, function(obj){limited_array.push(obj);});

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
					else if (Session.get('page_number') == 2)
						return limited_array.slice(16, 24);
				}
				else{
					
					var limited_array = [];
					var card_array = Cards.find({'class': Session.get('class'),
																			 'ability': {$all: Session.get('abilities')},
																		 	 'cost' : Session.get('cost')
																			},{sort:{'cost':1	}}).fetch();
					Session.set('page_count', Math.ceil(card_array.length / 8));

					_.each(card_array, function(obj){limited_array.push(obj);});

					if (Session.get('page_number') == 0)
						return limited_array.slice(0, 8);
					else if (Session.get('page_number') == 1)
						return limited_array.slice(8, 16);
					else if (Session.get('page_number') == 2)
						return limited_array.slice(16, 24);
				}

			}
		},
		lock: function () {
			if ((Deck.findOne({'cardid': this.cardid}) != undefined &&
					Deck.findOne({'cardid':this.cardid}).count == 2) ||
					(Cards.findOne({'cardid':this.cardid}).rarity == 'legendary' &&
					 Deck.findOne({'cardid': this.cardid}) != undefined)
				)
				return 'fa fa-lock lock';
			else
					return '';
		}
  });
}
