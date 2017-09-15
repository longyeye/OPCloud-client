const joint = require('rappid');

export function opmRuleSet(validator, graph) {
  validator.validate(
    "change:target change:source",
    function (err, command, next) {
      if (command.data.type === 'opm.Link') {
        const link = graph.getCell(command.data.id);
        var source = link.getSourceElement();
        var target = link.getTargetElement();
        if ((null === target)) {
          return next('A link must connect to a target element!');
        }
        else if(target.id == source.get('parent')){
          return next('A state cannot be connected to his object!');
        }
        if ((source.attributes.type == 'opm.State') && (target.attributes.type == 'opm.State') && source.get('parent')==target.get('parent')) {
          return next('A link cannot connect between two states inside the same object!');
        }
        if(source.id == target.id){
          return next('An element cannot be connected to itself!');
        }
      }
      return next();
    },

    function (err, command, next) {
      const errorMessage = new joint.ui.FlashMessage({
        title: 'Validation Error!',
        type: 'alert',
        content: err
      });
      if (err) errorMessage.open();
      return next(err);
    })
}
