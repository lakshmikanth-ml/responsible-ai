import axiosInstance from "../../instance";
import { enqueue } from "../slices/snakbar";
import { loginSuccess } from "../slices/auth";

/**
 * this function is used to login to the application.
 * @param {Object} payload 
 * @param {Function} setLoading 
 * 
 */
export const login = (payload, setLoading, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const res = await axiosInstance.post("/api/token/", payload);
        if (res.status === 200) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res?.data?.access}`;
            dispatch(loginSuccess({
                user: res?.data?.user || {},
                token: {
                    access_token: res?.data?.access || "",
                    refresh_token: res?.data?.refresh || ""
                },
            }));
            dispatch(enqueue({ message: "Login successfully", variant: 'success' }));
            if (callBack) callBack();
        }
    } catch (error) {
        dispatch(enqueue({ message: "Login failed. Please try again.", variant: 'error' }));
    } finally {
        setLoading(false);
    }
}