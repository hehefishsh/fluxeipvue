<template>
    <div class="max-w-lg mx-auto p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">{{ currentMonthYear }}</h2>
        <div class="flex gap-2">
          <button @click="prevMonth" class="px-4 py-2 bg-gray-300 rounded">&lt;</button>
          <button @click="nextMonth" class="px-4 py-2 bg-gray-300 rounded">&lt;</button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center">
        <div v-for="day in daysOfWeek" :key="day" class="font-bold">{{ day }}</div>
        <div v-for="blank in startDay" :key="'b' + blank" class="invisible"></div>
        <div v-for="date in daysInMonth" :key="date" class="border p-2 cursor-pointer h-16 flex flex-col justify-between items-center" @click="addEvent(date)">
          <span class="block">{{ date }}</span>
          <ul class="text-xs text-blue-500">
            <li v-for="event in events[date]" :key="event">{{ event }}</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentDate: new Date(),
        events: {},
        daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
      };
    },
    computed: {
      currentMonthYear() {
        return this.currentDate.toLocaleDateString("zh-TW", { year: "numeric", month: "long" });
      },
      startDay() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
      },
      daysInMonth() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
      }
    },
    methods: {
      prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = new Date(this.currentDate);
      },
      nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = new Date(this.currentDate);
      },
      addEvent(date) {
        const event = prompt("輸入事件:");
        if (event) {
          if (!this.events[date]) {
            this.events[date] = [];
          }
          this.events[date].push(event);
        }
      }
    }
  };
  </script>
  
  <style>
    .grid-cols-7 { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
    .h-16 { height: 4rem; }
  </style>
  