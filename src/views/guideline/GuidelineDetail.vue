<template>
    <div class="card card-default" id="page-views">
    <div class="card-header">
        <h2>title</h2>
    </div>
        <div class="card-body py-0" data-simplebar>
            <div v-for="content in contents" :key="content.guidelineContentId">
                <!-- 如果是純文字 -->
                <p v-if="content.contentType === 'text'">{{ content.textContent }}</p>

                <!-- 如果是超連結 -->
                <p v-if="content.contentType === 'link'">
                <a :href="content.textContent" target="_blank">{{ content.textContent }}</a>
                </p>

                <!-- 如果是圖片 -->
                <p v-if="content.contentType === 'image'">
                <img :src="content.imageContent" alt="圖片">
                </p>
            </div>
        <div class="bg-white py-4"></div>
        </div>
    </div>
</template>
    
<script setup>
    import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const guideline = ref({})
const contents = ref([])

onMounted(async () => {
    const guideId = route.params.id  // 從路由中取得動態參數 id
    console.log(guideId)
    try {
    // 發送 GET 請求到後端 API
        const response = await axios.get(`http://localhost:8080/api/guideline/${guideId}`)
        console.log(response); 
        guideline.value = response.data.guideline  // 儲存返回的指南資料
        contents.value = response.data.contents  // 儲存相關的內容列表
    } catch (error) {
        console.error('Error fetching guideline detail:', error)
    }
})
</script>
    
<style>
    
</style>