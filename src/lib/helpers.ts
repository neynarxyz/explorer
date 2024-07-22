export function capitalizeNickname(nickname: string) {
  if (!nickname) return '';
  return nickname.charAt(0).toUpperCase() + nickname.slice(1);
}

export const calculatePercentageDifference = (
  current: number,
  median: number
) => {
  if (median === 0) return 0;
  return ((current - median) / median) * 100;
};

export const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
};
