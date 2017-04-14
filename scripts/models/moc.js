(function (module) {
  function Moc(opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    }
  }

  Moc.allMocsObjs = [];

  Moc.loadAll = function(){
    var allNames = [];
    return new Promise(function (resolve, reject) {
      firebase.database().ref('MOCs/').once('value').then(function(snapshot){
        snapshot.forEach(function(member){
          var memberobj = member.val();
          Moc.allMocsObjs.push(memberobj);
          var name = memberobj.first_name + ' ' + memberobj.last_name;
          if (!name) {
            console.log(member.key);
          } else {
            if (allNames.indexOf(name) === -1){
              allNames.push(name);
            }
          }
        });
        resolve(allNames);
      });
    });
  };



  module.Moc = Moc;
})(window);
