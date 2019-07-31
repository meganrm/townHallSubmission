import React from 'react';
import PropTypes from 'prop-types';
import { message, Modal, Card } from 'antd';
import { connect } from 'react-redux';
import AddLinkForm from '../../components/LinkForms/AddLinkForm';
import EditLinkForm from '../../components/LinkForms/EditLinkForm';
import LinksList from '../../components/LinksList';
import MemberButtons from '../../components/MemberButtons';


import lawMakerStateBranch from '../../state/members-candidates';
import selectionStateBranch from '../../state/selections';
import townHallStateBranch from '../../state/townhall';
import userStateBranch from '../../state/user';

import { MOC_DATA_ENDPOINT } from '../../constants';

const {
  confirm,
} = Modal;

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
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {
      addVisible: false,
      editVisible: false,
    };
  }

  updateSuccess() {
    message.success('Link Updated');
  }

  success() {
    message.success('Thanks for submitting info!', 4);
  }

  selectMoc(moc) {
    const {
      setSelectedMember,
    } = this.props;
    setSelectedMember(moc);
  }

  handleAutoFillMember(govId) {
    const {
      requestPersonDataById,
    } = this.props;
    requestPersonDataById(MOC_DATA_ENDPOINT, govId);
  }

  showConfirm() {
    const {
      requestPersonDataById,
      selectedMoc,
      currentTownHall,
    } = this.props;
    requestPersonDataById(selectedMoc.path, selectedMoc.id).then(() => {
      const {
        displayName,
      } = currentTownHall;
      const submit = this.handleNoEventSubmit;
      if (!displayName) {
        return;
      }
      confirm({
        title: `Submit No Events for ${displayName}?`,
        onOk() {
          return new Promise((resolve) => {
            submit();
            setTimeout(resolve, 1000);
          });
        },
        onCancel() { },
      });
    });
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

  showModal(type, link) {
    const {
      setSelectedLink,
    } = this.props;
    if (type === 'add') {
      this.setState({ addVisible: true });
    } else {
      setSelectedLink(link);
      this.setState({ editVisible: true });
    }
  }

  handleCancel(type) {
    if (type === 'add') {
      this.setState({ addVisible: false });
    } else {
      this.setState({ editVisible: false });
    }
  }

  handleDeleteLink() {
    const payload = {
      moc_id: this.props.selectedMoc.govtrack_id,
      link_id: this.props.selectedLink.id,
    };
    this.props.deleteMemberLink(payload);
  }

  handleCreate() {
    const {
      selectedMoc,
      addMemberLink,
    } = this.props;
    const form = this.addFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      addMemberLink({
        member_id: selectedMoc.id,
        link_title: values.title,
        link_url: values.url,
        path: selectedMoc.path,
      });
      form.resetFields();
      this.setState({ addVisible: false });
    });
  }

  handleUpdate() {
    const {
      selectedMoc,
      selectedLink,
      editMemberLink
    } = this.props;
    const form = this.editFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const payload = {
        moc_id: selectedMoc.id,
        path: selectedMoc.path,
        link_id: selectedLink.id,
        linkInfo: {
          link_title: values.title,
          url: values.url,
        },
      };
      editMemberLink(payload);
      form.resetFields();
      this.updateSuccess();
      this.setState({ editVisible: false });
    });
  }

  saveAddFormRef(formRef) {
    this.addFormRef = formRef;
  }

  saveEditFormRef(formRef) {
    this.editFormRef = formRef;
  }

  renderMocBtns() {
    const {
      userMocs,
      selectedMoc,
    } = this.props;
    if (userMocs) {
      return (
        <MemberButtons
          selectMoc={this.selectMoc}
          selectedMoc={selectedMoc}
          userMocs={userMocs}
        />
      );
    }
  }

  renderMemberLinks() {
    const {
      userMocs,
      selectedMoc,
      selectedMemberLinks,
    } = this.props;
    return (userMocs
        && (<LinksList
          selectedMoc={selectedMoc}
          memberlinks={selectedMemberLinks}
          showModal={this.showModal}
          showConfirm={this.showConfirm}
          handleSubmit={this.handleNoEventSubmit}
          handleAutoFillMember={this.handleAutoFillMember}
        />
        ));
  }

  render() {
    const {
      eventCount,
    } = this.props;
    return (
      <div>
        <Card
          className="user-member-card"
          title={(
              <span id="submitted-meta-data">
              <span>You've submitted: </span>{eventCount}
              <span> event(s)</span>
            </span>
          )}
        >
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
    );
  }
}

UserToolkit.propTypes = {
  addMemberLink: PropTypes.func.isRequired,
  eventCount: PropTypes.number,
  currentTownHall: PropTypes.shape({}).isRequired,
  setSelectedMember: PropTypes.func.isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  resetAllData: PropTypes.func.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
  selectedMemberLinks: PropTypes.arrayOf(PropTypes.shape({})),
  setSelectedLink: PropTypes.func.isRequired,
  submitMetaData: PropTypes.func.isRequired,
  uid: PropTypes.string,
  userDisplayName: PropTypes.string,
  userMocs: PropTypes.arrayOf(PropTypes.shape({})),
};

UserToolkit.defaultProps = {
  eventCount: 0,
  uid: null,
  userDisplayName: null,
  userMocs: [],
};

const mapStateToProps = state => ({
  userMocs: userStateBranch.selectors.getUserMOCs(state),
  selectedMoc: selectionStateBranch.selectors.getSelectedUserMoc(state),
  selectedMemberLinks: selectionStateBranch.selectors.getSelectedMemberLinks(state),
  currentTownHall: townHallStateBranch.selectors.getTownHall(state),
  peopleDataUrl: selectionStateBranch.selectors.getPeopleDataUrl(state),
  userDisplayName: userStateBranch.selectors.getUserName(state),
  uid: userStateBranch.selectors.getUid(state),
  selectedLink: lawMakerStateBranch.selectors.getSelectedLink(state),
  eventCount: userStateBranch.selectors.getEventCount(state),
});

const mapDispatchToProps = dispatch => ({
  requestPersonDataById: (peopleDataUrl, id) => dispatch(lawMakerStateBranch.actions.requestPersonDataById(peopleDataUrl, id)),
  addMemberLink: payload => dispatch(lawMakerStateBranch.actions.addMemberLink(payload)),
  editMemberLink: payload => dispatch(lawMakerStateBranch.actions.editMemberLink(payload)),
  deleteMemberLink: payload => dispatch(lawMakerStateBranch.actions.deleteMemberLink(payload)),
  setSelectedMember: member => dispatch(lawMakerStateBranch.actions.setSelectedMember(member)),
  submitMetaData: payload => dispatch(townHallStateBranch.actions.saveMetaData(payload)),
  setSelectedLink: payload => dispatch(lawMakerStateBranch.actions.setSelectedLink(payload)),
});


export default connect(mapStateToProps, mapDispatchToProps)(UserToolkit);
