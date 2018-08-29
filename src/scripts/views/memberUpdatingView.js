import page from '../../vendor/scripts/page';
import statesAb from '../../data/states';
import { firebasedb } from '../util/setupFirebase';
import TownHall from '../models/town-hall';
import Candidate from '../models/candidate';
import Moc from '../models/moc';
import newEventView from './newEventView';

const memberUpdating = {};
/* globals $ */
memberUpdating.initalizeMemberform = function initalizeMemberform() {
    const { id } = this;
    let currentpath = window.location.pathname.split('/candidate')[0];
    if (id === 'candidate') {
        currentpath = currentpath === '/' ? currentpath : `${currentpath}/`;
        return page(`${currentpath}candidate`);
    }
    return currentpath ? page(currentpath) : page('/');
};

memberUpdating.updateMember = function updateMember(selection) {
    console.log(selection);
    $('#Member').val(selection);
};

memberUpdating.validateMember = function validateMember(member, $errorMessage, $memberformgroup) {
    console.log(member);
    if (member.length < 1) {
        $errorMessage.html('Please enter a member of congress name');
        $memberformgroup.addClass('has-error');
    } else if (parseInt(member)) {
        $errorMessage.html('Please enter a member of congress name');
        $memberformgroup.addClass('has-error');
    } else if (member.split(' ').length === 1) {
        $errorMessage.html('Please enter both a first and last name');
        $memberformgroup.addClass('has-error');
    } else {
        return true;
    }
};

memberUpdating.adopterMemberChanged = function adopterMemberChanged() {
    const $memberInput = $(this);
    const member = $memberInput.val();
    const $errorMessage = $('.new-event-form #adopter-member-help-block');
    const $memberformgroup = $('#adopter-member-form-group');
    if (memberUpdating.validateMember(member, $errorMessage, $memberformgroup)) {
        Moc.getMember(member).then((mocdata) => {
            $errorMessage.html('');
            $memberformgroup.removeClass('has-error').addClass('has-success');

            TownHall.currentEvent.districtAdopterParty = mocdata.party;
            if (mocdata.type === 'sen') {
                TownHall.currentEvent.districtAdopterDistrict = 'Senate';
            } else if (mocdata.type === 'rep') {
                TownHall.currentEvent.districtAdopterDistrict = `${mocdata.state}-${mocdata.district}`;
            }
        })
            .catch(() => {
                $('.advanced-moc-options').removeClass('hidden');
            });
    }
};

memberUpdating.updateFieldsFromMember = function updateFieldsFromMember($form, $memberInput, $errorMessage, $memberformgroup, mocdata) {
    const stateName = $form.find('#stateName');
    const party = $form.find('#party');
    const displayDistrict = $form.find('#displayDistrict');
    if (mocdata.type === 'sen' || mocdata.chamber === 'upper') {
        displayDistrict.val('Senate').parent().addClass('has-success');
    } else if (mocdata.district) {
        displayDistrict.val(`${mocdata.state}-${mocdata.district}`).parent().addClass('has-success');
    }
    $memberInput.val(mocdata.displayName);
    party.val(mocdata.party).parent().addClass('has-success');
    stateName.val(mocdata.stateName).parent().addClass('has-success');
    newEventView.updatedNewTownHallObject($form);
    $errorMessage.html('');
    $memberformgroup.removeClass('has-error').addClass('has-success');
};

memberUpdating.getEventDataFromMember = function getEventDataFromMember(mocdata) {
    TownHall.currentEvent.govtrack_id = mocdata.govtrack_id || null;
    TownHall.currentEvent.thp_id = mocdata.thp_id || null;
    TownHall.currentEvent.displayName = mocdata.displayName;
    TownHall.currentEvent.district = mocdata.district;
    TownHall.currentEvent.stateName = mocdata.stateName ? mocdata.stateName : statesAb[mocdata.state];
    TownHall.currentEvent.party = mocdata.party;
    TownHall.currentEvent.state = mocdata.state;

    if (mocdata.type === 'sen' || mocdata.chamber === 'upper') {
        TownHall.currentEvent.district = null;
        TownHall.currentEvent.chamber = 'upper';
    } else if (mocdata.type === 'rep' || mocdata.chamber === 'lower') {
        TownHall.currentEvent.chamber = 'lower';
        const zeropadding = '00';
        const updatedDistrict = zeropadding.slice(0, zeropadding.length - mocdata.district.length) + mocdata.district;
        TownHall.currentEvent.district = updatedDistrict;
    } else if (mocdata.chamber === 'statewide') {
        TownHall.currentEvent.chamber = 'statewide';
        TownHall.currentEvent.office = mocdata.role;
    }
};

memberUpdating.memberChanged = function memberChanged() {
    const $memberInput = $(this);
    const member = $memberInput.val();
    const $form = $(this).parents('form');
    const $list = $('#current-pending');
    $('#submit-success').addClass('hidden');
    $list.empty();
    const $errorMessage = $('.new-event-form #member-help-block');
    const $memberformgroup = $('#member-form-group');
    if (memberUpdating.validateMember(member, $errorMessage, $memberformgroup)) {
        $('.advanced-moc-options').addClass('hidden');
        TownHall.currentKey = firebasedb.ref('townHallIds').push().key;
        TownHall.currentEvent.eventId = TownHall.currentKey;
        Moc.getMember(member).then((mocdata) => {
            memberUpdating.getEventDataFromMember(mocdata);
            memberUpdating.updateFieldsFromMember($form, $memberInput, $errorMessage, $memberformgroup, mocdata);
        }).catch((errorMessage) => {
            console.log(errorMessage);
            $('#member-form-group').addClass('has-error');
            $('.new-event-form #member-help-block').html('That person isn\'t in our database, please manually enter their info');
            $('.advanced-moc-options').removeClass('hidden');
        });
    }
};

memberUpdating.saveCandidate = function saveCandidate() {
    const newMember = new Candidate(TownHall.currentEvent);
    newMember.save()
        .then(() => {
            // const currentLocation = page.current();
            // if (currentLocation) {
            // }
        });
};

$('.new-event-form').on('change', '#Member', memberUpdating.memberChanged);
$('.new-event-form').on('change', '#districtAdopter', memberUpdating.adopterMemberChanged);
$('.new-event-form').on('click', '.mode-switcher .btn', memberUpdating.initalizeMemberform);
// $('.save-candidate').on('click', memberUpdating.saveCandidate);


export default memberUpdating;
