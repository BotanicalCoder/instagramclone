export const initialState = null;

export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "UPDATEUSER":
      return {
        ...state,
        username: action.payload.username,
        profilePic: action.payload.profilePic,
      };
    case "UPDATEPOSTS":
      return {
        ...state,
        posts: action.payload.posts,
      };
    case "CLEAR":
      return null;
    default:
      return "no action";
  }
};


