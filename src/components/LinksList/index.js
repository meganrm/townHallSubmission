import React from 'react';
import PropTypes from 'prop-types';

import { Button, List } from 'antd';

class LinksList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      selectedMoc,
      showModal,
    } = this.props;
    console.log(selectedMoc)
    return (
      <List
        size="small"
        locale={{
          emptyText: 'Member links will appear here.'
        }}
        header={<div><strong>{selectedMoc && selectedMoc.member_name ? <div>{selectedMoc.member_name} links <Button onClick={() => showModal('add')} type="primary" size="small" style={{ float: 'right', marginRight: '5px' }}>Add Link</Button></div> : ''}</strong></div>}
        // TODO: Put in selector
        dataSource={
          selectedMoc && selectedMoc.moc_links ? Object.keys(selectedMoc.moc_links).map(key => {
            let link = selectedMoc.moc_links[key];
            return {
              id: key,
              ...link
            }
          }) : []
        }
        renderItem={item => <List.Item actions={[<a href={item.url} target="_blank">Go</a>, <a onClick={() => showModal('edit', item)}>Edit</a>]}>{item.link_title}</List.Item>}
      />
    );
  }
}

LinksList.propTypes = {
  showModal: PropTypes.func.isRequired,
  selectedMoc: PropTypes.shape({}).isRequired,
}

export default LinksList;