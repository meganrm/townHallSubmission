import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddLinkForm from '../../components/LinkForms/AddLinkForm';
import EditLinkForm from '../../components/LinkForms/EditLinkForm';
import LinksList from '../../components/LinksList';
import MemberButtons from '../../components/MemberButtons';

import { message } from 'antd';
import {
  getUserMOCs,
} from '../../state/user/selectors';
import  {
  addMemberLink,
  editMemberLink,
  deleteMemberLink,
} from '../../state/user/actions';
import lawMakerStateBranch from '../../state/members-candidates';

const updateSuccess = (e) => {
  message.success('Link Updated');
}

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
    this.state = {
      addVisible: false,
      editVisible: false,
      selectedMoc: {},   // TODO: PUT IN REDUX
      selectedLink: {}   // TODO: PUT IN REDUX
    }
  }
  
  selectMoc(moc) {
    this.setState({
      selectedMoc: moc
    });
    this.props.requestPersonDataById('mocData', moc.govtrack_id)
  }

  showModal = (type, link) => {
    if (type === 'add') {
      this.setState({ addVisible: true });
    } else {
      this.setState({ editVisible: true, selectedLink: link });
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
    console.log('delete ', this.state.selectedLink)
    console.log(this.state.selectedMoc)
    let payload = {
      moc_id: this.state.selectedMoc.govtrack_id,
      link_id:  this.state.selectedLink.id,
    }
    this.props.deleteMemberLink(payload);
  }

  handleCreate = () => {
    const form = this.addFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      console.log('Values in state for MOC ', this.state.selectedMoc);
      this.props.addMemberLink({
        member_id: this.state.selectedMoc.govtrack_id,
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
      console.log('Received values of form: ', values);
      console.log('Values in state for MOC ', this.state.selectedMoc);
      let payload = {
        moc_id: this.state.selectedMoc.govtrack_id,
        link_id:  this.state.selectedLink.id,
        linkInfo: {
          link_title: values.title,
          url: values.url
        }
      }
      this.props.editMemberLink(payload);
      form.resetFields();
      updateSuccess();
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
    console.log(this.props.userMocs)
    if(this.props.userMocs) {
      return (
        <MemberButtons 
          selectMoc={this.selectMoc}
          userMocs={this.props.userMocs}
        />
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderMocBtns()}
        <LinksList 
          selectedMoc={this.state.selectedMoc} // move to selector TODO: pass as props - not local state
          showModal={this.showModal}
        />
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
          link={this.state.selectedLink}
        />
      </div>
    )
  };
}

UserToolkit.propTypes = {
  userMocs: PropTypes.arrayOf(PropTypes.shape({})),
  requestPersonDataById: PropTypes.func.isRequired,
  addMemberLink: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  userMocs: getUserMOCs(state),
});

const mapDispatchToProps = dispatch => ({
  requestPersonDataById: (peopleDataUrl, id) => dispatch(lawMakerStateBranch.actions.requestPersonDataById(peopleDataUrl, id)),
  addMemberLink: (payload) => dispatch(addMemberLink(payload)),
  editMemberLink: (payload) => dispatch(editMemberLink(payload)),
  deleteMemberLink: (payload) => dispatch(deleteMemberLink(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserToolkit);

