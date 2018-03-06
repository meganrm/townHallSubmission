
(function (module) {
// For handling user submitted events.
// Not being used yet.
/*global firebase TownHall Moc Handlebars regEx:true*/

  var provider = new firebase.auth.GoogleAuthProvider();

  var newEventView = {};
  TownHall.currentKey;
  TownHall.currentEvent = new TownHall();

  newEventView.render = function (allnames, type, state) {
    var typeaheadConfig = {
      fitToElement: true,
      delay: 200,
      highlighter: function(item) { return item; }, // Kill ugly highlight
      filter: function(selection) {
        $('#Member').val(selection);
      }
    };
    newEventView.changeTitle(state);
    $('#Member').typeahead('destroy');
    $('#Member').typeahead($.extend({source: allnames}, typeaheadConfig));
    if ($('#new-event-form-element').hasClass('hidden')) {
      $('#new-event-form-element').removeClass('hidden').hide().fadeIn();
    }
    if (type === 'state') {
      $('#federal-district-group').addClass('hidden');
    } else {
      $('#federal-district-group').removeClass('hidden');
    }
  };

  newEventView.switchTab = function (state) {
    $('.state-switcher').removeClass('active');
    if (state) {
      $('.state-switcher.' + state).addClass('active');
    } else {
      $('.state-switcher.federal').addClass('active');
    }
  };

  newEventView.changeTitle = function (state) {
    var text = 'Member of Congress Information';
    if (state) {
      text = 'Member of ' + state + ' state legislature information';
    }
    $('#member-title').text(text);
  };

  newEventView.dateString = function (event) {
    event.preventDefault();
    var $input = $(this);
    var $form = $input.parents('form');
    var $dateInput = $form.find('.repeating');
    var $checkbox = $form.find('.checkbox-label');
    if (this.checked) {
      $dateInput.show().removeClass('hidden');
    } else {
      $dateInput.hide();
      $checkbox.text('Click to enter repeating event description');
    }
  };

  newEventView.generalCheckbox = function (event) {
    event.preventDefault();
    TownHall.currentEvent[this.id] = this.checked;
  };

  newEventView.geoCodeOnState = function () {
    var state = TownHall.currentEvent.stateName;
    var $form = $('form');
    var newTownHall = new TownHall();
    newTownHall.getLatandLog(state, 'state').then(function (geotownHall) {
      console.log('geocoding!', geotownHall);
      TownHall.currentEvent.address = geotownHall.address;
      TownHall.currentEvent.lat = geotownHall.lat;
      TownHall.currentEvent.lng = geotownHall.lng;
      $form.find('#locationCheck').val('Location is valid');
    }).catch(function () {
      var $feedback = $form.find('#location-form-group');
      $feedback.addClass('has-error');
      $form.find('#locationCheck').val('Geocoding failed').addClass('has-error');
    });
  };

  newEventView.geoCode = function ($input) {
    var $form = $($input).parents('form');
    var address = $form.find('#address').val();
    var newTownHall = new TownHall();
    var type = $form.find('#addressType').val();
    if (TownHall.currentEvent.lat && TownHall.currentEvent.lng) {
      delete TownHall.currentEvent.lat;
      delete TownHall.currentEvent.lng;
    }
    newTownHall.getLatandLog(address, type).then(function (geotownHall) {
      console.log('geocoding!', geotownHall);
      var $feedback = $form.find('#location-form-group');
      $feedback.removeClass('has-error');
      $feedback.addClass('has-success');
      $form.find('#address').val(geotownHall.address);
      TownHall.currentEvent.lat = geotownHall.lat;
      TownHall.currentEvent.lng = geotownHall.lng;
      TownHall.currentEvent.address = geotownHall.address;
      $form.find('#locationCheck').val('Location is valid');
      /* eslint-env es6*/
      /* eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/
      $form.find('#address-feedback').html('Location is valid, make sure the address is correct:<br>' + geotownHall.address);
    }).catch(function () {
      var $feedback = $form.find('#location-form-group');
      $feedback.addClass('has-error');
      $form.find('#locationCheck').val('Geocoding failed').addClass('has-error');
    });
  };

  newEventView.addressChanged = function () {
    var $input = $(this);
    var $form = $input.parents('form');
    if (this.id === 'address') {
      $form.find('#locationCheck').val('');
      newEventView.geoCode($input);
      $form.find('#location-form-group').removeClass('has-success');
      $form.find('#address-feedback').html('Enter a valid street address, if there isn\'t one, leave this blank');
    }
  };

  newEventView.changeMeetingType = function (event) {
    event.preventDefault();
    var $form = $(this).parents('form');
    var value = $(this).attr('data-value');
    $form.find('#meetingType').val(value);
    $form.find('#meetingType').change();
  };

  newEventView.changeParty = function (event) {
    event.preventDefault();
    var $form = $(this).parents('form');
    var value = $(this).attr('data-value');
    $form.find('#Party').val(value);
    $form.find('#Party').change();
  };

  newEventView.saveNoEvent = function (event) {
    event.preventDefault();
    var updateMOC = new Moc();
    updateMOC.lastUpdated = Date.now();
    updateMOC.govtrack_id = TownHall.currentEvent.govtrack_id;
    newEventView.updateMOCEvents();
    newEventView.resetData();
  };

  newEventView.meetingTypeChanged = function (event) {
    event.preventDefault();
    var value = $(this).val();
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
      //TODO: set this up
      // setupTypeaheads('#districtAdopter');
      break;
    case 'No Events':
      $('.event-details').addClass('hidden');
      $('.new-event-form').unbind('submit');
      $('.new-event-form').on('submit', newEventView.saveNoEvent);
      break;
    case 'Ticketed Event':
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
    case 'Empty Chair Town Hall':
      TownHall.currentEvent.iconFlag = 'activism';
      $('.general-inputs').removeClass('hidden');
      break;
    default:
      $('.general-inputs').removeClass('hidden');
    }
  };

  // New Event METHODS
  newEventView.validatePhoneNumber = function(phonenumber){
    var $phoneNumberError = $('#phoneNumber-error');
    regEx = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
    var testNumber = regEx.test(phonenumber);
    if (testNumber) {
      $phoneNumberError.addClass('hidden');
      $phoneNumberError.parent().removeClass('has-error');
      $phoneNumberError.parent().addClass('has-success');
      phonenumber = phonenumber.replace(/[^\d]/g, '');
      if (phonenumber.length === 10) {
        $('#phoneNumber').val(phonenumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
      }
      return null;
    } else {
      $phoneNumberError.removeClass('hidden');
      $phoneNumberError.parent().addClass('has-error');
      $phoneNumberError.parent().removeClass('has-success');
    }
  };

  // converts time to 24hour time
  newEventView.toTwentyFour = function (time) {
    var hourmin = time.split(' ')[0];
    var ampm = time.split(' ')[1];
    if (ampm === 'PM') {
      var hour = hourmin.split(':')[0];
      if (Number(hour) !== 12) {
        hour = Number(hour) + 12;
      }
      hourmin = hour + ':' + hourmin.split(':')[1];
    } else if (Number(hourmin.split(':')[0]) === 12) {
      hour = '00';
      hourmin = hour + ':' + hourmin.split(':')[1];
    }
    return hourmin + ':' + '00';
  };

  newEventView.validateDateTime = function($curValue, format, id) {
    if (!moment($curValue, format).isValid()) {
      $('#' + id + '-error').removeClass('hidden');
      $('#' + id).parent().addClass('has-error');
      return false;
    } else {
      $('#' + id + '-error').addClass('hidden');
      $('#' + id).parent().removeClass('has-error');
      return true;
    }
  };

  newEventView.updatedNewTownHallObject = function updatedNewTownHallObject($form) {
    var updated = $form.find('.edited').get();
    var databaseTH = TownHall.currentEvent;
    var updates = updated.reduce(function (newObj, cur) {
      var $curValue = $(cur).val();
      var timeFormats = ['hh:mm A', 'h:mm A'];
      switch (cur.id) {
      case 'timeStart24':
        if (!newEventView.validateDateTime($curValue, timeFormats, 'timeStart24')){
          return;
        }
        newObj.timeStart24 = moment($curValue, timeFormats).format('HH:mm:ss');
        newObj.Time = moment($curValue, timeFormats).format('h:mm A');
        var tempEnd = moment($curValue, timeFormats).add(2, 'h');
        newObj.timeEnd24 = moment(tempEnd).format('HH:mm:ss');
        newObj.timeEnd = moment(tempEnd).format('h:mm A');
        break;
      case 'timeEnd24':
        if (!newEventView.validateDateTime($curValue, timeFormats, 'timeEnd24')){
          return;
        }
        newObj.timeEnd24 = moment($curValue, timeFormats).format('HH:mm:ss');
        newObj.timeEnd = moment($curValue, timeFormats).format('h:mm A');
        break;
      case 'yearMonthDay':
        var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'MM-DD-YYYY', 'MMMM D, YYYY'];
        if (!newEventView.validateDateTime($curValue, dateFormats, 'yearMonthDay')){
          return;
        }
        newObj[cur.id] = moment($curValue, dateFormats).format('YYYY-MM-DD');
        newObj.dateString = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
        newObj.Date = moment($curValue, dateFormats).format('ddd, MMM D YYYY');
        break;
      default:
        newObj[cur.id] = $curValue;
      }
      return newObj;
    }, {});
    TownHall.currentEvent = Object.assign(databaseTH, updates);
    console.log(TownHall.currentEvent);
  };

  newEventView.newformChanged = function () {
    var $input = $(this);
    var $form = $input.parents('form');
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

  newEventView.updateMember = function(selection) {
    console.log(selection);
    $('#Member').val(selection);
  };


  newEventView.validateMember = function (member, $errorMessage, $memberformgroup) {
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

  newEventView.showSubmittedEvents = function (currentEvents, $list) {
    var previewEventTemplate = Handlebars.getTemplate('pendingEvents');
    $('#list-of-current-pending').removeClass('hidden').hide().fadeIn();
    for (var key in currentEvents) {
      var eventId = currentEvents[key];
      var ele = TownHall.allTownHallsFB[eventId];
      $list.append(previewEventTemplate(ele));
    }
  };

  newEventView.adopterMemberChanged = function () {
    var $memberInput = $(this);
    var member = $memberInput.val();
    var $errorMessage = $('.new-event-form #adopter-member-help-block');
    var $memberformgroup = $('#adopter-member-form-group');
    if (newEventView.validateMember(member, $errorMessage, $memberformgroup)) {
      Moc.getMember(member).then(function(mocdata){
        $errorMessage.html('');
        $memberformgroup.removeClass('has-error').addClass('has-success');

        TownHall.currentEvent.districtAdopterParty = mocdata.party;
        if (mocdata.type === 'sen') {
          TownHall.currentEvent.districtAdopterDistrict = 'Senate';
        } else if (mocdata.type === 'rep') {
          TownHall.currentEvent.districtAdopterDistrict = mocdata.state + '-' + mocdata.district;
        }
      })
      .catch(function(){
        $('#advanced-moc-options').removeClass('hidden');
      });
    }
  };
  newEventView.updateFieldsFromMember = function($form, $memberInput, $errorMessage, $memberformgroup, mocdata) {
    var State = $form.find('#State');
    var Party = $form.find('#Party');
    var District = $form.find('.district-group').find('input');
    if (mocdata.type === 'sen') {
      District.val('Senate').parent().addClass('has-success');
      TownHall.currentEvent.District = District.val();
    } else if (mocdata.type === 'rep') {
      District.val(mocdata.state + '-' + mocdata.district).parent().addClass('has-success');
      TownHall.currentEvent.District = District.val();
    }
    $memberInput.val(mocdata.displayName);
    Party.val(mocdata.party).parent().addClass('has-success');
    State.val(mocdata.stateName).parent().addClass('has-success');
    newEventView.updatedNewTownHallObject($form);
    $errorMessage.html('');
    $memberformgroup.removeClass('has-error').addClass('has-success');
  };

  newEventView.getEventDataFromMember = function(mocdata) {
    TownHall.currentEvent.govtrack_id = mocdata.govtrack_id || null;
    TownHall.currentEvent.thp_id = mocdata.thp_id || null;
    TownHall.currentEvent.displayName = mocdata.displayName;
    TownHall.currentEvent.district = mocdata.district;
    TownHall.currentEvent.stateName = mocdata.stateName;
    TownHall.currentEvent.party = mocdata.party;
    TownHall.currentEvent.state = mocdata.state;

    if (mocdata.type === 'sen') {
      TownHall.currentEvent.district = null;
      TownHall.currentEvent.Party = mocdata.party; //get rid of for v1
      TownHall.currentEvent.State = mocdata.stateName; //get rid of for v1

    } else if (mocdata.type === 'rep') {
      var zeropadding = '00';
      var updatedDistrict = zeropadding.slice(0, zeropadding.length - mocdata.district.length) + mocdata.district;
      TownHall.currentEvent.district = updatedDistrict;
      TownHall.currentEvent.Party = mocdata.party;//get rid of for v1
      TownHall.currentEvent.State = mocdata.stateName;//get rid of for v1
    }
  };

  newEventView.memberChanged = function () {
    var $memberInput = $(this);
    var member = $memberInput.val();
    var $form = $(this).parents('form');
    var $list = $('#current-pending');
    $('#submit-success').addClass('hidden');
    $list.empty();
    var $errorMessage = $('.new-event-form #member-help-block');
    var $memberformgroup = $('#member-form-group');
    if (newEventView.validateMember(member, $errorMessage, $memberformgroup)) {
      TownHall.currentKey = firebase.database().ref('townHallIds').push().key;
      TownHall.currentEvent.eventId = TownHall.currentKey;
      Moc.getMember(member).then(function(mocdata){

        newEventView.getEventDataFromMember(mocdata);
        newEventView.updateFieldsFromMember($form, $memberInput, $errorMessage, $memberformgroup, mocdata);

      }).catch(function(errorMessage){
        console.log(errorMessage);
        $('#member-form-group').addClass('has-error');
        $('#advanced-moc-options').removeClass('hidden');
        $('.new-event-form #member-help-block').html('That person isn\'t in our database, please manually enter their info');
      });
    }
  };

  newEventView.validateDateNew = function () {
    var newTownHall = TownHall.currentEvent;
    if (newTownHall.meetingType.slice(0, 4) === 'Tele') {
      newTownHall.dateObj = new Date(newTownHall.Date.replace(/-/g, '/') + ' ' + newTownHall.Time).getTime();
      return newTownHall;
    } else if (newTownHall.lat) {
      console.log('getting time zone');
      newTownHall.validateZone().then(function (returnedTH) {
        returnedTH.updateUserSubmission(returnedTH.eventId, TownHall.savePath).then(function () {
          TownHall.allTownHallsFB[returnedTH.eventId] = returnedTH;
          newEventView.resetData();
        }).catch(function(error){
          $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
        });
      }).catch(function (error) {
        $('general-error').text(error).removeClass('hidden');
        console.log('could not get timezone', error);
      });
    } else {
      newTownHall.dateObj = new Date(newTownHall.Date.replace(/-/g, '/') + ' ' + newTownHall.Time).getTime();
      newTownHall.dateValid = newTownHall.dateObj ? true : false;
      return newTownHall;
    }
  };

  newEventView.checkForFields = function () {
    var requiredFields = true;
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

  newEventView.updateMOCEvents = function () {
    var path = Moc.mocDataPath;
    var id = TownHall.currentEvent.govtrack_id ? TownHall.currentEvent.govtrack_id: TownHall.currentEvent.thp_id;
    var updates = {
      lastUpdated: Date.now(),
      lastUpdatedBy: firebase.auth().currentUser.displayName
    };

    if (TownHall.currentEvent.govtrack_id || TownHall.currentEvent.thp_id) {
      return firebase.database().ref(path + id).update(updates);
    }
  };

  newEventView.updateUserEvents = function () {
    var path = 'users/' + firebase.auth().currentUser.uid;
    var updates = {};
    var currentEvent = {};
    var mocData =     {
      lastUpdated: Date.now(),
      govtrack_id : TownHall.currentEvent.govtrack_id,
      thp_id: TownHall.currentEvent.thp_id
    };
    var id = TownHall.currentEvent.govtrack_id ? TownHall.currentEvent.govtrack_id: TownHall.currentEvent.thp_id;
    currentEvent[TownHall.currentKey] = TownHall.currentKey;
    updates[path + '/currentEvents/'] = currentEvent;
    updates[path + '/mocs/' + id] = mocData;
    return firebase.database().ref().update(updates);
  };

  newEventView.resetData = function () {
    newEventView.updateMOCEvents()
    .then(function(){
      console.log('updated moc');
    })
    .catch(function(error){
      console.log('error updating moc', error);
    });
    newEventView.updateUserEvents()
    .then(function(){
      console.log('updated user');
    })
    .catch(function(error){
      console.log('error updating user', error);
    });
    $('.has-success').removeClass('has-success');
    $('.edited').removeClass('edited');
    $('.event-details').removeClass('hidden');
    $('.general-error').addClass('hidden');
    $('.has-error').removeClass('has-error');
    $('#list-of-current-pending').addClass('hidden');
    $('#submit-success').removeClass('hidden').addClass('has-success');
    document.getElementById('new-event-form-element').reset();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    //reset if last was no event
    $('.event-details').removeClass('hidden');
    $('.new-event-form').unbind('submit');
    $('.new-event-form').on('submit', 'form', newEventView.submitNewEvent);
    //reset globals
    delete TownHall.currentKey;
    TownHall.currentEvent = new TownHall();
    //reset imputs
    $('.general-inputs').removeClass('hidden').show();
    $('.non-standard').addClass('hidden');
  };

  newEventView.submitNewEvent = function (event) {
    event.preventDefault();
    var $form = $(this);
    var id = TownHall.currentEvent.eventId;
    newEventView.updatedNewTownHallObject($form);
    var newTownHall = TownHall.currentEvent;
    if (newEventView.checkForFields()) {
      newTownHall.lastUpdated = Date.now();
      newTownHall.enteredBy = firebase.auth().currentUser.email;
      newTownHall.userID = firebase.auth().currentUser.uid;
      newTownHall = newEventView.validateDateNew(id, newTownHall);
      if (newTownHall) {
        console.log(TownHall.savePath);
        newTownHall.updateUserSubmission(newTownHall.eventId, TownHall.savePath).then(function () {
          TownHall.allTownHallsFB[newTownHall.eventId] = newTownHall;
          newEventView.resetData();
          console.log('wrote to database: ', newTownHall);
        }).catch(function(error){
          $('general-error').text('Please open your console (View>Developer>JavaScript console)and email meganrm@townhallproject.com a screenshot:', error).removeClass('hidden');
          console.log(error);
        });
      }
    } else {
      $('html, body').animate({
        scrollTop: $('.has-error').offset().top
      }, 'slow');
      console.log('missing fields');
    }
  };

  // event listeners for new form
  $('.new-event-form').on('change', '#Member', newEventView.memberChanged);
  $('.new-event-form').on('change', '#districtAdopter', newEventView.adopterMemberChanged);
  $('.new-event-form').on('click', '#geocode-button', newEventView.geoCode);
  $('.new-event-form').on('click', '.meeting a', newEventView.changeMeetingType);
  $('.new-event-form').on('click', '.member-info a', newEventView.changeParty);
  $('.new-event-form').on('change', '#meetingType', newEventView.meetingTypeChanged);
  $('.new-event-form').on('change', '.form-control', newEventView.newformChanged);
  $('.new-event-form').on('change', '.date-string', newEventView.dateString);
  $('.new-event-form').on('change', '.general-checkbox', newEventView.generalCheckbox);
  $('.new-event-form').on('change', '#address', newEventView.addressChanged);
  $('.new-event-form').on('submit', 'form', newEventView.submitNewEvent);

  $('#scroll-to-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y >= 800) {
      if ($('#scroll-to-top').css('visibility') !== 'visible') {
        $('#scroll-to-top').css('visibility', 'visible').hide().fadeIn();
      }
    } else {
      if ($('#scroll-to-top').css('visibility') === 'visible') {
        $('#scroll-to-top').css('visibility', 'hidden').show().fadeOut('slow');
      }
    }
  });

  function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).update({
      username: name,
      email: email
    });
  }

  newEventView.showUserEvents = function () {
    var $list = $('#submitted');
    $list.removeClass('hidden').hide().fadeIn();
    var $submitted = $('#submitted-meta-data');
    $submitted.removeClass('hidden').hide().fadeIn();
    var $submittedTotal = $('#submitted-total');
    $submittedTotal.html('0');
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/currentEvents/').on('child_added', function getSnapShot() {
      var total = parseInt($submittedTotal.html());
      $submittedTotal.html(total + 1);
    });
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
    // User is signed in.
      console.log(user.displayName, ' is signed in');
      // eventHandler.readData();
      newEventView.showUserEvents();
      writeUserData(user.uid, user.displayName, user.email);
    } else {
      newEventView.signIn();
      // No user is signed in.
    }
  });

  // Sign in fuction for firebase
  newEventView.signIn = function signIn() {
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function () {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };
  module.newEventView = newEventView;
})(window);
