import React from 'react';
import PropTypes from 'prop-types';

export const TableNoDataCell = ({ style, colSpan, getMessage }) => (
  <td
    style={{
      textAlign: 'center',
      padding: '40px 0',
      ...style,
    }}
    colSpan={colSpan}
  >
    <big className="text-muted">{getMessage('noData')}</big>
  </td>
);

TableNoDataCell.propTypes = {
  style: PropTypes.object,
  colSpan: PropTypes.number,
  getMessage: PropTypes.func.isRequired,
};

TableNoDataCell.defaultProps = {
  style: null,
  colSpan: 1,
};
