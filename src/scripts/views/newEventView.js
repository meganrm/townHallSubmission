import 'bootstrap3';
import '../../vendor/scripts/bootstrap3-typeahead.min';
import moment from 'moment';
import statesAb from '../../data/states';

import { firebasedb, firebaseauth } from '../util/setupFirebase';
import TownHall from '../models/town-hall';
import Moc from '../models/moc';

/* globals $ */
// For handling user submitted events.

const newEventView = {};
TownHall.currentEvent = new TownHall();

newEventView.render = (allnames, type) => {
    const typeaheadConfig = {
        delay: 200,
        filter(selection) {
            $('#Member').val(selection);
        },
        fitToElement: true,
        highlighter(item) {
            return item;
        }, // Kill ugly highlight
    };

    $('#Member').typeahead('destroy');
    $('#Member').typeahead($.extend({
        source: allnames,
    }, typeaheadConfig));
    if ($('#new-event-form-element').hasClass('hidden')) {
        $('#new-event-form-element').removeClass('hidden').hide().fadeIn();
    }
    if (type === 'state') {
        console.log('state');
        $('.federal-district-group').addClass('hidden');
        $('#state-district-group').removeClass('hidden');
    } else {
        $('.federal-district-group').removeClass('hidden');
        $('#state-district-group').addClass('hidden');
    }
};

newEventView.switchTab = (state) => {
    $('.state-switcher').removeClass('active');
    if (state) {
        $(`.state-switcher.${state}`).addClass('active');
    } else {
        $('.state-switcher.federal').addClass('active');
    }
};

newEventView.changeTitle = (state, mode) => {
    const intro = mode === 'candidate' ? 'Candidate for ' : 'Member of ';

    let text = `${intro}Congress Information `;
    if (state) {
        text = `${intro + state} state legislature information`;
    }
    $('#member-title').text(text);
};

newEventView.dateString = function dateString(event) {
    event.preventDefault();
    const $input = $(this);
    const $form = $input.parents('form');
    const $dateInput = $form.find('.repeating');
    const $checkbox = $form.find('.checkbox-label');
    if (this.checked) {
        $dateInput.show().removeClass('hidden');
    } else {
        $dateInput.hide();
        $checkbox.text('Click to enter repeating event description');
    }
};

newEventView.generalCheckbox = function generalCheckbox(event) {
    event.preventDefault();
    TownHall.currentEvent[this.id] = this.checked;
};

newEventView.geoCodeOnState = function geoCodeOnState() {
    const state = TownHall.currentEvent.stateName;
    const $form = $('form');
    const newTownHall = new TownHall();
    newTownHall.getLatandLog(state, 'state').then((geotownHall) => {
        console.log('geocoding!', geotownHall);
        TownHall.currentEvent.address = geotownHall.address;
        TownHall.currentEvent.lat = geotownHall.lat;
        TownHall.currentEvent.lng = geotownHall.lng;
        $form.find('#locationCheck').val('Location is valid');
    }).catch(() => {
        const $feedback = $form.find('#location-form-group');
        $feedback.addClass('has-error');
        $form.find('#locationCheck').val('Geocoding failed').addClass('has-error');
    });
};

newEventView.geoCode = function geoCode($input) {
    const $form = $($input).parents('form');
    const address = $form.find('#address').val();
    const newTownHall = new TownHall();
    const type = $form.find('#addressType').val();
    if (TownHall.currentEvent.lat && TownHall.currentEvent.lng) {
        delete TownHall.currentEvent.lat;
        delete TownHall.currentEvent.lng;
    }
    newTownHall.getLatandLog(address, type).then((geotownHall) => {
        console.log('geocoding!', geotownHall);
        const $feedback = $form.find('#location-form-group');
        $feedback.removeClass('has-error');
        $feedback.addClass('has-success');
        $form.find('#address').val(geotownHall.address);
        TownHall.currentEvent.lat = geotownHall.lat;
        TownHall.currentEvent.lng = geotownHall.lng;
        TownHall.currentEvent.address = geotownHall.address;
        $form.find('#locationCheck').val('Location is valid');
        /* eslint-env es6 */
        /* eslint quotes: ["error", "single", { "allowTemplateLiterals": true }] */
        $form.find('#address-feedback').html(`Location is valid, make sure the address is correct:<br>${geotownHall.address}`);
    }).catch(() => {
        const $feedback = $form.find('#location-form-group');
        $feedback.addClass('has-error');
        $form.find('#locationCheck').val('Geocoding failed').addClass('has-error');
    });
};

