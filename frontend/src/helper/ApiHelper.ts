import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ApiHelper {
  [x: string]: any;
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  private handleError(error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/Unauthorized";
    } else if (error.response && error.response.status === 403) {
      const message =
        "Bạn không có quyền truy cập vào trang này.";
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.warn("403 Forbidden:", message);
    } else {
      console.error("API Error:", error.response?.data?.message || "Unknown error");
    }

    throw error; 
  }

  
  async postJson(endpoint: string, payload: any) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${this.baseURL}${endpoint}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message || "Request failed";
        throw new Error(message);
      }
      throw error;
    }
  }

  async postformdata(url: string, formData: FormData): Promise<any> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${this.baseURL}${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async patchformdata(url: string, formData: FormData):Promise<any>{
    try {
      const token= localStorage.getItem("accessToken");
      const response= await axios.patch(`${this.baseURL}${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patchJson(endpoint: string, data: any){
    try{
      const token= localStorage.getItem("accessToken");
      const response= await axios.patch(`${this.baseURL}${endpoint}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    }catch(error){
      this.handleError(error);
    }
  }

  async post(url: string, data: any): Promise<any> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${this.baseURL}${url}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }


  async patch(url: string, data: any): Promise<any> {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(`${this.baseURL}${url}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async get(endpoint: string, param?: any): Promise<any>{
    try {
      const token= localStorage.getItem("accessToken");
      const response= await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        }, params: param
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }


  async delete(url: string): Promise<any> {
    try {
      const token = localStorage.getItem("accessToken");
      console.log('ApiHelper DELETE:', { url: `${this.baseURL}${url}`, token: token ? 'exists' : 'missing' });
      const response = await axios.delete(`${this.baseURL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log('ApiHelper DELETE error:', error.response?.data || error.message);
      this.handleError(error);
    }
  }

}

export default ApiHelper;




