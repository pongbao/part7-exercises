const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BLOG":
      return {
        message: `a new blog ${action.payload.title} by ${action.payload.author} added`,
        isError: false,
      };
    case "LIKE_BLOG": {
      return {
        message: `you liked ${action.payload.title} by ${action.payload.author}`,
        isError: false,
      };
    }
    case "DELETE_BLOG": {
      return {
        message: `${action.payload.title} by ${action.payload.author} deleted successfully`,
        isError: false,
      };
    }

    case "LOGIN_SUCCESS": {
      return { message: "Login successful", isError: false };
    }
    case "ERROR": {
      return { message: action.payload, isError: false };
    }
    case "REMOVE_NOTIFICATION": {
      return { message: null, isError: null };
    }
    default:
      return state;
  }
};

export default notificationReducer;
