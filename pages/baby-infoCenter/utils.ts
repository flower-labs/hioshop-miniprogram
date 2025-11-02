import moment from 'moment';
const api = require('../../config/api.js');
const util = require('../../utils/util.js');

export const ACTION_TITLE_MAP = [
  { key: 'baby_name', title: '昵称' },
  { key: 'baby_sex', title: '性别' },
  { key: 'baby_birth', title: '生日' },
  { key: 'baby_blood_type', title: '血型' },
  { key: 'baby_height', title: '身高' },
  { key: 'baby_weight', title: '体重' },
  { key: 'baby_extra', title: '备注' },
];

export function calculateDateDifference(inputDate: string) {
  const today = moment();
  const inputMoment = moment(inputDate, 'YYYY-MM-DD');

  const monthsDifference = today.diff(inputMoment, 'months');
  const remainingDays = today.diff(inputMoment.clone().add(monthsDifference, 'months'), 'days');

  return {
    months: monthsDifference,
    days: remainingDays,
  };
}

export const handleBackgroundSave = async (imageUrl: string) => {
  const saveResp = await util.request(api.SaveBackground, { background_image: imageUrl }, 'POST');
  if (saveResp) {
     return true;
  }
  return false;
};
