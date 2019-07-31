import React from 'react';
import PropTypes from 'prop-types';

import {
  Button, List, Card, Icon, Tooltip,
} from 'antd';

import './style.scss';

class LinksList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      selectedMoc,
      showModal,
      memberlinks,
      handleAutoFillMember,
    } = this.props;
    return (
      <div>
        { selectedMoc && selectedMoc.govtrack_id && 
        (<Card
            className="actions-section"
            title="Actions:"
            extra={<div> <Button onClick={() => handleAutoFillMember()}>AutoFill Form</Button> <Button onClick={() => this.props.showConfirm()}>No Events</Button></div>}
            style={{ width: 'auto' }}
          />)
        }
        <List
          size="small"
          locale={{
            emptyText: 'Member links will appear here.',
          }}
          header={<div><strong>{selectedMoc && selectedMoc.displayName ? <div>{selectedMoc.displayName} Links</div> : ''}</strong></div>}
          footer={<div>{selectedMoc && selectedMoc.displayName ? <Tooltip title="Add Link"><Button onClick={() => showModal('add')} type="primary" size="small" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}><Icon type="plus-circle" /></Button></Tooltip> : ''}</div>}
          dataSource={memberlinks}
          renderItem={item => <List.Item actions={[<a href={item.url} target="_blank">Go</a>, <a onClick={() => showModal('edit', item)}>Edit</a>]}>{item.link_title}</List.Item>}
        />
      </div>
    );
  }
}

LinksList.propTypes = {
  showModal: PropTypes.func.isRequired,
};

export default LinksList;
