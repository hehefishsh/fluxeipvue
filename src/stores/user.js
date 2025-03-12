import { defineStore } from "pinia";
import { ref, computed } from "vue";

const useUserStore = defineStore(
  "user",
  function () {
    const empId = ref("");
    const empName = ref("");
    const empPhoto = ref("");
    const token = ref("");
    const roleName = ref("")

    const isLoggedIn = computed(() => !!token.value);

    function clear() {
      empId.value = "";
      empName.value = "";
      empPhoto.value = "";
      token.value = "";
      roleName.value = ""
      sessionStorage.removeItem("user");
    }

    function set(data) {
      empId.value = data.empId;
      empName.value = data.empName;
      empPhoto.value = data.empPhoto;
      token.value = data.token;
      roleName.value = data.roleName;
    }

    function login(data) {
      set(data);
    }

    function logout() {
      clear();
      location.reload();
    }

    return {
      roleName,
      empId,
      empName,
      empPhoto,
      token,
      isLoggedIn,
      set,
      clear,
      login,
      logout,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ["empId", "empName", "empPhoto", "token", "roleName"],
    },
  }
);

// 讓 sessionStorage ，和 Pinia 同步
window.addEventListener("storage", (event) => {
  if (event.key === "user" && !event.newValue) {
    const user = useUserStore();
    user.clear();
  }
});

export default useUserStore;
