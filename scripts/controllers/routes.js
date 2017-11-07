page('/',
  newEventController.loadFederal,
  newEventController.index
);

page('/state/:state',
  newEventController.loadByState,
  newEventController.index)

page();
