export function capitalizeNickname(nickname: string) {
  if (!nickname) return '';
  return nickname.charAt(0).toUpperCase() + nickname.slice(1);
}
