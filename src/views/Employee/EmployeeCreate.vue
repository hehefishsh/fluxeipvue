<template>
                <!-- 輸入頁面內容 -->
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="employeeName">員工姓名</label>
                        <input type="text" class="form-control rounded-0" id="employeeName" placeholder="姓名"
                            v-model="employeeName" required />
                    </div>
                    <div class="form-group">
                        <label for="password">密碼</label>
                        <input type="password" class="form-control rounded-0" id="password" placeholder="密碼"
                            v-model="password" required />
                    </div>
                    <div class="form-group">
                        <label for="departmentId">部門</label>
                        <select class="form-control rounded-0" id="departmentId" v-model="selectedDepartmentId"
                            required>
                            <option v-for="department in departments" :key="department.departmentId"
                                :value="department.departmentId">
                                {{ department.departmentName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="positionId">職位</label>
                        <select class="form-control rounded-0" id="positionId" v-model="selectedPositionId" required>
                            <option v-for="position in positions" :key="position.positionId"
                                :value="position.positionId">
                                {{ position.positionName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="startDate">入職時間</label>
                        <input type="date" id="startDate" v-model="startDate" class="custom-select my-1 mr-sm-2 w-auto"
                            required />
                    </div>
                    <div class="form-footer">
                        <button type="submit" class="btn btn-secondary btn-pill">提交</button>
                        <button type="button" @click="goBack" class="btn btn-light btn-pill">取消</button>
                    </div>
                </form>
</template>

<script >
    export default {
        name: 'AddEmployee',
        data() {
            return {
                employeeName: '',
                password: '',
                selectedDepartmentId: null,
                selectedPositionId: null,
                startDate: '',
                departments: [], // 部門資料
                positions: []    // 職位資料
            };
        },
        mounted() {
            this.fetchDepartments();
            this.fetchPositions();
        },
        methods: {
            fetchDepartments() {
                // 在這裡發送請求獲取部門資料
                // 例如使用 axios
                // axios.get('/api/departments').then(response => {
                //   this.departments = response.data;
                // });
            },
            fetchPositions() {
                // 在這裡發送請求獲取職位資料
                // 例如使用 axios
                // axios.get('/api/positions').then(response => {
                //   this.positions = response.data;
                // });
            },
            submitForm() {
                // 提交表單的邏輯
                const employeeData = {
                    employeeName: this.employeeName,
                    password: this.password,
                    departmentId: this.selectedDepartmentId,
                    positionId: this.selectedPositionId,
                    startDate: this.startDate
                };

                // 例如使用 axios 提交表單
                // axios.post('/api/employees', employeeData).then(response => {
                //   // 處理成功回應
                // });
            },
            goBack() {
                window.history.back();
            }
        }
    };
</script>

<style scoped>
    /* 在這裡添加樣式 */
</style>