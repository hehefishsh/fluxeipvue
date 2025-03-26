<template>
    <div>
        <input v-model="newEventName" placeholder="事件名稱" class="border p-2 mb-2 w-full" />
        <input type="date" v-model="newEventStart" class="border p-2 mb-2 w-full" />
        <input type="date" v-model="newEventEnd" class="border p-2 mb-2 w-full" />
        <button @click="addEvent" class="btn btn-primary btn-pill">確認</button>
        <button @click="cancel" class="btn btn-primary btn-pill">取消</button>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const router = useRouter();
        const newEventName = ref("");
        const newEventStart = ref("");
        const newEventEnd = ref("");

        const addEvent = () => {
            if (!newEventName.value || !newEventStart.value || !newEventEnd.value) {
                alert("請輸入完整的事件資訊");
                return;
            }

            const newEvent = {
                name: newEventName.value,
                start: newEventStart.value,
                end: newEventEnd.value,
            };

            // 將事件資料透過路由傳遞
            router.push({
                name: "calendar-personal-link",
                query: { event: JSON.stringify(newEvent) },
            });

            alert("事件新增成功");
        };

        const cancel = () => {
            router.push("/calendar/personal");
        };

        return {
            newEventName,
            newEventStart,
            newEventEnd,
            addEvent,
            cancel,
        };
    },
};
</script>