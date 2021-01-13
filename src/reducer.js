export const initialState = {
  chatHistory: [],
  likesHistory: [],
  user: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "RETRIEVE_CHAT":
      return {
        ...state,
        chatHistory: action.chats,
      };
    case "ADD_MSG":
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.msg],
      };
    case "DELETE_MSG":
      return {
        ...state,
        chatHistory: state.chatHistory.filter((x) => x.id != action.id),
      };
    case "UPDATE_MSG":
      // console.log(`chat is now ${JSON.stringify(state.chatHistory)}`);
      // console.log(
      //   `chat will be ${JSON.stringify([
      //     ...state.chatHistory.filter((x) => x.id != action.id),
      //     action.chat,
      //   ])}`
      // );
      return {
        ...state,
        chatHistory: [
          ...state.chatHistory.filter((x) => x.id != action.id),
          action.chat,
        ],
      };
    case "RETRIEVE_LIKES":
      return {
        ...state,
        likesHistory: action.likes,
      };
    case "ADD_LIKE":
      return {
        ...state,
        likesHistory: [...state.likesHistory, action.msg],
      };
    case "DELETE_LIKE":
      return {
        ...state,
        likesHistory: state.likesHistory.filter((x) => x.id != action.id),
      };

    default:
      return { ...state };
  }
}
export default reducer;
