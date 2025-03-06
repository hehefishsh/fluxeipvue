<template>
    <div class="card card-default" id="page-views">
      <div class="card-header">
        <h2>相關資源</h2>
      </div>
      <div class="card-body py-0" data-simplebar>
        <div v-if="allGuideline && allGuideline.length">
          <table class="table table-borderless table-thead-border">
            <thead>
              <tr>
                <th class="text">ID</th>
                <th class="text">標題</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="guideline in allGuideline" :key="guideline.guideId">
                <td class="text">{{ guideline.guideId }}</td>
                <td class="text">
                  <a
                    :href="`/guideline/detail/${guideline.guideId}`"
                    class="badge badge-square badge-outline-primary"
                  >
                    {{ guideline.guideTitle }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      <div class="bg-white py-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const allGuideline = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('/api/guidelines')
    allGuideline.value = response.data
  } catch (error) {
    console.error('Error fetching guidelines:', error)
  }
})
</script>

<style>
</style>
