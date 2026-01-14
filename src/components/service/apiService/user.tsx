import { getErrorMessage } from "@/utils/Content";
import apiInstance from "../apiInstance";
import { API_URLs } from "../apiURLs";

export const userBalance = async () => {
  try {
    const response = await apiInstance.get(API_URLs.userBalance);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const userDetails = async () => {
  try {
    const response = await apiInstance.get(API_URLs.userDetails);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const userPositions = async () => {
  try {
    const response = await apiInstance.get(API_URLs.userPositions);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
export const getFeed = async (id: string) => {
  try {
    const response = await apiInstance.get(
      `${API_URLs.getFeed}${id ? `?userId=${id}` : ""}`
    );
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const imageUpload = async (images: unknown) => {
  try {
    const response = await apiInstance.post(API_URLs.imageUpload, images, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const userPost = async (reqBody: unknown) => {
  try {
    const response = await apiInstance.post(API_URLs.userPost, reqBody);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
export const postLikeOrUnlike = async (reqBody: unknown) => {
  try {
    const response = await apiInstance.post(API_URLs.likeOrUnlike, reqBody);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const postBookmarkOrUnBookMark = async (reqBody: unknown) => {
  try {
    const response = await apiInstance.post(
      API_URLs.bookmarkOrUnBookMark,
      reqBody
    );
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const getBookMarkList = async (id: string) => {
  try {
    const response = await apiInstance.get(
      `${API_URLs.bookMarkList}${id ? `?userId=${id}` : ""}`
    );
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const getCommentsList = async (id: number | null) => {
  try {
    const response = await apiInstance.get(`${API_URLs.getComments}/${id}`);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const replyComments = async (reqBody: unknown) => {
  try {
    const response = await apiInstance.post(API_URLs.postComments, reqBody);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

//
