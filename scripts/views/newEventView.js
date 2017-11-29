
(function (module) {
// For handling user submitted events.
// Not being used yet.
/*global firebase TownHall Moc Handlebars regEx statesAb:true*/

  var provider = new firebase.auth.GoogleAuthProvider();

  var newEventView = {};
  TownHall.currentKey;
  TownHall.currentEvent = new TownHall();

  // METHODS FOR BOTH

  newEventView.render = function () {
    if ($('#new-event-form-element').hasClass('hidden')) {
      $('#new-event-form-element').removeClass('hidden').hide().fadeIn();
    }
  };

  newEventView.humanTime = function (time) {
    if (time.indexOf('AM') > 0 | time.indexOf('PM') > 0){
      return time;
    } else {
      var timeSplit = time.split(':');
      var hours;
      var minutes;
      var meridian;
      hours = timeSplit[0];
      minutes = timeSplit[1];
      if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
      } else if (hours < 12) {
        meridian = 'AM';
        if (hours === 0) {
          hours = 12;
        }
      } else {
        meridian = 'PM';
      }
      return hours + ':' + minutes + ' ' + meridian;
    }
  };

  // newEventView.formChanged = function () {
  //   var $input = $(this);
  //   var $form = $input.parents('form');
  //   var $listgroup = $(this).parents('.list-group-item');
  //   if (this.id === 'address') {
  //     $form.find('#geocode-button').removeClass('disabled');
  //     $form.find('#geocode-button').addClass('btn-blue');
  //     $form.find('#locationCheck').val('');
  //   }
  //   $input.addClass('edited');
  //   $form.find('#update-button').addClass('btn-blue');
  //   $form.find('.timestamp').val(new Date());
  //   newEventView.updatedView($form, $listgroup);
  // };

  // newEventView.dateChanged = function () {
  //   var $input = $(this);
  //   var $form = $input.parents('form');
  //   var $listgroup = $(this).parents('.list-group-item');
  //   $input.addClass('edited');
  //   $form.find('#update-button').addClass('btn-blue');
  //   $form.find('.timestamp').val(new Date());
  //   newEventView.updatedView($form, $listgroup);
  // };

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
    var state = TownHall.currentEvent.State;
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

  let addDisclaimer = function() {
    $("#Notes").val('Town Hall Project lists this event and any ' + 
                    'third-party link as public information and not ' + 
                    'as an endorsement of a participating candidate, campaign, or party.');
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
    $("#Notes").val('');
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
      setupTypeaheads('#districtAdopter');
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

  newEventView.formatTime = function(time) {
    console.log('format time', time);
    if (time.indexOf('AM') > 0 | time.indexOf('PM') > 0){
      return newEventView.toTwentyFour(time);
    } else {
      return time + ':00';
    }
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

  function setupTypeaheads(input) {
    var typeaheadConfig = {
      fitToElement: true,
      delay: 200,
      highlighter: function(item) { return item; }, // Kill ugly highlight
      filter: function(selection) {
        $(input).val(selection);
      }
    };
    Moc.loadAll().then(function(allnames){
      Moc.allNames = allnames;
      $(input).typeahead($.extend({source: allnames}, typeaheadConfig));
      newEventView.render();
    });
  }
  setupTypeaheads('#Member');

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
      });
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
      var District = $form.find('#District');
      var State = $form.find('#State');
      var Party = $form.find('#Party');
      Moc.getMember(member).then(function(mocdata){
        if (mocdata.type === 'sen') {
          District.val('Senate').addClass('edited').parent().addClass('has-success');
        } else if (mocdata.type === 'rep') {
          District.val(mocdata.state + '-' + mocdata.district).addClass('edited').parent().addClass('has-success');
        }

        TownHall.currentEvent.party = mocdata.party;
        TownHall.currentEvent.state = mocdata.state;
        if (mocdata.stateName) {
          TownHall.currentEvent.stateName = mocdata.stateName;
        }
        if (mocdata.type === 'sen') {
          TownHall.currentEvent.district = null;
        } else if (mocdata.type === 'rep') {
          var zeropadding = '00';
          var updatedDistrict = zeropadding.slice(0, zeropadding.length - mocdata.district.length) + mocdata.district;
          TownHall.currentEvent.district = updatedDistrict;
        } else {
          console.log('Cannot get district, no \'rep\' or \'sen\' value verified');
        }

        var fullname = mocdata.displayName;
        $memberInput.val(fullname);
        TownHall.currentEvent.govtrack_id = mocdata.govtrack_id;
        Party.val(mocdata.party).addClass('edited').parent().addClass('has-success');
        State.val(statesAb[mocdata.state]).addClass('edited').parent().addClass('has-success');
        newEventView.updatedNewTownHallObject($form);
        $errorMessage.html('');
        $memberformgroup.removeClass('has-error').addClass('has-success');
      }).catch(function(errorMessage){
        $('#member-form-group').addClass('has-error');
        $('.new-event-form #member-help-block').html('You can still submit this event, but the lookup failed. Please email meganrm@townhallproject.com this message: ', errorMessage);
      });
    }
  };

  newEventView.validateDateNew = function () {
    var newTownHall = TownHall.currentEvent;
    if (newTownHall.meetingType.slice(0, 4) === 'Tele') {
      newTownHall.dateObj = new Date(newTownHall.Date.replace(/-/g, '/') + ' ' + newTownHall.Time).getTime();
      return (newTownHall);
    } else if (newTownHall.lat) {
      console.log('getting time zone');
      newTownHall.validateZone().then(function (returnedTH) {
        returnedTH.updateUserSubmission(returnedTH.eventId).then(function (writtenTH) {
          newEventView.resetData();
          console.log('wrote to database: ', writtenTH);
        }).catch(function(error){
          $('general-error').text('Please email meganrm@townhallproject.com this error:', error).removeClass('hidden');
        });
        TownHall.allTownHallsFB[returnedTH.eventId] = returnedTH;
        console.log('writing to database: ', returnedTH);
      }).catch(function (error) {
        $('general-error').text(error).removeClass('hidden');
        console.log('could not get timezone', error);
      });
    } else {
      newTownHall.dateObj = new Date(newTownHall.Date.replace(/-/g, '/') + ' ' + newTownHall.Time).getTime();
      newTownHall.dateValid = newTownHall.dateObj ? true : false;
      return (newTownHall);
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
    if (TownHall.currentEvent.govtrack_id) {
      firebase.database().ref('mocData/' + TownHall.currentEvent.govtrack_id + '/lastUpdated/').set(Date.now());
      firebase.database().ref('mocData/' + TownHall.currentEvent.govtrack_id + '/lastUpdatedBy/').set(firebase.auth().currentUser.displayName);
    }
  };

  newEventView.updateUserEvents = function () {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/currentEvents/' + TownHall.currentKey).set(TownHall.currentKey);
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/mocs/' + TownHall.currentEvent.govtrack_id).update(
      {
        lastUpdated: Date.now(),
        govtrack_id : TownHall.currentEvent.govtrack_id
      });
  };

  newEventView.resetData = function () {
    newEventView.updateMOCEvents();
    newEventView.updateUserEvents();
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
    $('.non-standard').addClass('hidden');
    var defaultLocationTemplate = Handlebars.getTemplate('generalinputs');
    $('.location-data').html(defaultLocationTemplate(TownHall.currentEvent));
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
        newTownHall.updateUserSubmission(newTownHall.eventId).then(function (dataWritten) {
          TownHall.allTownHallsFB[dataWritten.eventId] = dataWritten;
          newEventView.resetData();
          console.log('wrote to database: ', newTownHall);
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
