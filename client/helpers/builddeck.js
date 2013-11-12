Template.builddeck.events({
	'click ul#classes li': function (event) {
		var selected_class = $(event.currentTarget).attr('id');
		Session.set('neutral_selected', false);
		Session.set('class', selected_class);
		Session.set('cost', 'All');
		$( '.filter1 ul#classes li').removeClass('active');
		$(event.currentTarget).addClass('active');
		Session.set('page_number', 0);
	},
	'click ul.manas li': function (event) {
		var selected_cost = $(event.currentTarget).text();
		Session.set('cost', selected_cost);
		$( '.filter3 ul.manas li').removeClass('active');
		$(event.currentTarget).addClass('active');
		Session.set('page_number', 0);
	},
	'click .filter3 ul.classes li#neutral': function (event) {
		$( '.filter3 ul.classes li').removeClass('active');
		$(event.currentTarget).addClass('active');
		Session.set('neutral_selected', true);
		Session.set('page_number', 0);
	},
	'click .filter3 ul.classes li#notneutral': function (event){
		$( '.filter3 ul.classes li').removeClass('active');
		$(event.currentTarget).addClass('active');
		Session.set('neutral_selected', false);
		Session.set('page_number', 0);
	},
	'click i.fa.fa-arrow-circle-o-right.arrow_right': function (event){
		Session.set('page_number', (Session.get('page_number') + 1 ) % Session.get('page_count'));
	},
	'click i.fa.fa-arrow-circle-o-left.arrow_left': function (event){
		Session.set('page_number', (Session.get('page_number') - 1 ) % Session.get('page_count'));
	},
	'click .filter2 ul li': function (event){
		$(event.currentTarget).toggleClass('active');
	},
	'click ul.cards li': function (event){
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
	}
});

Template.builddeck.rendered = function () {
	var placeholder = "Give a name to your deck"; //Change this to your placeholder text
	$("#Modal-Name").focus(function() {
		if ($(this).text() == placeholder) {
			$(this).text("");
		}
	}).focusout(function() {
		if (!$(this).text().length) {
			$(this).text(placeholder);
		}
	});
	//********* Arrow show or hide based on page count *****///////
	if (Session.get('page_number') == 0)
		$('.arrow_left').hide();
	else
		$('.arrow_left').show();

	if (Session.get('page_number') + 1 == Session.get('page_count'))
		$('.arrow_right').hide();
	else
		$('.arrow_right').show();
	///////////////////////////////////////////////////////////////
};

Template.currentdeck.card = function () {
	return Deck.find({}, {sort:{'cost': 1}}).fetch();
};

Template.currentdeck.helpers({
	card: function () {
		return Deck.find({}, {sort:{'cost': 1}}).fetch();
	}
});
