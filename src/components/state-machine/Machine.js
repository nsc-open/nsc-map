// 用来定义 哪些操作在哪些状态下可以使用，并且下一个状态是什么
const Machine = () => <Machine initialState={}>
  <Action state="">
    {({ state, prevState, params, changeState }) => {
      return <Button onClick={changeState}></Button>
    }}
  </Action>
</Machine>