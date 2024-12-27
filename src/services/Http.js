//@ts-nocheck
import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
axiosInstance.interceptors.request.use((config) => {
    const user = localStorage.getItem("user_login");
    if (user) {
        config.headers["Authorization"] = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("user_login");
        window.location.href = "/";
    }
    return Promise.reject(error);
});
export class APIClient {
    constructor(endpoint) {
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return axiosInstance.get(this.endpoint).then((res) => {
                    return res.data.data; // Explicitly return the `data`
                });
            }
        });
        /*   getalls = (page = 1, perPage = 10, search = "") => {
          const endpoint = `${
            this.endpoint
          }?page=${page}&per_page=${perPage}&searchQuery=${encodeURIComponent(
            search
          )}`;
      
          return axiosInstance.get<ApiResponse<T>>(endpoint).then((res) => res.data);
        }; */
        Object.defineProperty(this, "getalls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (page = 1, perPage = 10, search = "", filters = {}) => {
                const filterQueryString = Object.entries(filters)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join("&");
                const endpoint = `${this.endpoint}?page=${page}&per_page=${perPage}&searchQuery=${encodeURIComponent(search)}&${filterQueryString}`;
                return axiosInstance.get(endpoint).then((res) => res.data);
            }
        });
        Object.defineProperty(this, "getone", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return axiosInstance.get(this.endpoint).then((res) => res);
            }
        });
        Object.defineProperty(this, "getById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => {
                const endpointWithId = `${this.endpoint}/${id}`;
                return axiosInstance
                    .get(endpointWithId)
                    .then((res) => res.data.data);
            }
        });
        Object.defineProperty(this, "getUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => {
                const endpointWithId = `${this.endpoint}/${id}`;
                return axiosInstance
                    .get(endpointWithId)
                    .then((res) => res.data.data);
            }
        });
        Object.defineProperty(this, "Postall", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, options) => {
                return axiosInstance
                    .post(this.endpoint, data, options)
                    .then((res) => res.data);
            }
        });
        Object.defineProperty(this, "update", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => {
                return axiosInstance
                    .patch(`${this.endpoint}/${id}`)
                    .then((res) => res.data);
            }
        });
        Object.defineProperty(this, "UpdateAll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, id) => {
                return axiosInstance
                    .patch(`${this.endpoint}/${id}`, data)
                    .then((res) => res.data);
            }
        });
        Object.defineProperty(this, "DeleteOne", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => {
                return axiosInstance
                    .delete(`${this.endpoint}/${id}`)
                    .then((res) => res.data);
            }
        });
        Object.defineProperty(this, "getPaginated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (params) => {
                return axiosInstance
                    .get(this.endpoint, { params })
                    .then((res) => res.data);
            }
        });
        Object.defineProperty(this, "downloadFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => {
                const endpointWithId = `${this.endpoint}/${id}`;
                return axiosInstance
                    .get(endpointWithId, { responseType: "blob" }) // Fetch as binary
                    .then((response) => {
                    const blob = new Blob([response.data], {
                        type: response.headers["content-type"],
                    });
                    const url = window.URL.createObjectURL(blob);
                    const downloadLink = document.createElement("a");
                    downloadLink.href = url;
                    downloadLink.setAttribute("download", `download_${id}.zip`); // Adjust the filename as needed
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    window.URL.revokeObjectURL(url);
                })
                    .catch((error) => {
                    console.error("Error downloading file:", error);
                    throw error;
                });
            }
        });
        this.endpoint = endpoint;
    }
}
export default axiosInstance;
