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
