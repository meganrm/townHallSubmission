
(function (module) {
    // For handling user submitted events.
    /*global firebase TownHall Moc Handlebars statesAb regEx:true*/

    var memberHandler = {};
    memberHandler.members = [];

    function MultiMember(member) {
        this.chamber = member.chamber;
        this.displayName = member.displayName ? member.displayName : member.Member;
        this.party = member.party;
        this.state = member.state;
        this.district = member.district;
        this.govtrack_id = member.govtrack_id; 
    }

    MultiMember.prototype.add = function(){
        memberHandler.members.push(this);
    }

    MultiMember.prototype.insert = function (index) {
        memberHandler.members[index] = (this);
    }

    addTypahead = function (inputField) {
        var typeaheadConfig = {
            fitToElement: true,
            delay: 200,
            highlighter: function (item) { return item; }, // Kill ugly highlight
            filter: function (selection) {
                $(inputField).val(selection);
            }
        };
        $(inputField).typeahead('destroy');
        $(inputField).typeahead($.extend({ source: Moc.allNames }, typeaheadConfig));
    };

    memberHandler.initalizeMultiMember = function(){
        if (!TownHall.currentEvent.displayName){
            return;
        }
        var firstMember = new MultiMember(TownHall.currentEvent);
        firstMember.add();
    }

    memberHandler.addFields = function (evnt) {
        evnt.preventDefault();
        var index = memberHandler.members.length
        if (index === 0){
            memberHandler.initalizeMultiMember()
        };
        var index = memberHandler.members.length
        console.log(memberHandler.members, index)
        if (index === 0) {
            return;
        };
        // var compiledTemplate = Handlebars.getTemplate('memberinputs');
        // $('.member-info').append(compiledTemplate({ index: index }))
        // addTypahead(`#multi-member-${index}`);
    }

    memberHandler.getEventDataFromMember = function (mocdata, index) {
        if (mocdata.type === 'sen') {
            mocdata.district = null;
            mocdata.chamber = 'upper';
            
        } else if (mocdata.type === 'rep') {
            mocdata.chamber = 'lower';
            var zeropadding = '00';
            var updatedDistrict = zeropadding.slice(0, zeropadding.length - mocdata.district.length) + mocdata.district;
            mocdata.district = updatedDistrict;
        }
        var newMember = new MultiMember(mocdata);
        newMember.insert(index);
        console.log(memberHandler.members);
        TownHall.currentEvent.members = memberHandler.members;
    };

    memberHandler.updateFieldsFromMember = function (index, $form, $memberInput, $errorMessage, $memberformgroup, mocdata) {
        var stateName = $form.find(`#multi-stateName-${index}`);
        var party = $form.find(`#multi-party-${index}`);
        var displayDistrict = $form.find(`.mulit-district-group-${index}`).find('input');
        if (mocdata.type === 'sen') {
            displayDistrict.val('Senate').parent().addClass('has-success');
        } else if (mocdata.type === 'rep') {
            displayDistrict.val(mocdata.state + '-' + mocdata.district).parent().addClass('has-success');
        }
        $memberInput.val(mocdata.displayName);
        party.val(mocdata.party).parent().addClass('has-success');
        stateName.val(mocdata.stateName).parent().addClass('has-success');
        newEventView.updatedNewTownHallObject($form);
        $errorMessage.html('');
        $memberformgroup.removeClass('has-error').addClass('has-success');
    };

    memberHandler.memberChanged = function () {
        var index = this.id.split('-')[2];
        console.log(index)
        var $memberInput = $(this);
        var member = $memberInput.val();
        var $form = $(this).parents('form');
        $('#submit-success').addClass('hidden');
        var $errorMessage = $(`.new-event-form member-help-block-${index}`);
        var $memberformgroup = $(`member-form-group-${index}`);
        if (newEventView.validateMember(member, $errorMessage, $memberformgroup)) {
            $('.multi-member#advanced-moc-options').addClass('hidden');
            Moc.getMember(member).then(function (mocdata) {
                memberHandler.getEventDataFromMember(mocdata, index);
                memberHandler.updateFieldsFromMember(index, $form, $memberInput, $errorMessage, $memberformgroup, mocdata);
            }).catch(function (errorMessage) {
                console.log(errorMessage);
                $('#member-form-group').addClass('has-error');
                $('.new-event-form #member-help-block').html('That person isn\'t in our database, please manually enter their info');
                $('.multi-member#advanced-moc-options').removeClass('hidden');
            });
        }
    };
    // event listeners for new form
    $('.new-event-form').on('click', '#add-member', memberHandler.addFields);
    $('.new-event-form').on('change', '.member-input-field', memberHandler.memberChanged);

    module.memberHandler = memberHandler;
})(window);
