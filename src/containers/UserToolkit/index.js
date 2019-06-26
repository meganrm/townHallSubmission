import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddLinkForm from '../../components/LinkForms/AddLinkForm';
import EditLinkForm from '../../components/LinkForms/EditLinkForm';
import LinksList from '../../components/LinksList';
import MemberButtons from '../../components/MemberButtons';

import { message, Modal, Card } from 'antd';
const { confirm } = Modal;

import lawMakerStateBranch from '../../state/members-candidates';
import selectionStateBranch from '../../state/selections';
import townHallStateBranch from '../../state/townhall';
import {
  getUserMOCs,
  getSelectedMember,
  getSelectedMemberLinks,
  getUid,
  getUserName,
  getSelectedLink,
} from '../../state/user/selectors';
import {
  addMemberLink,
  editMemberLink,
  deleteMemberLink,
  setSelectedLink,
  getSelectedMemberInfo,
} from '../../state/user/actions';

class UserToolkit extends React.Component {
  constructor(props) {
    super(props);
    this.renderMocBtns = this.renderMocBtns.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.saveAddFormRef = this.saveAddFormRef.bind(this);
    this.saveEditFormRef = this.saveEditFormRef.bind(this);
    this.selectMoc = this.selectMoc.bind(this);
    this.handleDeleteLink = this.handleDeleteLink.bind(this);
    this.handleAutoFillMember = this.handleAutoFillMember.bind(this);
    this.renderMemberLinks = this.renderMemberLinks.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.handleNoEventSubmit = this.handleNoEventSubmit.bind(this);
    this.updateSuccess = this.updateSuccess.bind(this);
    this.success = this.success.bind(this);
    this.state = {
      addVisible: false,
      editVisible: false,
    }
  }

  updateSuccess = () => {
    message.success('Link Updated');
  }

  success = () => {
    message.success('Thanks for submitting info!', 4);
  };

  selectMoc(moc) {
    this.props.getSelectedMemberInfo(moc)
  }

  handleAutoFillMember(govId) {
    this.props.requestPersonDataById('mocData', govId)
  }

  showConfirm() {
    this.props.requestPersonDataById('mocData', this.props.selectedMoc.govtrack_id).then(() => {
      let member = this.props.currentTownHall.Member;
      let submit = this.handleNoEventSubmit;
      if (!member) { return; }
      confirm({
        title: `Submit No Events for ${member}?`,
        onOk() {
          return new Promise((resolve, reject) => {
            submit();
            setTimeout(resolve, 1000);
          });
        },
        onCancel() { },
      });
    })
  }

  resetAll() {
    const {
      resetAllData,
    } = this.props;
    resetAllData();
  }

  handleNoEventSubmit() {
    const {
      currentTownHall,
      submitMetaData,
      peopleDataUrl,
      userDisplayName,
      uid,
    } = this.props;
    const metaData = {
      eventId: currentTownHall.eventId,
      govtrack_id: currentTownHall.govtrack_id || null,
      mocDataPath: peopleDataUrl,
      thp_id: currentTownHall.thp_id || null,
      memberId: currentTownHall.govtrack_id || currentTownHall.thp_id,
      uid,
      userDisplayName,
    };
    currentTownHall.meetingType = 'No Events';
    submitMetaData(metaData);
    this.success();
    return this.resetAll();
  }

  showModal = (type, link) => {
    if (type === 'add') {
      this.setState({ addVisible: true });
    } else {
      this.props.setSelectedLink(link);
      this.setState({ editVisible: true });
    }
  };

  handleCancel = (type) => {
    if (type === 'add') {
      this.setState({ addVisible: false });
    } else {
      this.setState({ editVisible: false });
    }
  };

  handleDeleteLink = () => {
    let payload = {
      moc_id: this.props.selectedMoc.govtrack_id,
      link_id: this.props.selectedLink.id,
    }
    this.props.deleteMemberLink(payload);
  }

