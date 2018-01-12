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
    var firstname;
    var middlename;
    var lastname;
    var nameArray = member.replace(/\./g, '').split(' '); //can't store any endpoints with '.' in them.
    if (nameArray.length > 2) {
// can be in format Michael H Wray, Yvonne Lewis Holley, L. Louise Lucas, Lynwood W. Lewis, Jr.
      firstname = nameArray[0].toLowerCase();
      middlename = nameArray[1].toLowerCase();
      lastname = nameArray[2].toLowerCase().replace(/\,/g, '');
      if (firstname.length === 1 || middlename.length === 1) {
        memberKey = lastname + '_' + firstname + '_' + middlename;
      } else {
//not ideal, but we had some members with two last names
        memberKey = middlename + lastname + '_' + firstname;
      }
    } else {
      firstname = nameArray[0].toLowerCase();
      lastname = nameArray[1].toLowerCase().replace(/\,/g, '');
      memberKey = lastname + '_' + firstname;
    }
    console.log(memberKey, Moc.mocIdPath);
    return new Promise(function(resolve, reject){
      firebase.database().ref(Moc.mocIdPath + memberKey).once('value').then(function (snapshot) {
        if (snapshot.exists()) {
          firebase.database().ref(Moc.mocDataPath + snapshot.val().id).once('value').then(function(dataSnapshot){
            if (dataSnapshot.exists()) {
              resolve(dataSnapshot.val());
            }
          });
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
      }).catch(function () {
        reject('could not update', mocObj);
      });
    });
  };

  module.Moc = Moc;
})(window);
