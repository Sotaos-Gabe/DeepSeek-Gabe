<template>
    <div
      class="wrapper"
      :style="{position:'fixed',top:position.y +'px',left:position.x+'px'}">
      <div v-if="!mockList.length" class="empty">没有检索到您的数智员工</div>
      <div
        v-for="(item,i) in mockList"
        :key="item.agent_id"
        class="item"
        :class="{'active': i === index}"
        ref="usersRef"
        @click="clickAt($event,item)"
        @mouseenter="hoverAt(i)"
      >
        <div class="name">{{item.name+"——职位："+item.job_title}}</div>
      </div>
    </div>
</template>
    
<script>
// const mockData = [
//     { name: 'HTML', id: 'HTML' },
//     { name: 'CSS', id: 'CSS' },
//     { name: 'Java', id: 'Java' },
//     { name: 'JavaScript', id: 'JavaScript' }
// ]
export default {
    name: 'AtDialog',
    props: {
    visible: Boolean,
    position: Object,
    queryString: String,
    staffId: Number
    },
    data () {
        return {
            users: [],
            pageNum: 1,
            total: 0,
            pageSize: 100,
            index: -1,
            staffs: [],
            mockList: []
        }
    },
    created () {
        this.getList()
    },
    watch: {
        queryString (val) {
            val ? this.mockList = staffs.filter(({ name }) => name.startsWith(val)) : this.mockList = staffs.slice(0)
        }
    },
    mounted () {
        document.addEventListener('keyup', this.keyDownHandler)
    },
    destroyed () {
        document.removeEventListener('keyup', this.keyDownHandler)
    },
    methods: {
        keyDownHandler (e) {
            if (e.code === 'Escape') {
                this.$emit('onHide')
                return
            }
            // 键盘按下 => ↓
            if (e.code === 'ArrowDown') {
                if (this.index >= this.mockList.length - 1) {
                    this.index = 0
                } else {
                    this.index = this.index + 1
                }
            }
            // 键盘按下 => ↑
            if (e.code === 'ArrowUp') {
                if (this.index <= 0) {
                    this.index = this.mockList.length - 1
                } else {
                    this.index = this.index - 1
                }
            }
            // 键盘按下 => 回车
            if (e.code === 'Enter') {
                if (this.mockList.length) {
                    const user = {
                    name: this.mockList[this.index].name,
                    id: this.mockList[this.index].agent_id,
                    category: this.mockList[this.index].category,
                    virtual_id: this.mockList[this.index].id,
                    }
                    this.$emit('onPickUser', user)
                    this.index = -1
                }
            }
        },
        clickAt (e, item) {
            const user = {
            name: item.name,
            id: item.agent_id,
            category: item.category,
            virtual_id: item.id,
            }
            this.$emit('onPickUser', user)
            this.index = -1
        },
        hoverAt (index) {
            this.index = index
        },
        getList() {
            this.listLoading = true;
            const params = {
                page: this.pageNum,
                limit: this.pageSize,
            };
            this.$request({
                url: "/tech/amp/virtualStaff/list",
                method: "get",
                params,
            })
            .then(({ data: { list, total } }) => {
            
            this.listLoading = false;
            let list1 = []
            for (let i = 0; i < list.length; i++) {
                if (list[i].id !== this.staffId) {
                list1.push(list[i])
                }
            }
            this.mockList = list1;
            this.staffs = list1;
            this.total = total;
            })
            .catch(() => {
            this.listLoading = false;
            });
        },
    }
}
</script>
    
<style scoped lang="scss">
    .wrapper {
    width: 538px;
    height: 238px;
    overflow: auto;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-sizing: border-box;
    padding: 6px 0;
    }
    .empty{
    font-size: 14px;
    padding: 0 20px;
    color: #999;
    }
    .item {
    font-size: 14px;
    padding: 0 20px;
    line-height: 34px;
    cursor: pointer;
    color: #606266;
    &.active {
        background: #f5f7fa;
        color: blue;
        .id {
        color: blue;
        }
    }
    &:first-child {
        border-radius: 5px 5px 0 0;
    }
    &:last-child {
        border-radius: 0 0 5px 5px;
    }
    .id {
        font-size: 12px;
        color: rgb(83, 81, 81);
    }
    }
</style>