import { firebasedb } from '../util/setupFirebase';

class TownHall {
    constructor(opts) {
        if (opts) {
            Object.keys(opts).forEach((key) => {
                this[key] = opts[key];
            });
        }
    }


    // writes to townhall, can take a key for update
    updateFB(key) {
        const newEvent = this;
        const metaData = { eventId: key, lastUpdated: newEvent.lastUpdated };
        const updates = {};
        return new Promise(((resolve, reject) => {
            firebasedb.ref(`/townHalls/${key}`).update(newEvent);
            updates[`/townHallIds/${key}`] = metaData;
            resolve(newEvent);
            return firebasedb.ref().update(updates).catch((error) => {
                reject('could not update', newEvent, error);
            });
        }));
    }

    updateUserSubmission(key, path) {
        const newEvent = this;
        return firebasedb.ref(path + key).update(newEvent);
    }

    // DATA PROCESSING BEFORE WRITE
    // gets time zone with location and date
    validateZone(id) {
        const newTownHall = this;
        let databaseTH;
        if (id) {
            databaseTH = TownHall.allTownHallsFB[id];
        } else {
            databaseTH = this;
        }
        const time = Date.parse(`${newTownHall.Date} ${databaseTH.Time}`) / 1000;
        const loc = `${databaseTH.lat},${databaseTH.lng}`;
        console.log(time, loc);
        return new Promise(((resolve, reject) => {
            const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${time}&key=AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM`;
            $.get(url, (response) => {
                if (!response.timeZoneName) {
                    reject('no timezone results', id, response);
                } else {
                    newTownHall.zoneString = response.timeZoneId;
                    const timezoneAb = response.timeZoneName.split(' ');
                    newTownHall.timeZone = timezoneAb.reduce((acc, cur) => {
                        acc += cur[0];
                        return acc;
                    }, '');
                    const offset = response.rawOffset / 60 / 60 + response.dstOffset / 60 / 60;
                    let utcoffset;
                    if (parseInt(offset) === offset) {
                        utcoffset = `UTC${offset}00`;
                    } else {
                        const fract = offset * 10 % 10 / 10;
                        const integr = Math.trunc(offset);
                        let mins = (Math.abs(fract * 60)).toString();
                        const zeros = '00';
                        mins = zeros.slice(mins.length) + mins;
                        utcoffset = `UTC${integr}${mins}`;
                    }

                    console.log(offset, `${newTownHall.Date.replace(/-/g, '/')} ${databaseTH.Time} ${utcoffset}`);
                    newTownHall.dateObj = new Date(`${newTownHall.Date.replace(/-/g, '/')} ${databaseTH.Time} ${utcoffset}`).getTime();
                    resolve(newTownHall);
                }
            }).fail((error) => {
                console.log(error);
            });
        }));
    }

    static cacheGeocode(addresskey, lat, lng, address, type) {
        firebasedb.ref(`geolocate/${type}/${addresskey}`).set(
            {
                lat,
                lng,
                formatted_address: address,
            },
        );
    }

    getLatandLog(address, type) {
        const newTownHall = this;
        console.log(address, type);
        return new Promise(((resolve, reject) => {
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM',
                data: {
                    address,
                },
                dataType: 'json',
                success(r) {
                    if (r.results[0]) {
                        newTownHall.lat = r.results[0].geometry.location.lat;
                        newTownHall.lng = r.results[0].geometry.location.lng;
                        newTownHall.address = r.results[0].formatted_address.split(', USA')[0];
                        const addresskey = address.replace(/\W/g, '');
                        addresskey.trim();
                        // firebasedb.ref('/townHallsErrors/geocoding/' + newTownHall.eventId).remove();
                        TownHall.cacheGeocode(addresskey, newTownHall.lat, newTownHall.lng, newTownHall.address, type);
                        resolve(newTownHall);
                    } else {
                        firebasedb.ref(`/townHallsErrors/geocoding/${newTownHall.eventId}`).set(newTownHall);
                        reject('error geocoding', newTownHall);
                    }
                },
                error(e) {
                    console.log('we got an error', e);
                },
            });
        }));
    }

    // checks firebase for address, if it's not there, calls google geocode
    geoCodeFirebase(address) {
        const newTownHall = this;
        const addresskey = address.replace(/\W/g, '');
        addresskey.trim();
        firebasedb.ref(`geolocate/${addresskey}`).once('value').then((snapshot) => {
            if (snapshot.child('lat').exists() === true) {
                newTownHall.lat = snapshot.val().lat;
                newTownHall.lng = snapshot.val().lng;
                newTownHall.address = snapshot.val().formatted_address;
                TownHall.allTownHalls.push(newTownHall);
            } else if (snapshot.child('lat').exists() === false) {
                firebasedb.ref(`/townHallsErrors/geocoding/${newTownHall.eventId}`).once('value').then((snap) => {
                    if (snap.child('streetAddress').exists() === newTownHall.streetAddress) {
                        console.log('known eror');
                    } else {
                        newTownHall.getLatandLog(address);
                    }
                });
            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
}
// Global data stete
TownHall.allTownHalls = [];
TownHall.allTownHallsFB = {};
TownHall.currentContext = [];
TownHall.isCurrentContext = false;
TownHall.allIdsGoogle = [];
TownHall.allIdsFirebase = [];


export default TownHall;
