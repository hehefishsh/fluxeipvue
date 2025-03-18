
    <template>
        <div>
            <!--Element Plus 提供 狀態切換  -->
            <el-tabs v-model="selectedStatus">
                <el-tab-pane label="所有預約" name="all"></el-tab-pane>
                <el-tab-pane label="審核中" name="審核中"></el-tab-pane>
                <el-tab-pane label="已審核" name="已審核"></el-tab-pane>
                <el-tab-pane label="已核決" name="已核決"></el-tab-pane>
            </el-tabs>

        <!-- Element Plus 提供 會議表格 -->
            <el-table
                :data="filterMeetings"
                border
                style="width: 100%"
                stripe
                :default-sort="{ prop: 'createdAt', order: 'ascending' }"
                empty-text="無此資料"
            >

            <el-table-column prop="createdAt" label="申請時間" width="180" sortable>
                    <template #default="{ row }">
                        {{ formatDate(row.createdAt) }}
                    </template>
            </el-table-column>

            <el-table-column prop="employeeName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="roomName" label="會議室" width="160"></el-table-column>
            <el-table-column prop="title" label="主題" min-width="200"></el-table-column>

            <el-table-column prop="startTime" label="開始時間" width="180" sortable>
                    <template #default="{ row }">
                        {{ formatDate(row.startTime) }}
                    </template>
            </el-table-column>

            <el-table-column prop="endTime" label="結束時間" width="180" sortable>
                    <template #default="{ row }">
                        {{ formatDate(row.endTime) }}
                    </template>
            </el-table-column>

        

            <el-table-column prop="statusName" label="狀態" width="120">
                    <template #default="{ row }">
                        <el-tag :type="statusTagType(row.statusName)">
                            {{ row.statusName }}
                        </el-tag>
                    </template>
            </el-table-column>
            </el-table>
        </div>
    </template>

    <script setup>
        import { ref, computed, defineProps } from "vue";
        import { ElTable, ElTableColumn, ElTag, ElTabs, ElTabPane } from "element-plus";

        
        const selectedStatus = ref("all");
        const filterMeetings = computed(getFilterMeetings);


        const props = defineProps({
            meetings: {
                type: Array,
                required: true, 
                default: () => [], 
            },
        });



        function getFilterMeetings() {

            if (!props.meetings) {
                return [];
            }

            if (selectedStatus.value === "all") {
                return props.meetings;
            }

            return props.meetings.filter(function(meeting) {
                return meeting.statusName === selectedStatus.value;
            });
        }




  // ✅ 格式化時間
    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleString();
    }

  // ✅ 設定狀態標籤顏色
    function statusTagType(status) {
        switch (status) {
        case "審核中":
        return "warning";
        case "已審核":
        return "success";
        case "已核決":
        return "danger";
        default:
        return "";
        }
    }

    </script>

    <style scoped>
        .el-table {
        margin-top: 10px;
        }
    </style>
