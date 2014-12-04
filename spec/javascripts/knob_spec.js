describe('Knob', function () {
  describe('the links property', function () {
    it('defaults to the empty collection', function () {
      expect(new Knob().get('links').isEmpty()).toBe(true);
    });

    it('triggers a change event if link is added', function () {
      var target = new Page(),
        source = knob(),
        listener = jasmine.createSpy('listener');
      source.on('change', listener);

      source.linkTo(target);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('#linkTo', function () {
    describe('an unlimited knob', function () {
      it('adds a link', function () {
        var target = new Page(),
        source = knob();

        source.linkTo(target);

        expect(source.get('links').length).toEqual(1);
      });

      it('adds a link to the incommingLinks', function () {
        var target = new Page(),
        source = knob();

        source.linkTo(target);

        expect(target.get('incommingLinks').length).toEqual(1);
      });
    });

    describe('a limited knob', function () {
      it('adds a link if limit is not exceeded', function () {
        var target = new Page(),
        source = knob(2);

        var result = source.linkTo(target);

        expect(result).toBeTruthy();
        expect(target.get('incommingLinks').length).toEqual(1);
      });

      it('doesnot add a link if it exceeds limit', function () {
        var target = new Page(),
        source = knob(0);

        var result = source.linkTo(target);

        expect(result).toBeFalsy();
        expect(target.get('incommingLinks').length).toEqual(0);
      });
    });
  });

  function knob(limit) {
    var created = new Knob({
      limit: limit
    });
    new Page({knobs: new KnobCollection([created])});
    return created;
  }

});
