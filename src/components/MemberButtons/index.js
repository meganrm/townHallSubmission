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
      selectedMoc,
      userMocs,
    } = this.props;
    let widthVal = userMocs >= 4 ? '25%' : `${100 / userMocs}%`;
    const gridStyle = {
      width: widthVal,
      textAlign: 'center',
      cursor: 'pointer',
    };
    return (
      <React.Fragment>
        {userMocs.map((moc) => {
          let memberBtnClass = (selectedMoc.govtrack_id === moc.govtrack_id) ? 'selected-member-btn' : 'member-btn';
          return <Card.Grid className={`${memberBtnClass}`} style={gridStyle} key={moc.govtrack_id} onClick={() => selectMoc(moc)}>{moc.member_name}</Card.Grid>
        })}
      </React.Fragment>
    );
  }
}

MemberButtons.propTypes = {
  selectMoc: PropTypes.func.isRequired,
  userMocs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default MemberButtons;

