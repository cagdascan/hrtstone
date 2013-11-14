Template.builddeck.events({
	///******* Left class navigation ********/////
	'click ul#classes li': function (event) {
		var selected_class = $(event.currentTarget).attr('id');
		var target = event.currentTarget;
		Session.set('selected_class_id', selected_class);
		if (Deck.find({}).count() > 0){
			$('#delete_current_deck').modal({
		  	keyboard: false,
		  	backdrop: 'static'
			});
		}
		else{
			Session.set('neutral_selected', false);
			Session.set('class', selected_class);
			Session.set('cost', 'All');
			//*** reset mana filter ***///
			$('.filter3 ul.manas li').removeClass('active');
			$('#all').addClass('active');
			//*************************///
			Session.set('page_number', 0); // reset page
		}
	},
	///*** Confirming delete deck button when changing class ***///
	'click button#delete_deck': function (event) {
		$('#delete_current_deck').modal('hide');
		Session.set('neutral_selected', false);
		Session.set('class', Session.get('selected_class_id'));
		Session.set('cost', 'All');
		$('.filter1 ul#classes li').removeClass('active');
		$('.filter3 ul.manas li').removeClass('active');
		$('#all').addClass('active');
		Session.set('page_number', 0);
		Deck.remove({}); // delete your current deck
	},
	/// **** Canceling class navigation and continuing your deck building **** //
	'click button#cancel_delete_deck': function (event) {
		$('#delete_current_deck').modal('toggle');
	},
	///*************** Mana filtering **************** ///
	'click ul.manas li': function (event) {
		var selected_cost = $(event.currentTarget).text();
		Session.set('cost', selected_cost);
		$( '.filter3 ul.manas li').removeClass('active');
		$(event.currentTarget).addClass('active');
		Session.set('page_number', 0);
	},
	///*** Top class and neutral navigation ********* ////
	'click .filter3 ul.classes li#neutral': function (event) {
		Session.set('neutral_selected', true);
		Session.set('page_number', 0);
	},
	///*** Top class and neutral navigation *************///
	'click .filter3 ul.classes li#notneutral': function (event){
		Session.set('neutral_selected', false);
		Session.set('page_number', 0);
	},
	///****** Navigate cards with right arrow **********///
	'click i.fa.fa-chevron-circle-right.arrow_right': function (event){
		Session.set('page_number', (Session.get('page_number') + 1 ) % Session.get('page_count'));
	},
	///****** Navigate cards with left arrow **************///
	'click i.fa.fa-chevron-circle-left.arrow_left': function (event){
		Session.set('page_number', (Session.get('page_number') - 1 ) % Session.get('page_count'));
	},
	///****** Filter cards with left abilities navigation *******///
	'click .filter2 ul li': function (event){
		$(event.currentTarget).toggleClass('active');
	},
	///******* Remove cards from your current deck **********///
	'click .filter4 .cardlist li': function () {
			if (this.count == 2)
				Deck.update({_id:this._id}, {$set:{'count': 1}});
			else
				Deck.remove({_id:this._id});
	},
	///******* Adding cards to your current deck *************///
	'click ul.cards li': function (event){
		var total = 0;
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});
		if (total < 30){ // add upto 30 cards
			if (this.rarity != 'legendary'){ // allow upto 2 card if not legendary
				if (Deck.find({'cardid': this.cardid}).count() == 1)
					Deck.update({'cardid': this.cardid}, {$set:{'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 2}})
				else
					Deck.insert({'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 1});
			}
			else{ // allow 1 card if legendary
				if (Deck.find({'cardid': this.cardid}).count() == 1)
					return;
				else
					Deck.insert({'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 1});
			}
		}
		else
			return;
	},
	///*** Done button opens save model or login dropdown *****///
	'click span.btn.btn-default.btn-done': function (event) {
		if (Meteor.user() == null){
			event.stopPropagation();
			$('.dropdown-toggle').dropdown('toggle');
		}
		else{
			$('#done').modal('show');
			var deck_name = $('#deck_name').val();
			$('#deck_name_in_modal').val(deck_name);
		}
	},
	'click #save': function (event) {

		var gravatar_url = Gravatar.imageUrl(Meteor.user().emails[0].address);
		var deckname = $('#deck_name_in_modal').val();
		var description = $('#desc_in_modal').val();
		var decklist = Deck.find().fetch();

		Decks.insert({'userid'      : Meteor.userId(),
									'username'    : Meteor.user().username,
									'userpicture' : gravatar_url,
	                'deckname'    : deckname, 
	                'description' : description,
	                'class'       : Session.get('class'),
	                'decklist'    : decklist,
	                'timestamp'   : new Date(),
	                'comments'    : [],
	                'upvotes'     : [],
	                'upvotes_count': 0,
	                'comments_count': 0
	               });

		Deck.remove({}); //clear local deck
		$('#done').modal('toggle'); //hide the modal
		$('body').removeClass('modal-open');
		Meteor.Router.to('/decks/latest'); //route to decks latest page
	}
});

Template.builddeck.helpers({
	selected_class_tab: function () {
		return Session.get('class');
	},
	current_card_count_in_deck: function () {
		var total = 0;
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	disabled: function () {
		var total = 0;
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});
		if (total == 4)
			return '';
		else
			return 'disabled';
	},
	not_neutral_active: function () {
		if (Session.get('neutral_selected') == true)
			return '';
		else
			return 'active';
	},
	neutral_active: function () {
		if (Session.get('neutral_selected') == true)
			return 'active';
		else
			return '';
	},
	druid_class_active: function () {
		if (Session.get('class') == "Druid")
			return 'active';
		else
			return '';
	},
	hunter_class_active: function () {
		if (Session.get('class') == "Hunter")
			return 'active';
		else
			return '';
	},
	mage_class_active: function () {
		if (Session.get('class') == "Mage")
			return 'active';
		else
			return '';
	},
	paladin_class_active: function () {
		if (Session.get('class') == "Paladin")
			return 'active';
		else
			return '';
	},
	priest_class_active: function () {
		if (Session.get('class') == "Priest")
			return 'active';
		else
			return '';
	},
	rogue_class_active: function () {
		if (Session.get('class') == "Rogue")
			return 'active';
		else
			return '';
	},
	shaman_class_active: function () {
		if (Session.get('class') == "Shaman")
			return 'active';
		else
			return '';
	},
	warlock_class_active: function () {
		if (Session.get('class') == "Warlock")
			return 'active';
		else
			return '';
	},
	warrior_class_active: function () {
		if (Session.get('class') == "Warrior")
			return 'active';
		else
			return '';
	},
	height_0: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_0 == 0)
			return 0;
		if (total_0 >= total_1 && total_0 >= total_2 && 
				total_0 >= total_3 && total_0 >= total_4 && 
				total_0 >= total_5 && total_0 >= total_6 && 
				total_0 >= total_7)
			return 80;
		else
			return total_0 / max * 80;
	},
	mana_count_0: function () {
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_1: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_1 == 0)
			return 0;
		if (total_1 >= total_0 && total_1 >= total_2 && 
				total_1 >= total_3 && total_1 >= total_4 && 
				total_1 >= total_5 && total_1 >= total_6 && 
				total_1 >= total_7)
			return 80;
		else
			return total_1 / max * 80;
	},
	mana_count_1: function () {
		var total = 0;
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_2: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_2 == 0)
			return 0;
		if (total_2 >= total_0 && total_2 >= total_1 && 
			  total_2 >= total_3 && total_2 >= total_4 && 
			  total_2 >= total_5 && total_2 >= total_6 && 
			  total_2 >= total_7)
			return 80;
		else
			return total_2 / max * 80;
	},
	mana_count_2: function () {
		var total = 0;
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_3: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_3 == 0)
			return 0;
		if (total_3 >= total_0 && total_3 >= total_1 && 
			  total_3 >= total_2 && total_3 >= total_4 && 
			  total_3 >= total_5 && total_3 >= total_6 && 
			  total_3 >= total_7)
			return 80;
		else
			return total_3 / max * 80;
	},
	mana_count_3: function () {
		var total = 0;
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_4: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_4 == 0)
			return 0;
		if (total_4 >= total_0 && total_4 >= total_1 && 
			  total_4 >= total_2 && total_4 >= total_3 && 
			  total_4 >= total_5 && total_4 >= total_6 && 
			  total_4 >= total_7)
			return 80;
		else
			return total_4 / max * 80;
	},
	mana_count_4: function () {
		var total = 0;
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_5: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_5 == 0)
			return 0;
		if (total_5 >= total_0 && total_5 >= total_1 && 
			  total_5 >= total_2 && total_5 >= total_3 && 
			  total_5 >= total_4 && total_5 >= total_6 && 
			  total_5 >= total_7)
			return 80;
		else
			return total_5 / max * 80;
	},
	mana_count_5: function () {
		var total = 0;
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_6: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_6 == 0)
			return 0;
		if (total_6 >= total_0 && total_6 >= total_1 && 
			  total_6 >= total_2 && total_6 >= total_3 && 
			  total_6 >= total_4 && total_6 >= total_5 && 
			  total_6 >= total_7)
			return 80;
		else
			return total_6 / max * 80;
	},
	mana_count_6: function () {
		var total = 0;
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	height_7: function () {
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var total = 0;
		Deck.find({'cost': '0'}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': '1'}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': '2'}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': '3'}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': '4'}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': '5'}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': '6'}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total_7 = total_7 + i.count;
		});
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});

		var all_cost_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];
		var max = _.max(all_cost_array);

		if (total_7 == 0)
			return 0;
		if (total_7 >= total_0 && total_7 >= total_1 && 
			  total_7 >= total_2 && total_7 >= total_3 && 
			  total_7 >= total_4 && total_7 >= total_5 && 
			  total_7 >= total_6)
			return 80;
		else
			return total_7 / max * 80;
	},
	mana_count_7: function () {
		var total = 0;
		Deck.find({$or:[
										{'cost' : '7'},
										{'cost' : '8'},
										{'cost' : '9'},
										{'cost' : '10'},
										{'cost' : '12'},
										{'cost' : '20'},
						 	 		 ]
							}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	}
});

Template.builddeck.rendered = function () {
	///********* Arrow show or hide based on page count *****///
	if (Session.get('page_number') == 0)
		$('.arrow_left').hide();
	else
		$('.arrow_left').show();

	if (Session.get('page_number') + 1 == Session.get('page_count'))
		$('.arrow_right').hide();
	else
		$('.arrow_right').show();
};

Template.currentdeck.helpers({
	card: function () {
		return Deck.find({}, {sort:{'cost': 1}}).fetch();
	},
	more_than_one: function () {
		if (this.count == 2)
			return true;
		else
			return false;
	}
});