newEventView.addressChanged = function addressChanged() {
    const $input = $(this);
    const $form = $input.parents('form');
    if (this.id === 'address') {
        $form.find('#locationCheck').val('');
        newEventView.geoCode($input);
        $form.find('#location-form-group').removeClass('has-success');
        $form.find('#address-feedback').html('Enter a valid street address, if there isn\'t one, leave this blank');
    }
};

newEventView.changeMeetingType = function changeMeetingType(event) {
    event.preventDefault();
    const $form = $(this).parents('form');
    const value = $(this).attr('data-value');
    $form.find('#meetingType').val(value);
    $form.find('#meetingType').change();
};

const addDisclaimer = function addDisclaimer() {
    $('#Notes').val('Town Hall Project lists this event and any '
    + 'third-party link as public information and not '
    + 'as an endorsement of a participating candidate, campaign, or party.');
};

newEventView.changeParty = function changeParty(event) {
    event.preventDefault();
    const $form = $(this).parents('form');
    const value = $(this).attr('data-value');
    $form.find('#party').val(value);
    $form.find('#party').change();
};

newEventView.districtEntered = function districtEntered(value, $form) {
    const state = $form.find('#state').val();
    if (value && Number(value)) {
        $form.find('#District').val(`${state}-${Number(value)}`);
    } else if (value.split('-').length > 0) {
        $form.find('#District').val(`${state} ${value}`);
    } else {
        $form.find('#District').val('Senate');
    }
};

newEventView.changeChamber = function changeChamber(event) {
    event.preventDefault();
    const $form = $(this).parents('form');
    const value = $(this).attr('data-value');
    $form.find('#chamber').val(value);
    $form.find('#chamber').change().addClass('has-success');
    if (value === 'upper' && !TownHall.currentEvent.district) {
        $form.find('#District').val('Senate');
    }
};

newEventView.saveNoEvent = function saveNoEvent(event) {
    event.preventDefault();
    const updateMOC = new Moc();
    updateMOC.lastUpdated = Date.now();
    updateMOC.govtrack_id = TownHall.currentEvent.govtrack_id;
    newEventView.updateUserEvents();
    newEventView.resetData();
};

newEventView.meetingTypeChanged = function meetingTypeChanged(event) {
    event.preventDefault();
    const value = $(this).val();
    $('#Notes').val('');
    $('.non-standard').addClass('hidden');
    $('#meetingType-error').addClass('hidden');
    $('#meetingType').parent().removeClass('has-error');
    switch (value) {
    case 'Tele-Town Hall':
        $('.general-inputs').addClass('hidden');
        $('.tele-inputs').removeClass('hidden');
        TownHall.currentEvent.iconFlag = 'tele';
        newEventView.geoCodeOnState();
        break;
    case 'Adopt-A-District/State':
        $('.general-inputs').removeClass('hidden');
        $('.adopter-data').removeClass('hidden');
        TownHall.currentEvent.iconFlag = 'activism';
        // TODO: set this up
        // setupTypeaheads('#districtAdopter');
        break;
    case 'No Events':
        $('.event-details').addClass('hidden');
        $('.new-event-form').unbind('submit');
        $('.new-event-form').on('submit', newEventView.saveNoEvent);
        break;
    case 'Ticketed Event':
        addDisclaimer();
        TownHall.currentEvent.iconFlag = 'in-person';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'Office Hours':
        TownHall.currentEvent.iconFlag = 'staff';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'Town Hall':
        TownHall.currentEvent.iconFlag = 'in-person';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'H.R. 1 Town Hall':
        TownHall.currentEvent.iconFlag = 'hr-one';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'H.R. 1 Activist Event':
        TownHall.currentEvent.iconFlag = 'hr-one';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'Campaign Town Hall':
        addDisclaimer();
        TownHall.currentEvent.iconFlag = 'campaign';
        $('.general-inputs').removeClass('hidden');
        break;
    case 'Hearing':
        TownHall.currentEvent.iconFlag = null;
        $('.general-inputs').removeClass('hidden');
        break;
    case 'DC Event':
        TownHall.currentEvent.iconFlag = null;
        $('.general-inputs').removeClass('hidden');
        break;
    case 'Empty Chair Town Hall':
        TownHall.currentEvent.iconFlag = 'activism';
        $('.general-inputs').removeClass('hidden');
        break;
    default:
        $('.general-inputs').removeClass('hidden');
    }
};