  handleCreate = () => {
    const form = this.addFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.addMemberLink({
        member_id: this.props.selectedMoc.govtrack_id,
        link_title: values.title,
        link_url: values.url
      })
      form.resetFields();
      this.setState({ addVisible: false });
    });
  };

  handleUpdate = () => {
    const form = this.editFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let payload = {
        moc_id: this.props.selectedMoc.govtrack_id,
        link_id: this.props.selectedLink.id,
        linkInfo: {
          link_title: values.title,
          url: values.url
        }
      }
      this.props.editMemberLink(payload);
      form.resetFields();
      this.updateSuccess();
      this.setState({ editVisible: false });
    });
  }

  saveAddFormRef = formRef => {
    this.addFormRef = formRef;
  };

  saveEditFormRef = formRef => {
    this.editFormRef = formRef;
  };

  renderMocBtns() {
    if (this.props.userMocs) {
      return (
        <MemberButtons
          selectMoc={this.selectMoc}
          selectedMoc={this.props.selectedMoc}
          userMocs={this.props.userMocs}
        />
      );
    }
  }

  renderMemberLinks() {
    if (this.props.userMocs) {
      return (
        <LinksList
          selectedMoc={this.props.selectedMoc}
          memberlinks={this.props.selectedMemberLinks}
          showModal={this.showModal}
          showConfirm={this.showConfirm}
          handleSubmit={this.handleNoEventSubmit}
          handleAutoFillMember={this.handleAutoFillMember}
        />
      );
    }
  }

  render() {
    return (
      <div>
        <Card className="user-member-card" title={<span id="submitted-meta-data"><span>You've submitted: </span><span id="submitted-total">0</span><span> event(s)</span></span>}>
          {this.renderMocBtns()}
        </Card>
        {this.renderMemberLinks()}
        <AddLinkForm
          wrappedComponentRef={this.saveAddFormRef}
          visible={this.state.addVisible}
          onCancel={() => this.handleCancel('add')}
          onCreate={this.handleCreate}
        />
        <EditLinkForm
          wrappedComponentRef={this.saveEditFormRef}
          visible={this.state.editVisible}
          onCancel={() => this.handleCancel('edit')}
          onCreate={this.handleUpdate}
          onDelete={this.handleDeleteLink}
          link={this.props.selectedLink}
        />
      </div>
    )
  };
}

UserToolkit.propTypes = {
  addMemberLink: PropTypes.func.isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  getSelectedMemberInfo: PropTypes.func.isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  resetAllData: PropTypes.func.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
  selectedMemberLinks: PropTypes.arrayOf(PropTypes.shape({})),
  setSelectedLink: PropTypes.func.isRequired,
  submitMetaData: PropTypes.func.isRequired,
  uid: PropTypes.string,
  userDisplayName: PropTypes.string,
  userMocs: PropTypes.arrayOf(PropTypes.shape({})),
}

UserToolkit.defaultProps = {
  uid: null,
  userDisplayName: null,
}

const mapStateToProps = state => ({
  userMocs: getUserMOCs(state),
  selectedMoc: getSelectedMember(state),
  selectedMemberLinks: getSelectedMemberLinks(state),
  currentTownHall: townHallStateBranch.selectors.getTownHall(state),
  peopleDataUrl: selectionStateBranch.selectors.getPeopleDataUrl(state),
  userDisplayName: getUserName(state),
  uid: getUid(state),
  selectedLink: getSelectedLink(state)
});

const mapDispatchToProps = dispatch => ({
  requestPersonDataById: (peopleDataUrl, id) => dispatch(lawMakerStateBranch.actions.requestPersonDataById(peopleDataUrl, id)),
  addMemberLink: (payload) => dispatch(addMemberLink(payload)),
  editMemberLink: (payload) => dispatch(editMemberLink(payload)),
  deleteMemberLink: (payload) => dispatch(deleteMemberLink(payload)),
  getSelectedMemberInfo: (member) => dispatch(getSelectedMemberInfo(member)),
  submitMetaData: payload => dispatch(townHallStateBranch.actions.saveMetaData(payload)),
  setSelectedLink: payload => dispatch(dispatch(setSelectedLink(payload))),
});


export default connect(mapStateToProps, mapDispatchToProps)(UserToolkit);

