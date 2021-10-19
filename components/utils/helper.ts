import axios, { AxiosResponse } from "axios";
import { IData, longUrlData } from "../../components/types";

export const POST = async (url: string, data: longUrlData) => {
  try {
    let response: AxiosResponse<IData> = await axios.post(url, data);

    console.log(response.data);

    return { data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return { error: error.response.data as Error };
      } else {
        return {
          error: {
            message: "Please check you internet connection",
          },
        };
      }
    }
  }
};