// New Event METHODS
newEventView.validatePhoneNumber = function validatePhoneNumber(phonenumber) {
    const $phoneNumberError = $('#phoneNumber-error');
    const regEx = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
    const testNumber = regEx.test(phonenumber);
    if (testNumber) {
        $phoneNumberError.addClass('hidden');
        $phoneNumberError.parent().removeClass('has-error');
        $phoneNumberError.parent().addClass('has-success');
        phonenumber = phonenumber.replace(/[^\d]/g, '');
        if (phonenumber.length === 10) {
            $('#phoneNumber').val(phonenumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
        }
        return null;
    }
    $phoneNumberError.removeClass('hidden');
    $phoneNumberError.parent().addClass('has-error');
    $phoneNumberError.parent().removeClass('has-success');
};

newEventView.validateDateTime = function validateDateTime($curValue, format, id) {
    if (!moment($curValue, format).isValid()) {
        $(`#${id}-error`).removeClass('hidden');
        $(`#${id}`).parent().addClass('has-error');
        return false;
    }
    $(`#${id}-error`).addClass('hidden');
    $(`#${id}`).parent().removeClass('has-error');
    return true;
};

newEventView.updatedNewTownHallObject = function updatedNewTownHallObject($form) {
    const updated = $form.find('.edited').get();
    const databaseTH = TownHall.currentEvent;
    const updates = updated.reduce((newObj, cur) => {
        const $curValue = $(cur).val();
        const timeFormats = ['hh:mm A', 'h:mm A'];
        const dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'MMMM D, YYYY'];
        const tempEnd = moment($curValue, timeFormats).add(2, 'h');
        switch (cur.id) {
        case 'timeStart24':
            if (!newEventView.validateDateTime($curValue, timeFormats, 'timeStart24')) {
                return;
            }
            newObj.timeStart24 = moment($curValue, timeFormats).format('HH:mm:ss');
            newObj.Time = moment($curValue, timeFormats).format('h:mm A');
            newObj.timeEnd24 = moment(tempEnd).format('HH:mm:ss');
            newObj.timeEnd = moment(tempEnd).format('h:mm A');
            break;
        case 'timeEnd24':
            if (!newEventView.validateDateTime($curValue, timeFormats, 'timeEnd24')) {
                return;
            }
            newObj.timeEnd24 = moment($curValue, timeFormats).format('HH:mm:ss');
            newObj.timeEnd = moment($curValue, timeFormats).format('h:mm A');
            break;
        case 'yearMonthDay':
            if (!newEventView.validateDateTime($curValue, dateFormats, 'yearMonthDay')) {
                return;
            }
            newObj[cur.id] = moment($curValue, dateFormats).format('YYYY-MM-DD');
            newObj.dateString = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
            newObj.Date = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
            break;
        case 'district':
            newEventView.districtEntered($curValue, $form);
            newObj[cur.id] = $curValue;
            break;
        default:
            newObj[cur.id] = $curValue;
        }
        return newObj;
    }, {});
    TownHall.currentEvent = Object.assign(databaseTH, updates);
    console.log(TownHall.currentEvent);
};

newEventView.newformChanged = function newformChanged() {
    const $input = $(this);
    const $form = $input.parents('form');
    if (this.id === 'address') {
        $form.find('#geocode-button').removeClass('disabled');
        $form.find('#geocode-button').addClass('btn-blue');
        $form.find('#locationCheck').val('');
    } else if (this.id === 'phoneNumber') {
        newEventView.validatePhoneNumber($input.val());
    }
    $input.addClass('edited');
    newEventView.updatedNewTownHallObject($form);
};

