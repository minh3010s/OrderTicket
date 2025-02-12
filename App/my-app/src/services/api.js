import axios from "axios";
const API_BASE_URL='http://localhost:1010/api'
export const loginUser=async(username,password)=>{
    try {
        const API_URL=`${API_BASE_URL}/user/login`;
        const response=await axios.post(API_URL,{username,password});
        console.log("ket qua dang nhap: "+response.data)
        return response.data;
    } catch (error) {
        throw new Error(error)
    }
};

export const registerUser = async (user) => {
    try {
      const API_URL = `${API_BASE_URL}/user/register`;
      const response = await axios.post(API_URL, user);
      return response.data; // Trả về phản hồi từ server
    } catch (error) {
      throw new Error(error.response?.data || 'Đã xảy ra lỗi');
    }
  };

  export const ForgotPassword = async (user) => {
    try {
      const API_URL = `${API_BASE_URL}/user/forgotpassword`;
      const response = await axios.post(API_URL, user);
      return response.data; // Assume this contains { message: "Password changed successfully!" }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  export const getTransport=async()=>{
    try {
      const API_URL = `${API_BASE_URL}/getTransport`;
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  export const getPlace=async()=>{
    try {
      const API_URL = `${API_BASE_URL}/getPlace`;
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  export const getScheduleByPlace = async (to) => {
    try {
        const API_URL = `${API_BASE_URL}/schedule/${to}`;  
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
};

  
  