//= require support/sinon
//= require support/chai
//= require support/sinon-chai

//= require support/factories

//= require jquery
//= require backbone-rails
//= require i18n
//= require i18n/translations

//= require pageflow/editor/base

//= require pageflow/graph_editor/editor.js

window.expect = chai.expect;

chai.Assertion.addMethod('linkedTo', function (targetPage) {
  var knob = this._obj;

  this.assert(_.contains(knob.get('links').map(function (link) { return link.get('target'); }), targetPage),
              knob + ' is linked to ' + targetPage,
              knob + ' is not linked to ' + targetPage
             );
});

chai.Assertion.addMethod('successorOf', function (predecessor) {
  var successor  =this._obj;

  this.assert(successor.get('predecessors').contains(predecessor) &&
               predecessor.get('successor') === successor,
               successor + ' is successor of ' + predecessor,
               'Missing Link');
});
