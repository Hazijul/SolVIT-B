import axios from "axios";

export const getPriorityList = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:5000/priority-list");
        return response.data;
    } catch (error) {
        console.error("Error fetching priority list:", error);
        return { error: "Could not fetch data" };
    }
};
