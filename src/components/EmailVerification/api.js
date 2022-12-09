export const checkEmail = async (param) => {
  console.log('EmailVerification checkEmail', {param});

  return {
    code: '0000',
    data: {
      repeatedMember: [
        {
          name: 'aa',
        },
        {
          name: 'aa',
        },
      ],
    },
  };
};
