(function(module) {
  var newEventController = {};


  newEventController.index = function(ctx) {
    if(ctx.mocs.length) {
      newEventView.render(ctx.mocs, ctx.congressScope);
    } else{
      page('/');
    }
  };

  newEventController.loadByState = function(ctx, next) {
    ctx.congressScope = 'state';
    ctx.lookupPath = 'state_legislators_id/' + ctx.params.state + '/';
    Moc.lookupPath = 'state_legislators_data/' + ctx.params.state + '/';
    TownHall.savePath = 'state_legislators_user_submission/' + ctx.params.state + '/'

    Moc.loadAll(ctx.lookupPath).then(function(allnames){
      ctx.mocs = allnames;
      newEventController.index(ctx)
      next();
    });
  };

  newEventController.loadFederal = function(ctx, next) {
    ctx.congressScope = 'federal';
    ctx.lookupPath = 'mocID/';
    Moc.lookupPath = 'mocData/';
    TownHall.savePath = 'UserSubmission/'
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
