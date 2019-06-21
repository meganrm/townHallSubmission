import { createSelector } from 'reselect';
import  {
  getTownhallGovtrackId,
} from '../townhall/selectors';

export const getUid = state => state.user.uid;
export const getUserEmail = state => state.user.email;
export const getUserName = state => state.user.displayName;
export const getUserMOCs = state => state.user.userMocs;

export const getSelectedMemberLinks = state => createSelector([getUserMOCs] , (Members) => {
  let curGovtrackcId = getTownhallGovtrackId(state);
  console.log(curGovtrackcId)
  let selectedMember = Members.filter((mem) => { return mem.govtrack_id === curGovtrackcId });
  // TODO: Add selected moc to state!
  selectedMember.moc_links ? Object.keys(selectedMember.moc_links).map(key => {
    let link = selectedMember.moc_links[key];
    return {
      id: key,
      ...link
    }
  }) : []
});
