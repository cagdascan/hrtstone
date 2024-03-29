Template.builddeck.events({
	///******* Left class navigation ********////	
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
			Session.set('abilities', []);
			$('#deck_name').val('');
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
		Session.set('abilities', []);
		$('.filter1 ul#classes li').removeClass('active');
		$('.filter3 ul.manas li').removeClass('active');
		$('#all').addClass('active');
		$('#deck_name').val('');
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
		if (selected_cost != 'All'){
			selected_cost = parseInt(selected_cost); // string to num conversion
		}
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
	'click li.ability': function(event) {
    $(event.currentTarget).toggleClass('active');

    var values = [];
    if ($('ul#abilities').find('.active').html() == undefined){
      Session.set('abilities', []);
    }
    else
    {
      $('ul#abilities').find('.active').each( function() {
        values.push($(this).html());
        Session.set('abilities', values);
      });
    }
    Session.set('page_number', 0);
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
					Deck.update({'cardid': this.cardid}, {$set:{'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 2, 'rarity': this.rarity}})
				else
					Deck.insert({'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 1, 'rarity': this.rarity});
			}
			else{ // allow 1 card if legendary
				if (Deck.find({'cardid': this.cardid}).count() == 1)
					return;
				else
					Deck.insert({'cardid': this.cardid, 'name':this.name, 'cost':this.cost, 'count': 1, 'rarity': this.rarity});
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
			var content = "<ul><li>This is an H1</li><li>==========</li><li>This is an H2</li><li>----------------</li><hr/><li><em>*This is italic*</em></li><li><strong>**This is bold**</strong></li><hr/><li>This is an ordered list</li><li>1. Mage</li><li>2. Hunter</li><li>3. Priest</li><hr/><li>This is [an example](http://exampleexample.com/ 'Title') inline link.</li></ul>";
				$('#markdown-info').popover({placement: 'right',
																 content: 'hey',
																 title: 'You can use <a href="http://daringfireball.net/projects/markdown/" target="_blank">markdown</a> here!',
																 html: true,
																 content: content
																});
			var deck_name = $('#deck_name').val();
			$('#deck_name_in_modal').val(deck_name);
			Session.set('save_error', '');
		}
	},
	'click #save': function (event) {

		var gravatar_url = Gravatar.imageUrl(Meteor.user().emails[0].address);
		var deckname = $('#deck_name_in_modal').val();
		var description = $('#desc_in_modal').val();
		var decklist = Deck.find().fetch();

		if (deckname.length > 3){

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
			Session.set('desc', ''); //clear preview pane
			$('#done').modal('toggle'); //hide the modal
			$('body').removeClass('modal-open');
			Meteor.Router.to('/latest'); //route to decks latest page
		}
		else if (deckname.length == 0)
			Session.set('save_error', "<div class='alert alert-danger'>A deck <strong>without a name</strong> is like a Mage without any spell.</div>");
		else
			Session.set('save_error', "<div class='alert alert-danger'>You don't have enough mana. Oops, <strong>not enough chars</strong> we mean...</div>");
	},
	///*** Tab navigation in save your deck modal *****///
	'click #desc_write': function (){
		$('#desc_write').tab('show');
	},
	///*** Tab navigation in save your deck modal *****///
	'click #desc_preview': function (){
		$('#desc_preview').tab('show');
	},
	///*** Refreshes preview pane in save your deck modal ***///
	'keyup #desc_in_modal': function () {
		var desc = document.getElementById("desc_in_modal").value;
		Session.set('desc', desc);
	},
	'click i#markdown-info': function () {
		$('#markdown-info').popover({placement: 'right',
																 content: 'hey',
																 title: 'You can use markdown here!',
																 html: true,
																 content: ''
																});
	}
});

Template.builddeck.helpers({
	selected_class_tab: function () {
		return Session.get('class');
	},
	description: function () {
		return Session.get('desc');
	},
	current_card_count_in_deck: function () {
		var total = 0;
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	},
	save_error: function () {
		return new Handlebars.SafeString(Session.get('save_error'));
	},
	disabled: function () {
		var total = 0;
		Deck.find({}).fetch().forEach(function(i){
			total = total + i.count;
		});
		if (total == 30)
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
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
		Deck.find({'cost': 1}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 2}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 3}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 4}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 5}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
		Deck.find({'cost': 6}).fetch().forEach(function(i){
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
		Deck.find({'cost': 0}).fetch().forEach(function(i){
			total_0 = total_0 + i.count;
		});
		Deck.find({'cost': 1}).fetch().forEach(function(i){
			total_1 = total_1 + i.count;
		});
		Deck.find({'cost': 2}).fetch().forEach(function(i){
			total_2 = total_2 + i.count;
		});
		Deck.find({'cost': 3}).fetch().forEach(function(i){
			total_3 = total_3 + i.count;
		});
		Deck.find({'cost': 4}).fetch().forEach(function(i){
			total_4 = total_4 + i.count;
		});
		Deck.find({'cost': 5}).fetch().forEach(function(i){
			total_5 = total_5 + i.count;
		});
		Deck.find({'cost': 6}).fetch().forEach(function(i){
			total_6 = total_6 + i.count;
		});
		Deck.find({$or:[
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
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
										{'cost' : 7},
										{'cost' : 8},
										{'cost' : 9},
										{'cost' : 10},
										{'cost' : 12},
										{'cost' : 20},
						 	 		 ]
							}).fetch().forEach(function(i){
			total = total + i.count;
		});
		return total;
	}
});
Template.cards.rendered = function () {
	$.each(document.images, function(){
		var this_image = this;
		var src = $(this_image).attr('src') || '' ;
		if(src === "/img/hearthstone-card-back.png" ){
			//this_image.src = options.loading; // show loading
			var lsrc = $(this_image).attr('lsrc') || '' ;
			if(lsrc.length > 0){
				var img = new Image();
				img.src = lsrc;
				$(img).load(function() {
					// $(this_image).attr('src', this.src ) 
					this_image.src = this.src;
				});
			}
		}
	});
};
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

	if (Session.get('page_count') == 0){
		$('.arrow_left').hide();
		$('.arrow_right').hide();
	}

	Session.get('abilities').forEach(function(ability){ 
    $("li[data-value='" + ability + "']").addClass('active');
  });

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
	},
	legendary: function () {
		if (this.rarity == 'legendary')
			return true;
		else
			return false;
	}
});
