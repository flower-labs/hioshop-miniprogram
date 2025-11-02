import moment from 'moment';

export function getTimeDifference(dateString) {

  const nowMoment = moment();
  const targetMoment = moment(dateString, 'YYYY-MM-DD');
  
  // 处理无效时间戳
  if (!moment(targetMoment).isValid()) {
      return '';
  }
  
  // 计算月份差
  let months = nowMoment.diff(targetMoment, 'months');
  
  // 计算剩余天数
  const adjustedTarget = targetMoment.clone().add(months, 'months');
  let days = nowMoment.diff(adjustedTarget, 'days');
  
  // 处理月份天数差异导致的负数情况
  if (days < 0) {
      months -= 1;
      days = nowMoment.diff(targetMoment.clone().add(months, 'months'), 'days');
  }

  if (months > 0) {
    return `${months}个月${days}天`
  }
  
  return `出生第${days}天`
}