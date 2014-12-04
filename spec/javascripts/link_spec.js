describe('Link', function () {
  describe('#remove', function () {
    it('removes the link', function () {
      var knob = new Knob(),
          sourcePage = new Page({knobs: new KnobCollection([knob])}),
          targetPage = new Page(),
          link = knob.linkTo(targetPage);

      link.remove();

      expect(knob).not.toBeLinkedTo(targetPage);
    });
  });
});
