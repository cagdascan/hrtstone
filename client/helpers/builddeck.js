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
	}
});

Template.builddeck.helpers({
	selected_class_tab: function () {
		return Session.get('class');
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
};
