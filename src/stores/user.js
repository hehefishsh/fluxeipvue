import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore(
  "user",
  function () {
    const empId = ref("");
    const empName = ref("");
    const empPhoto = ref("");
    const token = ref("");

    function clear() {
      (empId.value = ""),
        (empName.value = ""),
        (empPhoto.value = ""),
        (token.value = "");
    }
    function set(data) {
      (empId.value = data.empId),
        (empName.value = data.empName),
        (empPhoto.value = data.empPhoto),
        (token.value = data.token);
    }
    return {
      empId,
      empName,
      empPhoto,
      set,
      clear,
      token,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ["empId", "empName", "empPhoto", "token"],
    },
  }
);

export default useUserStore;
