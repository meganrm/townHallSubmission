page('/',
  newEventController.switchTab,
  newEventController.loadFederal,
  newEventController.index
);

page('/state/:state',
  newEventController.switchTab,
  newEventController.loadByState,
  newEventController.index);

page();
