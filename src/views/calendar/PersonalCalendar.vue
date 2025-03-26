<template>
  <div>
    <RouterLink class="btn btn-primary btn-pill" to="/calendar/create">
      <span class="nav-text">新增事件</span>
    </RouterLink>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const route = useRoute();
    const events = ref([]); // 事件列表

    const apiBaseUrl = "http://localhost:8080/api/calendar"; // 假設您的 API 地址

    // 從後端加載事件
    const loadEventsFromBackend = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events`);
        if (response.data) {
          events.value = response.data.map((event) => ({
            title: event.content, // 這裡假設您的後端字段是 content
            start: event.start_date,
            end: event.finish_date,
          }));
        }
      } catch (error) {
        console.error("無法加載事件", error);
      }
    };

    // 儲存事件到後端
    const saveEventToBackend = async (newEvent) => {
      try {
        await axios.post(`${apiBaseUrl}/events`, {
          content: newEvent.title,
          start_date: newEvent.start,
          finish_date: newEvent.end,
        });
      } catch (error) {
        console.error("無法保存事件", error);
      }
    };

    // 刪除事件
    const deleteEventFromBackend = async (eventId) => {
      try {
        await axios.delete(`${apiBaseUrl}/events/${eventId}`);
      } catch (error) {
        console.error("無法刪除事件", error);
      }
    };

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      events: events.value, // 綁定事件
      eventClick: (info) => {
        if (confirm(`確定要刪除事件: ${info.event.title}?`)) {
          const eventId = info.event.id; // 假設事件有 id 屬性
          info.event.remove();
          deleteEventFromBackend(eventId); // 刪除後端事件
        }
      },
    });

    // 監聽 URL 變化，並且當路由有 `event` 參數時，將新事件添加到事件列表中
    watch(
      () => route.query.event,
      (newEvent) => {
        if (newEvent) {
          try {
            const parsedEvent = JSON.parse(newEvent);
            events.value.push({
              title: parsedEvent.name,
              start: parsedEvent.start,
              end: parsedEvent.end,
            });
            saveEventToBackend(parsedEvent); // 儲存到後端
          } catch (error) {
            console.error("事件解析錯誤", error);
          }
        }
      },
      { immediate: true }
    );

    // 初始化並加載事件
    onMounted(() => {
      loadEventsFromBackend(); // 從後端加載事件
    });

    // 監聽事件列表變化，並保存到後端
    watch(events, (newEvents) => {
      newEvents.forEach((event) => {
        saveEventToBackend(event);
      });
    }, { deep: true });

    return {
      calendarOptions,
      events,
    };
  },
};
</script>
