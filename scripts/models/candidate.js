class Candidate{
  constructor(data){
    console.log('data', data);
    this.chamber = data.chamber;
    this.is_candidate = true;
    this.party = data.party;
    this.displayName = data.Member;
    this.state = data.state;
    this.stateName = data.stateName;
    this.district = data.district || null;
  }

  save(){
        // Get a key for a new Post.
    let newPostKey = firebase.database().ref().child('candidate_data').push().key;
    this.thp_key = newPostKey;
    let member = this.displayName;
    let memberKey;
    let nameArray = member.split(' ');
    if (nameArray.length > 2) {
      let firstname = nameArray[0];
      let middlename = nameArray[1];
      let lastname = nameArray[2];
      if (firstname.length === 1 || middlename.length === 1) {
          memberKey = lastname.toLowerCase().replace(/\,/g, '') + '_' + firstname.toLowerCase() + '_' + middlename.toLowerCase();
        } else {
          memberKey = middlename.toLowerCase() + lastname.toLowerCase().replace(/\,/g, '') + '_' + firstname.toLowerCase();
        }
    } else {
      memberKey = nameArray[1].toLowerCase().replace(/\,/g, '') + '_' + nameArray[0].toLowerCase();
    }
    let lookupData = {
      id: newPostKey,
      nameEntered: this.displayName,
    };
    let updates = {};
    updates[Moc.mocDataPath + newPostKey] = this;
    updates[Moc.mocIdPath + memberKey] = lookupData;
    return firebase.database().ref().update(updates);
  }
}