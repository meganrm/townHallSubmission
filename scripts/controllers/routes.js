page('/',
  newEventController.switchTab,
  newEventController.resetModeButton,
  newEventController.loadFederal,
  newEventController.index
);

page('/candidate',
  newEventController.switchTab,
  newEventController.selectCandidateMode,
  newEventController.loadFederalCandidates,
  newEventController.index
);

page('/:state/candidate',
  newEventController.switchTab,
  newEventController.selectCandidateMode,
  newEventController.loadByState,
  newEventController.index
  
);

page('/:state',
  newEventController.switchTab,
  newEventController.resetModeButton,
  newEventController.loadByState,
  newEventController.index);

page();
