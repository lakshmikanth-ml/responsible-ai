import axiosInstance from "../../instance";
import { enqueue } from "../slices/snakbar";




/**
 * Fetch users list with pagination, search and optional filters
 * @param {Object} payload
 * @param {Function} setLoading
 * @param {Function} setUsers
 */
export const getUserList =
    (payload = {}, setLoading, setUsers) =>
        async (dispatch) => {
            setLoading(true);

            try {
                // -----------------------------
                // Build query params dynamically
                // Include ONLY if value exists
                // -----------------------------
                const params = {};

                if (payload.page !== undefined && payload.page !== null) {
                    params.page = payload.page;
                }

                if (payload.page_size !== undefined && payload.page_size !== null) {
                    params.page_size = payload.page_size;
                }

                if (payload.search && payload.search.trim() !== "") {
                    params.search = payload.search.trim();
                }

                if (payload.role) {
                    params.role = payload.role;
                }

                if (payload.status) {
                    params.status = payload.status;
                }

                // -----------------------------
                // API Call
                // -----------------------------
                const res = await axiosInstance.get(
                    "/v1/user/customuser/",
                    { params }
                );

                if (res.status === 200) {
                    setUsers(res?.data?.data?.results);
                }
            } catch (error) {
                console.error("Error fetching user list:", error);
            } finally {
                setLoading(false);
            }
        };


/**
 * This function is used to add user.
 * @param {Object} payload 
 * @param {Function} setLoading 
 * @param {Function} callBack 
 * 
 */

export const addUser = (payload, setLoading, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const res = axiosInstance.post("/v1/user/customuser/", payload);
        if (res.status === 201) {
            if (callBack) callBack();
        }
    } catch (error) {
        console.error("e")
    } finally {
        setLoading(false);
    }
}