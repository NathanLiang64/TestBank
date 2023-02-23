const middlewareData = {
  needSetFuncJumpHandler: true,
  setFuncJumpHandler: false,
};

export default function MiddlewareReducer(state = middlewareData, action) {
  const { type, data } = action;
  switch (type) {
    case 'setFuncJumpHandler': return { ...state, setFuncJumpHandler: data };
    case 'stopSetFuncJump': return { ...state, needSetFuncJumpHandler: data };

    default:
      return state;
  }
}

export function setFuncJumpHandler() { return { type: 'setFuncJumpHandler', data: true }; }

export function stopSetFuncJump() { return { type: 'stopSetFuncJump', data: false }; }
