(function (module) {

  var memberUpdating = {};

  memberUpdating.initalizeMemberform = function (e) {
    var id = this.id;
    var currentpath = window.location.pathname.split('/candidate')[0];
    if (id === 'candidate') {
      currentpath = currentpath === '/' ? currentpath : currentpath + '/';
      return page(currentpath + 'candidate');
    }
    return currentpath? page(currentpath): page('/');
  };

  memberUpdating.updateMember = function (selection) {
    console.log(selection);
    $('#Member').val(selection);
  };

  memberUpdating.validateMember = function (member, $errorMessage, $memberformgroup) {
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

  memberUpdating.adopterMemberChanged = function () {
    var $memberInput = $(this);
    var member = $memberInput.val();
    var $errorMessage = $('.new-event-form #adopter-member-help-block');
    var $memberformgroup = $('#adopter-member-form-group');
    if (memberUpdating.validateMember(member, $errorMessage, $memberformgroup)) {
      Moc.getMember(member).then(function (mocdata) {
        $errorMessage.html('');
        $memberformgroup.removeClass('has-error').addClass('has-success');

        TownHall.currentEvent.districtAdopterParty = mocdata.party;
        if (mocdata.type === 'sen') {
          TownHall.currentEvent.districtAdopterDistrict = 'Senate';
        } else if (mocdata.type === 'rep') {
          TownHall.currentEvent.districtAdopterDistrict = mocdata.state + '-' + mocdata.district;
        }
      })
                .catch(function () {
                  $('.advanced-moc-options').removeClass('hidden');
                });
    }
  };

  memberUpdating.updateFieldsFromMember = function ($form, $memberInput, $errorMessage, $memberformgroup, mocdata) {
    var stateName = $form.find('#stateName');
    var party = $form.find('#party');
    var displayDistrict = $form.find('.district-group').find('input');
    if (mocdata.type === 'sen' || mocdata.chamber === 'upper') {
      displayDistrict.val('Senate').parent().addClass('has-success');
    } else if (mocdata.type === 'rep' || mocdata.chamber === 'upper') {
      displayDistrict.val(mocdata.state + '-' + mocdata.district).parent().addClass('has-success');
    }
    $memberInput.val(mocdata.displayName);
    party.val(mocdata.party).parent().addClass('has-success');
    stateName.val(mocdata.stateName).parent().addClass('has-success');
    newEventView.updatedNewTownHallObject($form);
    $errorMessage.html('');
    $memberformgroup.removeClass('has-error').addClass('has-success');
  };

  memberUpdating.getEventDataFromMember = function (mocdata) {
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
      var zeropadding = '00';
      var updatedDistrict = zeropadding.slice(0, zeropadding.length - mocdata.district.length) + mocdata.district;
      TownHall.currentEvent.district = updatedDistrict;
    }
  };

  memberUpdating.memberChanged = function () {
    var $memberInput = $(this);
    var member = $memberInput.val();
    var $form = $(this).parents('form');
    var $list = $('#current-pending');
    $('#submit-success').addClass('hidden');
    $list.empty();
    var $errorMessage = $('.new-event-form #member-help-block');
    var $memberformgroup = $('#member-form-group');
    if (memberUpdating.validateMember(member, $errorMessage, $memberformgroup)) {
      $('.advanced-moc-options').addClass('hidden');
      TownHall.currentKey = firebase.database().ref('townHallIds').push().key;
      TownHall.currentEvent.eventId = TownHall.currentKey;
      Moc.getMember(member).then(function (mocdata) {

        memberUpdating.getEventDataFromMember(mocdata);
        memberUpdating.updateFieldsFromMember($form, $memberInput, $errorMessage, $memberformgroup, mocdata);

      }).catch(function (errorMessage) {
        console.log(errorMessage);
        $('#member-form-group').addClass('has-error');
        $('.new-event-form #member-help-block').html('That person isn\'t in our database, please manually enter their info');
        $('.advanced-moc-options').removeClass('hidden');
      });
    }
  };

  memberUpdating.saveCandidate = function () {
    var newMember = new Candidate(TownHall.currentEvent);
    newMember.save()
        .then(() => {
            let currentLocation = page.current();
            if (currentLocation) {
              
            }
        });
  };

  $('.new-event-form').on('change', '#Member', memberUpdating.memberChanged);
  $('.new-event-form').on('change', '#districtAdopter', memberUpdating.adopterMemberChanged);
  $('.new-event-form').on('click', '.mode-switcher .btn', memberUpdating.initalizeMemberform);
  // $('.save-candidate').on('click', memberUpdating.saveCandidate);


  module.memberUpdating = memberUpdating;
})(window);