/* globals $ */
import page from '../../vendor/scripts/page';

import TownHall from '../models/town-hall';
import Moc from '../models/moc';
import newEventView from '../views/newEventView';

const newEventController = {};

newEventController.index = function index(ctx) {
    if (ctx.mocs.length) {
        newEventView.render(ctx.mocs, ctx.congressScope, ctx.params.state);
        newEventView.changeTitle(ctx.params.state, ctx.mode);
    } else {
        page('/');
    }
};

newEventController.loadByState = function loadByState(ctx, next) {
    ctx.congressScope = 'state';
    ctx.mocNamesPath = `state_legislators_id/${ctx.params.state}/`;
    Moc.mocIdPath = `state_legislators_id/${ctx.params.state}/`;
    Moc.mocDataPath = `state_legislators_data/${ctx.params.state}/`;
    TownHall.savePath = `state_legislators_user_submission/${ctx.params.state}/`;
    Moc.loadAll(ctx.mocNamesPath).then((allnames) => {
        ctx.mocs = allnames;
        newEventController.index(ctx);
        next();
    });
};

newEventController.loadStateCandidates = function loadStateCandidates(ctx, next) {
    ctx.congressScope = 'state';
    ctx.mocNamesPath = `state_candidates_id/${ctx.params.state}/`;
    Moc.mocIdPath = `state_candidates_id/${ctx.params.state}/`;
    Moc.mocDataPath = `state_candidates_data/${ctx.params.state}/`;
    TownHall.savePath = `state_legislators_user_submission/${ctx.params.state}/`;
    Moc.loadAll(ctx.mocNamesPath).then((allnames) => {
        ctx.mocs = allnames;
        newEventController.index(ctx);
        next();
    });
};

newEventController.loadFederal = function loadFederal(ctx, next) {
    ctx.congressScope = 'federal';
    ctx.mocNamesPath = 'mocID/';
    Moc.mocIdPath = 'mocID/';
    Moc.mocDataPath = 'mocData/';
    TownHall.savePath = 'UserSubmission/';
    if (Moc.allNames.length > 0) {
        ctx.mocs = Moc.allFederal;
        next();
    } else {
        return Moc.loadAll(ctx.mocNamesPath).then((allnames) => {
            Moc.allFederal = allnames;
            ctx.mocs = Moc.allFederal;
            return next();
        }).catch((err) => {
            console.log(err);
        });
    }
};

newEventController.loadFederalCandidates = function loadFederalCandidates(ctx, next) {
    ctx.congressScope = 'federal';
    ctx.mocNamesPath = 'candidate_keys/';
    Moc.mocIdPath = 'candidate_keys/';
    Moc.mocDataPath = 'candidate_data/';
    TownHall.savePath = 'UserSubmission/';
    if (Moc.allNames.length > 0) {
        ctx.mocs = Moc.allFederal;
        next();
    } else {
        return Moc.loadAll(ctx.mocNamesPath).then((allnames) => {
            Moc.allFederal = allnames;
            ctx.mocs = Moc.allFederal;
            return next();
        }).catch((err) => {
            console.log(err);
        });
    }
};

newEventController.switchTab = function switchTab(ctx, next) {
    newEventView.resetData();
    newEventView.switchTab(ctx.params.state);
    next();
};

newEventController.selectCandidateMode = function selectCandidateMode(ctx, next) {
    $('.mode-switcher #current-moc').removeClass('active');
    $('.mode-switcher #candidate').addClass('active');
    ctx.mode = 'candidate';
    next();
};

newEventController.resetModeButton = function resetModeButton(ctx, next) {
    $('.mode-switcher #current-moc').addClass('active');
    $('.mode-switcher #candidate').removeClass('active');
    ctx.mode = 'moc';
    next();
};

export default newEventController;
