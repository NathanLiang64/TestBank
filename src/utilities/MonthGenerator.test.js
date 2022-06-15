/* global test, expect */
/* eslint no-multi-spaces: 0 */
/* eslint array-bracket-spacing: 0 */

import { getThisMonth, getMonthList } from './MonthGenerator';

test('getThisMonth, Jan just have leading zero', () => {
  const today = new Date('2022-01-10');
  expect(getThisMonth(today)).toBe('202201');
});

test('getThisMonth, Oct should have no leading zero', () => {
  const today = new Date('2022-10-10');
  expect(getThisMonth(today)).toBe('202210');
});

test('getMonthList, should change to previous year', () => {
  const today = new Date('2022-02-10');
  expect(getMonthList(today)).toMatchObject(['202202', '202201', '202112', '202111', '202110', '202109']);
});
