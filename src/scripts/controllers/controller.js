import store from '../../store/configureStore';
import {
  setUsState,
  toggleMemberCandidate,
} from '../../state/selections/actions';
import {
  resetTownHall,
} from '../../state/townhall/actions';
import {
  MANUAL_MODE,
  CANDIDATE_MODE,
  MOC_MODE,
} from '../../constants';

export const switchStateTab = (ctx, next) => {
  store.dispatch(resetTownHall());
  const value = ctx.params.state || null;
  store.dispatch(setUsState(value));
  next();
};

export const selectCandidateMode = () => {
  store.dispatch(toggleMemberCandidate(CANDIDATE_MODE));
};

export const selectManualMode = () => {
  store.dispatch(toggleMemberCandidate(MANUAL_MODE));
};

export const selectDefaultMode = () => {
  store.dispatch(toggleMemberCandidate(MOC_MODE));
};
