(function () {

  var customMatchers = {
    toBeSuccessorOf: function (util, customEqualityTesters) {
      return {
        compare: function (successor, predecessor) {
          if (successor.get('predecessors').contains(predecessor)) {
            if (predecessor.get('successor') === successor) {
              return {
                pass: true,
                message: 'Is successor of'
              };
            }
            return {
              pass: false,
              message: 'Missing Link from predecessor to successor'
            };
          }
          return {
            pass: false,
            message: 'Missing Link from successor to predecessor'
          };
        }
      };
    },
    toBeLinkedTo: function (util, customEqualityTesters) {
      return {
        compare: function (knob, targetPage) {
          if (_.contains(knob.get('links').map(function (link) { return link.get('target'); }), targetPage)) {
            return {
              pass: true,
              message: knob + ' is linked to ' + targetPage
            };
          }
          return {
            pass: false,
            message: knob + ' is not linked to ' + targetPage
          };
        }
      };
    },
    toBeEmpty: function (util, customEqualityTesters) {
      return {
        compare: function (collection) {
          if (collection.isEmpty()) {
            return {
              pass: true
            };
          }
          return {
            pass: false,
            message: collection + ' should be empty.'
          };
        }
      };
    }
  };

  beforeEach(function () {
    jasmine.addMatchers(customMatchers);
  });

}());
