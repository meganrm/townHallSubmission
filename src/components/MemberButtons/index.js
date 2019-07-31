import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'antd';

import './style.scss';

const MemberButtons = (props) => {
  const {
    selectMoc,
    selectedMoc,
    userMocs,
  } = props;
  const widthVal = userMocs >= 4 ? '25%' : `${100 / userMocs}%`;
  const gridStyle = {
    width: widthVal,
    textAlign: 'center',
    cursor: 'pointer',
  };
  return (
    <React.Fragment>
      {userMocs.map((moc) => {
        const memberBtnClass = (selectedMoc && selectedMoc.id === moc.id) ? 'selected-member-btn' : 'member-btn';
        return <Card.Grid className={`${memberBtnClass}`} style={gridStyle} key={moc.id} onClick={() => selectMoc(moc)}>{moc.displayName}</Card.Grid>;
      })}
    </React.Fragment>
  );
};

MemberButtons.propTypes = {
  selectMoc: PropTypes.func.isRequired,
  selectedMoc: PropTypes.shape({}).isRequired,
  userMocs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

MemberButtons.defaultProps = {
  selectedMoc: {},
  userMocs: [],
};

export default MemberButtons;
