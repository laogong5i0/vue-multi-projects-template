/**
 * formater int
 * exp: 3,000
 * @param {*} s
 * @param {*} n
 * @returns
 */
const numberformater = (s, n = 0) => {
  let sum = s;
  let num = n;
  let result = '';
  if (!sum) return '0.00';
  let isNagtive = false;
  if (parseFloat(`${sum}`) < 0) {
    isNagtive = true;
    sum = sum.toString();
    sum = sum.replace(/-/g, '');
  }

  num = num >= 0 && num <= 20 ? num : 2;
  sum = `${parseFloat(`${sum}`.replace(/[^\d.-]/g, '')).toFixed(num)}`;
  const intArr = sum.split('.')[0].split('').reverse();
  const r = sum.split('.')[1];
  let t = '';
  for (let i = 0; i < intArr.length; i++) {
    t += intArr[i] + ((i + 1) % 3 === 0 && i + 1 !== intArr.length ? ',' : '');
  }
  result = `${t.split('').reverse().join('')}`;
  if (r) {
    result += `.${r}`;
  }
  if (isNagtive) {
    return `-${result}`;
  }
  return result;
};

export const filterContent = (str, num) => {
  if (Number.isNaN(str)) {
    return str;
  }
  return numberformater(str, num);
};
