(function(module) {
  var newEventController = {};

  newEventController.index = function(ctx) {
    console.log('index');
    if(ctx.mocs.length) {
      console.log('calling render');
      newEventView.render(ctx.mocs);
    } else{
      page('/');
    }
  };

  newEventController.loadByState = function(ctx, next) {
    ctx.lookupPath = 'state_legislators_id/' + ctx.params.state;
    Moc.loadAll(ctx.lookupPath).then(function(allnames){
      ctx.mocs = allnames;
      newEventController.index(ctx)
      next();
    });
  };

  newEventController.loadFederal = function(ctx, next) {
    console.log('hey');
    ctx.lookupPath = 'mocID/';

    if (Moc.allNames.length > 0) {
      ctx.mocs = Moc.allFederal;
      next();
    } else {
      return Moc.loadAll(ctx.lookupPath).then(function(allnames){
        console.log('got names');
        Moc.allFederal = allnames;
        ctx.mocs = Moc.allFederal;
        // newEventController.index(ctx)
        return next();
      }).catch(function(err){
        console.log(err);
      });
    }
  };

  module.newEventController = newEventController;
})(window);
