import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore("user",
    function () {
        const empId = ref("");
        const empName = ref("");
        const empPhoto = ref("")
        function set(data) {
            empId.value = data.empId,
                empName.value = data.empName,
                empPhoto.value = data.empPhoto
        }
        return {
            empId, empName, empPhoto, set
        }
    }, {
    persist: {
        storage: sessionStorage,
        paths: ["empId", "empName", "empPhoto"]
    }
}
);

export default useUserStore;
