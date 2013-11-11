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
      Session.set('lists_subscription_ready', true);
    });
  });

	Template.cards.cards = function() {
		if (Session.get('neutral_selected') == true){
			console.log('neutral');
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
			console.log('not neutral');
			if (Session.get('cost') == 'All')
				return Cards.find({'class': Session.get('class')
											  	}, {limit: 8}).fetch();
			else if (Session.get('cost') == '7+')
				return Cards.find(
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
													}, {limit: 8}).fetch();
			else
				return Cards.find({'class': Session.get('class'),
												 	 'cost' : Session.get('cost')
													}, {limit: 8}).fetch();

		}
	}
}