newEventView.lookUpStateName = function lookUpStateName(event) {
    event.preventDefault();
    const $form = $(this).parents('form');
    const stateName = statesAb[$(this).val()];
    const stateNameInput = $form.find('#stateName');
    TownHall.currentEvent.stateName = stateName;
    stateNameInput.val(stateName).addClass('has-success');
};

newEventView.validateDateNew = function validateDateNew() {
    const newTownHall = TownHall.currentEvent;
    if (newTownHall.meetingType.slice(0, 4) === 'Tele') {
        newTownHall.dateObj = new Date(`${newTownHall.Date.replace(/-/g, '/')} ${newTownHall.Time}`).getTime();
        return newTownHall;
    }
    if (newTownHall.lat) {
        console.log('getting time zone');
        newTownHall.validateZone().then((returnedTH) => {
            console.log(returnedTH);
            returnedTH.updateUserSubmission(returnedTH.eventId, TownHall.savePath).then(() => {
                TownHall.allTownHallsFB[returnedTH.eventId] = returnedTH;
                newEventView.saveMetaData();
                newEventView.resetData();
            }).catch((error) => {
                $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
            });
        }).catch((error) => {
            $('general-error').text(error).removeClass('hidden');
            console.log('could not get timezone', error);
        });
    } else {
        newTownHall.dateObj = new Date(`${newTownHall.Date.replace(/-/g, '/')} ${newTownHall.Time}`).getTime();
        newTownHall.dateValid = !!newTownHall.dateObj;
        return newTownHall;
    }
};

newEventView.checkForFields = function checkForFields() {
    let requiredFields = true;
    if (!Object.prototype.hasOwnProperty.call(TownHall.currentEvent, 'meetingType')) {
        $('#meetingType').parent().addClass('has-error');
        $('#meetingType-error').removeClass('hidden');
        requiredFields = false;
    }
    if (!Object.prototype.hasOwnProperty.call(TownHall.currentEvent, 'yearMonthDay')) {
        $('#yearMonthDay').parent().addClass('has-error');
        $('#yearMonthDay-error').removeClass('hidden');
        requiredFields = false;
    }
    if (!Object.prototype.hasOwnProperty.call(TownHall.currentEvent, 'timeStart24') && TownHall.currentEvent.meetingType !== 'Tele-Town Hall') {
        $('#timeStart24').parent().addClass('has-error');
        $('#timeStart24-error').removeClass('hidden');
        requiredFields = false;
    }
    return requiredFields;
};

newEventView.updateMOCEvents = function updateMOCEvents() {
    const path = Moc.mocDataPath;
    const id = TownHall.currentEvent.govtrack_id ? TownHall.currentEvent.govtrack_id : TownHall.currentEvent.thp_id;
    if (!id) {
        return Promise.resolve();
    }
    const updates = {
        lastUpdated: Date.now(),
        lastUpdatedBy: firebaseauth.currentUser.displayName,
    };

    if (TownHall.currentEvent.govtrack_id || TownHall.currentEvent.thp_id) {
        return firebasedb.ref(path + id).update(updates);
    }
    return Promise.resolve();
};

newEventView.updateUserEvents = function updateUserEvents() {
    const path = `users/${firebaseauth.currentUser.uid}`;
    const updates = {};
    const currentEvent = {};
    const mocData = {
        lastUpdated: Date.now(),
        govtrack_id: TownHall.currentEvent.govtrack_id || null,
        thp_id: TownHall.currentEvent.thp_id || null,
    };
    let id = TownHall.currentEvent.govtrack_id ? TownHall.currentEvent.govtrack_id : TownHall.currentEvent.thp_id;
    id = id || 'candidate';
    currentEvent.eventId = TownHall.currentKey;
    updates[`${path}/currentEvents/${TownHall.currentKey}`] = currentEvent;
    updates[`${path}/mocs/${id}`] = mocData;
    return firebasedb.ref().update(updates);
};

newEventView.saveMetaData = function saveMetaData() {
    Promise.all([newEventView.updateMOCEvents(), newEventView.updateUserEvents()])
        .then(() => {
            $('#submit-success').removeClass('hidden').addClass('has-success');
            console.log('updated moc');
            console.log('updated user');
        })
        .catch((error) => {
            console.log('error updating user or moc', error);
        });
};

