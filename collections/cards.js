Cards = new Meteor.Collection('cards01');

if (Meteor.isClient){

	Deps.autorun(function() { 
    card_query = function(){
      return { $or:[
      							 {'class': Session.get('class')},
      							 {'class': ""}
      							]
      				 
      			 };
    }
    card_query = card_query();

    Meteor.subscribe('cards01', card_query, function(){
      Session.set('cards_subscription_ready', true);
    });
  });

	Template.cards.cards = function() {
		if (Session.get('neutral_selected') == true){
			if (Session.get('cost') == 'All')
				return Cards.find({'class': ""
											  	}, {limit: 8}).fetch();
			else if (Session.get('cost') == '7+')
				return Cards.find(
													{$or:[
																{'class': "",
												 	 			 'cost' : '7'
												 	 			},
												 	 			{'class': "",
												 	 			 'cost' : '8'
												 	 			},
												 	 			{'class': "",
												 	 			 'cost' : '9'
												 	 			},
												 	 			{'class': "",
												 	 			 'cost' : '10'
												 	 			},
												 	 		 ]
													}, {limit: 8}).fetch();
			else
				return Cards.find({'class': "",
												 	 'cost' : Session.get('cost')
													}, {limit: 8}).fetch();
		}
		else if (Session.get('neutral_selected') == false)
		{
			if (Session.get('cost') == 'All'){
				var limited_array = [];
				var card_array = Cards.find({'class': Session.get('class')
											  	     			}).fetch();
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
			else if (Session.get('cost') == '7+'){
				var limited_array = [];
				var card_array = Cards.find(
																		{$or:[
																					{'class': Session.get('class'),
																	 	 			 'cost' : '7'
																	 	 			},
																	 	 			{'class': Session.get('class'),
																	 	 			 'cost' : '8'
																	 	 			},
																	 	 			{'class': Session.get('class'),
																	 	 			 'cost' : '9'
																	 	 			},
																	 	 			{'class': Session.get('class'),
																	 	 			 'cost' : '10'
																	 	 			},
																	 	 		 ]
																		}).fetch();
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
																	 	 'cost' : Session.get('cost')
																		}).fetch();
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
	}
}