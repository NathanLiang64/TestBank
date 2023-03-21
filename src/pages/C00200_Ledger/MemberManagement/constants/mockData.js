/**
 * 取得帳本成員清單
 */
export const getAll = () => new Promise((resolve) => {
  const pendingTime = 300;
  const data = [
    {
      memberId: 0,
      memberNickName: 'Host',
      memberInviteStatus: 3,
      groupMemberId: 0,
      inviteToken: 'token-token-0',
      isOwner: true,
    },
    {
      memberId: 1,
      memberNickName: 'Member1',
      memberInviteStatus: 3,
      groupMemberId: 1,
      inviteToken: 'token-token-1',
      isOwner: false,
    },
    {
      memberId: 2,
      memberNickName: 'Member2',
      memberInviteStatus: 2,
      groupMemberId: 2,
      inviteToken: 'token-token-2',
      isOwner: false,
    },
    {
      memberId: 3,
      memberNickName: 'Member3',
      memberInviteStatus: 1,
      groupMemberId: 3,
      inviteToken: 'token-token-3',
      isOwner: false,
    },
  ];
  const resData = Math.random() > 0 ? data : [];
  setTimeout(() => {
    resolve(resData);
  }, pendingTime);
});
