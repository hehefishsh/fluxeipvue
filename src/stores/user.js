import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore("user",
    function () {
        const id = ref("");
        function setid(data) {
            id.value = data;
        }
        return {
            id, setid
        }
    }, {
    persist: {
        storage: sessionStorage,
        paths: ["id"]
    }
}
);

export default useUserStore;