newEventView.resetData = function resetData() {
    $('.advanced-moc-options').addClass('hidden');
    $('.has-success').removeClass('has-success');
    $('.edited').removeClass('edited');
    $('.event-details').removeClass('hidden');
    $('.general-error').addClass('hidden');
    $('.has-error').removeClass('has-error');
    $('#list-of-current-pending').addClass('hidden');
    document.getElementById('new-event-form-element').reset();
    $('html, body').animate({
        scrollTop: 0,
    }, 'slow');
    // reset if last was no event
    $('.event-details').removeClass('hidden');
    $('.new-event-form').unbind('submit');
    $('.new-event-form').on('submit', 'form', newEventView.submitNewEvent);
    // reset globals
    delete TownHall.currentKey;
    TownHall.currentEvent = new TownHall();
    // reset imputs
    $('.general-inputs').removeClass('hidden').show();
    $('.non-standard').addClass('hidden');
};

newEventView.submitNewEvent = function submitNewEvent(event) {
    event.preventDefault();
    const $form = $(this);
    const id = TownHall.currentEvent.eventId;
    newEventView.updatedNewTownHallObject($form);
    let newTownHall = TownHall.currentEvent;
    if (newEventView.checkForFields()) {
        newTownHall.lastUpdated = Date.now();
        newTownHall.enteredBy = firebaseauth.currentUser.email;
        newTownHall.userID = firebaseauth.currentUser.uid;
        newTownHall = newEventView.validateDateNew(id, newTownHall);
        if (newTownHall) {
            console.log(TownHall.savePath);
            newTownHall.updateUserSubmission(newTownHall.eventId, TownHall.savePath).then(() => {
                TownHall.allTownHallsFB[newTownHall.eventId] = newTownHall;
                newEventView.saveMetaData();
                newEventView.resetData();
                console.log('wrote to database: ', newTownHall);
            }).catch((error) => {
                $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
                console.log(error);
            });
        }
    } else {
        $('html, body').animate({
            scrollTop: $('.has-error').offset().top,
        }, 'slow');
        console.log('missing fields');
    }
};

// event listeners for new form
$('.new-event-form').on('click', '#geocode-button', newEventView.geoCode);
$('.new-event-form').on('click', '.meeting a', newEventView.changeMeetingType);
$('.new-event-form').on('click', '.party a', newEventView.changeParty);
$('.new-event-form').on('click', '.chamber a', newEventView.changeChamber);
$('.new-event-form').on('change', '#state', newEventView.lookUpStateName);
$('.new-event-form').on('change', '#meetingType', newEventView.meetingTypeChanged);
$('.new-event-form').on('change', '.form-control', newEventView.newformChanged);
$('.new-event-form').on('change', '.date-string', newEventView.dateString);
$('.new-event-form').on('change', '.general-checkbox', newEventView.generalCheckbox);
$('.new-event-form').on('change', '#address', newEventView.addressChanged);
$('.new-event-form').on('submit', 'form', newEventView.submitNewEvent);
$('#scroll-to-top').on('click', () => {
    $('html, body').animate({
        scrollTop: 0,
    }, 'slow');
});

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y >= 800) {
        if ($('#scroll-to-top').css('visibility') !== 'visible') {
            $('#scroll-to-top').css('visibility', 'visible').hide().fadeIn();
        }
    } else if ($('#scroll-to-top').css('visibility') === 'visible') {
        $('#scroll-to-top').css('visibility', 'hidden').show().fadeOut('slow');
    }
});

newEventView.showUserEvents = function showUserEvents() {
    const $list = $('#submitted');
    $list.removeClass('hidden').hide().fadeIn();
    const $submitted = $('#submitted-meta-data');
    $submitted.removeClass('hidden').hide().fadeIn();
    const $submittedTotal = $('#submitted-total');
    $submittedTotal.html('0');
    firebasedb.ref(`users/${firebaseauth.currentUser.uid}/currentEvents/`).on('child_added', () => {
        const total = parseInt($submittedTotal.html());
        $submittedTotal.html(total + 1);
    });
};

export default newEventView;
