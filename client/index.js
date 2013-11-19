Session.set('class', 'Druid');
Session.set('cost', 'All');
Session.set('neutral_selected', false);
Session.set('page_number', 0);
Session.set('page_count', 1);
Session.set('deck_sort', 'top');
Session.set('selected_class', 'All Classes');
Session.set('deck_limit', 10);
Session.set('save_error', '');
Session.set('current_comment', '');
Session.set('desc', '');

Deck = new Meteor.Collection(null); //local collection for deck building

