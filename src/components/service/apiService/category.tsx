import { getErrorMessage } from "@/utils/Content";
import apiInstance from "../apiInstance";
import { API_URLs } from "../apiURLs";

export const getCommonCategoryAll = async () => {
  try {
    const response = await apiInstance.get(API_URLs.commonCategoryAll);
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const commonQuestionFindById = async (id: number, userId: string) => {
  try {
    const response = await apiInstance.get(
      `${API_URLs.commonQuestionFindById}/${id}${
        userId ? `?userId=${userId}` : ""
      }`
    );
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const questionDetails = async (id: string, userId: number) => {
  try {
    const response = await apiInstance.get(
      `${API_URLs.questionDetails}/${id}${userId ? `?userId=${userId}` : ""}`
    );
    return response?.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
