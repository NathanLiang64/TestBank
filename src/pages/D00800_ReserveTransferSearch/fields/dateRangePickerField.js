/* eslint-disable no-unused-vars */
import { useController } from 'react-hook-form';
import React from 'react';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from 'assets/images/icons/clearIcon.svg';
import DateRangePicker from 'components/DateRangePicker';

export const DateRangePickerField = ({
  minDate, maxDate, ...controlProps
}) => {
  const {field, fieldState} = useController(controlProps);
  const {onChange, name, value} = field;

  return (
    <div className="searchDateRange">
      <SearchIcon />
      <div>
        <DateRangePicker
          minDate={minDate}
          maxDate={maxDate}
          value={value}
          label=" "
          onChange={(range) => {
            onChange(range);
          }}
        />
        <img
          className="clearImg"
          src={ClearIcon}
          alt=""
          onClick={() => onChange([null, null])}
        />
      </div>
    </div>
  );
};
