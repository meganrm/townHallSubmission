export const getUid = state => state.user.uid;
export const getUserEmail = state => state.user.email;
export const getUserName = state => state.user.displayName;
export const getUserMOCs = state => state.user.userMocs;
export const getSelectedMember = state => state.user.selectedMember;
export const getSelectedLink = state => state.user.selectedLink;

export const getSelectedMemberLinks = state => {
  let selectedMember = getSelectedMember(state);
    return selectedMember.moc_links ? Object.keys(selectedMember.moc_links).map(key => {
      let link = selectedMember.moc_links[key];
      return {
        id: key,
        ...link
      }
    }) : []
};
