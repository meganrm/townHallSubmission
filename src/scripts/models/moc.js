import { firebasedb } from '../util/setupFirebase';

class Moc {
    constructor(opts) {
        for (const keys in opts) {
            this[keys] = opts[keys];
        }
    }

    updateFB() {
        const mocObj = this;
        return firebasedb.ref(`/mocData/${mocObj.govtrack_id}`)
            .update(mocObj)
            .then(() => mocObj).catch(() => {
                reject('could not update', mocObj);
            });
    }

    static getMember(member) {
        let memberKey;
        let firstname;
        let middlename;
        let lastname;
        const nameArray = member.replace(/\./g, '').split(' '); // can't store any endpoints with '.' in them.
        if (nameArray.length > 2) {
            // can be in format Michael H Wray, Yvonne Lewis Holley, L. Louise Lucas, Lynwood W. Lewis, Jr.
            firstname = nameArray[0].toLowerCase();
            middlename = nameArray[1].toLowerCase();
            lastname = nameArray[2].toLowerCase().replace(/\,/g, '');
            if (firstname.length === 1 || middlename.length === 1) {
                memberKey = `${lastname}_${firstname}_${middlename}`;
            } else {
                // not ideal, but we had some members with two last names
                memberKey = `${middlename + lastname}_${firstname}`;
            }
        } else {
            firstname = nameArray[0].toLowerCase();
            lastname = nameArray[1].toLowerCase().replace(/\,/g, '');
            memberKey = `${lastname}_${firstname}`;
        }
        console.log(memberKey, Moc.mocIdPath);
        return firebasedb.ref(Moc.mocIdPath + memberKey)
            .once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return firebasedb.ref(Moc.mocDataPath + snapshot.val().id)
                        .once('value')
                        .then((dataSnapshot) => {
                            if (dataSnapshot.exists()) {
                                return dataSnapshot.val();
                            }
                        });
                }
                Error('That member is not in our database, please check the spelling, and only use first and last name.');
            });
    }

    static loadAll(path) {
        const allNames = [];
        return firebasedb.ref(path).once('value')
            .then((snapshot) => {
                snapshot.forEach((member) => {
                    const memberobj = new Moc(member.val());
                    Moc.allMocsObjs[member.key] = memberobj;
                    const name = memberobj.nameEntered;
                    if (!name) {
                        console.log(member.key);
                    } else if (allNames.indexOf(name) === -1) {
                        allNames.push(name);
                    }
                });
                return allNames;
            });
    }
}

Moc.allMocsObjs = {};
Moc.allNames = [];

export default Moc;
