import { firebasedb } from '../util/setupFirebase';

import Moc from './moc';

export default class Candidate {
    constructor(data) {
        console.log('data', data);
        this.chamber = data.chamber;
        this.is_candidate = true;
        this.party = data.party;
        this.displayName = data.Member;
        this.state = data.state;
        this.stateName = data.stateName;
        this.district = data.district || null;
    }

    save() {
    // Get a key for a new Post.
        const newPostKey = firebasedb.ref().child('candidate_data').push().key;
        this.thp_key = newPostKey;
        const member = this.displayName;
        let memberKey;
        const nameArray = member.split(' ');
        if (nameArray.length > 2) {
            const firstname = nameArray[0];
            const middlename = nameArray[1];
            const lastname = nameArray[2];
            if (firstname.length === 1 || middlename.length === 1) {
                memberKey = `${lastname.toLowerCase().replace(/,/g, '')}_${firstname.toLowerCase()}_${middlename.toLowerCase()}`;
            } else {
                memberKey = `${middlename.toLowerCase() + lastname.toLowerCase().replace(/,/g, '')}_${firstname.toLowerCase()}`;
            }
        } else {
            memberKey = `${nameArray[1].toLowerCase().replace(/,/g, '')}_${nameArray[0].toLowerCase()}`;
        }
        const lookupData = {
            id: newPostKey,
            nameEntered: this.displayName,
        };
        const updates = {};
        updates[Moc.mocDataPath + newPostKey] = this;
        updates[Moc.mocIdPath + memberKey] = lookupData;
        return firebasedb.ref().update(updates);
    }
}
