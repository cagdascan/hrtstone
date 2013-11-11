Template.builddeck.events({
	'click ul#classes li': function (event) {
		var selected_class = $(event.currentTarget).attr('class');
		Session.set('neutral_selected', false);
		Session.set('class', selected_class);
	},
	'click ul.manas li span': function (event) {
		var selected_cost = $(event.currentTarget).html();
		Session.set('cost', selected_cost);
	},
	'click ul.classes li#neutral': function (event) {
		Session.set('neutral_selected', true);
	},
	'click ul.classes li#notneutral': function (event){
		Session.set('neutral_selected', false);
	},
	'click i.fa.fa-arrow-circle-o-right.arrow_right': function (event){
		Session.set('page_number', (Session.get('page_number') + 1 ) % Session.get('page_count'));
	},
	'click i.fa.fa-arrow-circle-o-left.arrow_left': function (event){
		Session.set('page_number', (Session.get('page_number') - 1 ) % Session.get('page_count'));
	}
});

Template.builddeck.helpers({
	selected_class_tab: function () {
		return Session.get('class');
	}
});