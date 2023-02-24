const funcJumpData = {
  isNeedJump: false,
  jumpParam: {},
};

export default function FuncJumpReducer(state = funcJumpData, action) {
  const { type, data } = action;
  switch (type) {
    case 'setFuncJump': return { ...state, isNeedJump: data.isNeedJump, jumpParam: data.jumpParam };

    default:
      return state;
  }
}

export function setFuncJump(data) { return { type: 'setFuncJump', data }; }
