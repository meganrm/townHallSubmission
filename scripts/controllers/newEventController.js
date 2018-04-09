(function(module) {
  var newEventController = {};

  newEventController.index = function(ctx) {
    if (ctx.mocs.length) {
      newEventView.render(ctx.mocs, ctx.congressScope, ctx.params.state);
    } else{
      page('/');
    }
  };

  newEventController.loadByState = function(ctx, next) {
    ctx.congressScope = 'state';
    ctx.mocNamesPath = 'state_legislators_id/' + ctx.params.state + '/';
    Moc.mocIdPath = 'state_legislators_id/' + ctx.params.state + '/';
    Moc.mocDataPath = 'state_legislators_data/' + ctx.params.state + '/';
    TownHall.savePath = 'state_legislators_user_submission/' + ctx.params.state + '/';
    Moc.loadAll(ctx.mocNamesPath).then(function(allnames){
      ctx.mocs = allnames;
      newEventController.index(ctx);
      next();
    });
  };

  newEventController.loadStateCandidates = function (ctx, next) {
    ctx.congressScope = 'state';
    ctx.mocNamesPath = 'state_candidates_id/' + ctx.params.state + '/';
    Moc.mocIdPath = 'state_candidates_id/' + ctx.params.state + '/';
    Moc.mocDataPath = 'state_candidates_data/' + ctx.params.state + '/';
    TownHall.savePath = 'state_legislators_user_submission/' + ctx.params.state + '/';
    Moc.loadAll(ctx.mocNamesPath).then(function (allnames) {
      ctx.mocs = allnames;
      newEventController.index(ctx);
      next();
    });
  };

  newEventController.loadFederal = function(ctx, next) {
    ctx.congressScope = 'federal';
    ctx.mocNamesPath = 'mocID/';
    Moc.mocIdPath = 'mocID/';
    Moc.mocDataPath = 'mocData/';
    TownHall.savePath = 'UserSubmission/';
    if (Moc.allNames.length > 0) {
      ctx.mocs = Moc.allFederal;
      next();
    } else {
      return Moc.loadAll(ctx.mocNamesPath).then(function(allnames){
        Moc.allFederal = allnames;
        ctx.mocs = Moc.allFederal;
        return next();
      }).catch(function(err){
        console.log(err);
      });
    }
  };

  newEventController.loadFederalCandidates = function (ctx, next) {
    ctx.congressScope = 'federal';
    ctx.mocNamesPath = 'candidate_keys/';
    Moc.mocIdPath = 'candidate_keys/';
    Moc.mocDataPath = 'candidate_data/';
    TownHall.savePath = 'UserSubmission/';
    if (Moc.allNames.length > 0) {
      ctx.mocs = Moc.allFederal;
      next();
    } else {
      return Moc.loadAll(ctx.mocNamesPath).then(function (allnames) {
        Moc.allFederal = allnames;
        ctx.mocs = Moc.allFederal;
        return next();
      }).catch(function (err) {
        console.log(err);
      });
    }
  };

  newEventController.switchTab = function(ctx, next) {
    newEventView.resetData();
    newEventView.switchTab(ctx.params.state);
    next();
  };

  newEventController.selectCandidateMode = function(ctx, next){
    $('.mode-switcher #current-moc').removeClass('active');
    $('.mode-switcher #candidate').addClass('active');
    next();
  }

  newEventController.resetModeButton = function (ctx, next) {
    $('.mode-switcher #current-moc').addClass('active');
    $('.mode-switcher #candidate').removeClass('active');
    next();
  }

  module.newEventController = newEventController;
})(window);
