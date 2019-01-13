import request from 'superagent';
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

        return firebasedb.ref(`/townHalls/${key}`)
            .update(newEvent)
            .then(() => firebasedb.ref(`/townHallIds/${key}`)
                .update(metaData)
                .catch((error) => {
                    console.log('could not update', newEvent, error);
                }))
            .then(() => newEvent)
            .catch((error) => {
                console.log('could not update', newEvent, error);
            });
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
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${time}&key=AIzaSyBvs-ugD9uydf8lUBwiwvN4dB5X9lbgpLw`;
        return request
            .get(url)
            .then((r) => {
                const response = r.body;
                if (!response.timeZoneName) {
                    return Error('no timezone results', id, response);
                }
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
                return newTownHall;
            }).catch((error) => {
                console.log(error);
            });
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
        return request
            .get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDP8q2OVisSLyFyOUU6OTgGjNNQCq7Q3rE')
            .set('Accept', 'application/json')
            .query({
                address,
            })
            .then((r) => {
                console.log(r.body, r.body.results[0]);
                const { results } = r.body;
                if (results) {
                    newTownHall.lat = results[0].geometry.location.lat;
                    newTownHall.lng = results[0].geometry.location.lng;
                    newTownHall.address = results[0].formatted_address.split(', USA')[0];
                    console.log(newTownHall);
                    return newTownHall;
                }
                return Promise.reject('error geocoding', newTownHall);
            })
            .catch((error) => {
                console.log('error geocoding', error);
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
