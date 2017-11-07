(function (module) {
  function Moc(opts) {
    for (var keys in opts) {
      this[keys] = opts[keys];
    }
  }

  Moc.allMocsObjs = {};
  Moc.allNames = [];

  Moc.getMember = function (member) {
    var memberKey;
    if (member.split(' ').length === 3) {
      memberKey = member.split(' ')[1].toLowerCase() + member.split(' ')[2].toLowerCase() + '_' + member.split(' ')[0].toLowerCase();
    } else {
      memberKey = member.split(' ')[1].toLowerCase() + '_' + member.split(' ')[0].toLowerCase();
    }
    var memberid = Moc.allMocsObjs[memberKey].id;
    console.log(Moc.lookupPath, memberid);
    return new Promise(function(resolve, reject){
      firebase.database().ref(Moc.lookupPath + memberid).once('value').then(function (snapshot) {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject('That member is not in our database, please check the spelling, and only use first and last name.');

        }
      });
    });
  };

  Moc.loadAll = function(path){
    var allNames = [];
    return new Promise(function (resolve, reject) {
      firebase.database().ref(path).once('value').then(function(snapshot){
        snapshot.forEach(function(member){
          var memberobj = new Moc(member.val());
          Moc.allMocsObjs[member.key] = memberobj;
          var name = memberobj.nameEntered;
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

  Moc.prototype.updateFB = function () {
    var mocObj = this;
    return new Promise(function (resolve, reject) {
      firebase.database().ref('/mocData/' + mocObj.govtrack_id).update(mocObj).then(function(){
        resolve(mocObj);
      }).catch(function (error) {
        reject('could not update', mocObj);
      });
    });
  };

  module.Moc = Moc;
})(window);
