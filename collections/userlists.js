Lists = new Meteor.Collection('userlists');

if (Meteor.isClient){
  Meteor.subscribe('userlists');
}