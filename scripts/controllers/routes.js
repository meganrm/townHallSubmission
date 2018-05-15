page('/',
  newEventController.switchTab,
  newEventController.loadFederal,
  newEventController.index
);

page('/:state',
  newEventController.switchTab,
  newEventController.loadByState,
  newEventController.index);

page('/templates/*', function(){
  console.log('got here')
});

page();
