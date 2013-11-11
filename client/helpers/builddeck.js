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
		
	}
});

Template.builddeck.helpers({
	selected_class_tab: function () {
		return Session.get('class');
	}
});