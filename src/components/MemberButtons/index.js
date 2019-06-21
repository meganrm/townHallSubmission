import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'antd';

import './style.scss';

class MemberButtons extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    const {
      selectMoc,
      userMocs,
    } = this.props;
    console.log(userMocs)
    let widthVal = userMocs >= 4 ? '25%' : `${100 / userMocs}%`;
    const gridStyle = {
      width: widthVal,
      textAlign: 'center',
      cursor: 'pointer',
    };
    return (
      <Card className="user-member-card" title={<span id="submitted-meta-data"><span>You've submitted: </span><span id="submitted-total">0</span><span> event(s)</span></span>}>
        {userMocs.map((moc) => {
          return <Card.Grid style={gridStyle} key={moc.govtrack_id} onClick={() => selectMoc(moc)}>{moc.member_name}</Card.Grid>
        })}
      </Card>
    );
  }
}

MemberButtons.propTypes = {
  selectMoc: PropTypes.func.isRequired,
  userMocs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default MemberButtons;

