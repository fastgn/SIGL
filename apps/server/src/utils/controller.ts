import { ControllerResponse } from "../types/controller";

export const ControllerError: {
  [key: string]: (params?: { message?: string; data?: any }) => ControllerResponse;
} = {
  INVALID_PARAMS: ({ message, data } = {}) => {
    return {
      status: 400,
      message: message || "Invalid parameters",
      data,
    };
  },
  INTERNAL: ({ message, data } = {}) => {
    console.trace("Internal error thrown");
    return {
      status: 500,
      message: message || "Server error",
      data,
    };
  },
  UNAUTHORIZED: ({ message, data } = {}) => {
    return {
      status: 401,
      message: message || "Unauthorized",
      data,
    };
  },
  NOT_FOUND: ({ message, data } = {}) => {
    return {
      status: 404,
      message: message || "Not found",
      data,
    };
  },

  // Custom errors for events
  DIARY_NOT_FOUND: ({ message, data } = {}) => {
    return {
      status: 460,
      message: message || "Diary not found",
      data,
    };
  },
  APPRENTICE_NOT_FOUND: ({ message, data } = {}) => {
    return {
      status: 461,
      message: message || "Apprentice not found",
      data,
    };
  },
  USER_NOT_FOUND: ({ message, data } = {}) => {
    return {
      status: 462,
      message: message || "User not found",
      data,
    };
  },
  GROUP_NOT_FOUND: ({ message, data } = {}) => {
    return {
      status: 463,
      message: message || "Group not found",
      data,
    };
  },
};

export const ControllerSuccess: {
  [key: string]: (params?: { message?: string; data?: any }) => ControllerResponse;
} = {
  SUCCESS: ({ message, data } = {}) => {
    return {
      status: 200,
      message: message || "Success",
      data,
    };
  },
};
