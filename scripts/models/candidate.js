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
        var newPostKey = firebase.database().ref().child('candidate_data').push().key;
        this.thp_key = newPostKey;
        var member = this.displayName;
        var memberKey;
        let nameArray = member.split(' ');
        if (nameArray.length > 2) {
            var firstname = nameArray[0];
            var middlename = nameArray[1];
            var lastname = nameArray[2];
            if (firstname.length === 1 || middlename.length === 1) {
                memberKey = lastname.toLowerCase().replace(/\,/g, '') + '_' + firstname.toLowerCase() + '_' + middlename.toLowerCase();
            } else {
                memberKey = middlename.toLowerCase() + lastname.toLowerCase().replace(/\,/g, '') + '_' + firstname.toLowerCase();
            }
        } else {
            memberKey = nameArray[1].toLowerCase().replace(/\,/g, '') + '_' + nameArray[0].toLowerCase();
        }
        var lookupData = {
            id: newPostKey,
            nameEntered: this.displayName,
        }
        var updates = {};
        updates['/candidate_data/' + newPostKey] = this;
        updates['/candidate_keys/' + memberKey] = lookupData;
        return firebase.database().ref().update(updates);
    }
}