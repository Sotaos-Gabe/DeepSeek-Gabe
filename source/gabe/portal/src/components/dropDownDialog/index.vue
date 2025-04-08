<template>
    <div
      class="wrapper"
      :style="{position:'fixed',top:position.y +'px',left:position.x+'px'}">
      <el-dropdown size="default" trigger="hover" :hide-on-click="true">
        <template #dropdown>
        <el-cascader-panel size="default" ref="cascade" v-model="casFilter" :options="cascadeList" :props="props" @change="getCas"/>
        </template>
    </el-dropdown>
    </div>
</template>
<script>
export default {
    name: 'DropDownDialog',
    props: {
        // visible: Boolean,
        position: Object,
    },
    data () {
        return {
            casFilter: "",
            props:{
                value: 'label',
                multiple: false, children: 'children',
                label: 'label',
                emitPath: false,
                id: 'label'
            },
            cascadeList: [
                {
                label: "任意所有信息",
                value: "任意所有信息", //搜索字段key
                },
                {
                label: "地理位置",
                value: "地理位置",
                children: [
                    {
                    value: "1",
                    label: "国家",
                    },
                    {
                    value: "2",
                    label: "省份",
                    },
                    {
                    value: "3",
                    label:"城市"
                    },
                    {
                    value: "4",
                    label:"镇"
                    },
                    {
                    value: "5",
                    label:"POI地点"
                    },
                    {
                    value: "6",
                    label:"地名"
                    }
                ],
                },
                {
                label: "个人信息", // 删除全部筛选
                value:'个人信息',
                children: [
                    {
                    value: "0", //搜索字段 value
                    label: "电话号码",
                    },
                    {
                    value: "1",
                    label: "微信号",
                    },
                    {
                    value: "2",
                    label: "微信号含手机号",
                    },
                    {
                    value: "3",
                    label: "常用姓氏人名",
                    },
                    {
                    value: "4",
                    label: "邮箱地址",
                    }
                ],
                },
                {
                label: "时间相关", // 删除全部筛选
                value:'时间相关',
                children: [
                    {
                    value: "0", //搜索字段 value
                    label: "重复时间点",
                    },
                    {
                    value: "1",
                    label: "具体时间点",
                    },
                    {
                    value: "2",
                    label: "时间区间",
                    },
                    {
                    value: "3",
                    label: "一段时间",
                    },
                    {
                    value: "4",
                    label: "所有时间说法",
                    }
                ],
                },
                {
                label: "数字相关", // 删除全部筛选
                value:'数字相关',
                children: [
                    {
                    value: "0", //搜索字段 value
                    label: "任何数字",
                    },
                    {
                    value: "1",
                    label: "价格",
                    }
                ],
                },
                {
                label: "网址&IP", // 删除全部筛选
                value:'网址&IP',
                children: [
                    {
                    value: "0", //搜索字段 value
                    label: "普通网址",
                    },
                    {
                    value: "1",
                    label: "IP地址",
                    },
                    {
                    value: "2",
                    label: "IP转地址",
                    }
                ],
                }
            ],
        }
    },
    methods: {
        getCas(item) {//一级多选，二级单选
            console.log(item)
            console.log("=================getCas===================")
            this.casFilter = item;
            this.$emit('onPickItem', item)
            this.visible = false;
        },
    }
}
</script>
    
<style scoped lang="scss">
.wrapper {
    width: 364px;
    height: 210px;
    overflow: auto;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-sizing: border-box;
    padding: 0 0;
}
/* 隐藏一级的选择框 */
:deep(div.el-scrollbar.el-cascader-menu:first-child li.el-cascader-node>label.el-checkbox) {
  opacity: 0;
}
/* 二级选择框样式 */
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node:last-of-type>label.el-checkbox .el-checkbox__input){
  width:0;
  opacity: 0;
}
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node:last-of-type .el-cascader-node__label){
  padding-left: 0;
}
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node .el-checkbox__input .el-checkbox__inner) {
  border-radius: 50%;
}
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node .el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #fff;
}
/* 二级菜单仅选文字触发 */
:deep(div.el-scrollbar.el-cascader-menu li.el-cascader-node .el-checkbox){
        width: 80%;
      height: 100%;
      z-index: 10;
      position: absolute;
}
:deep(div.el-scrollbar.el-cascader-menu:nth-child(1) li.el-cascader-node:not(:last-of-type) .el-checkbox),
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node .el-checkbox.is-checked){
  pointer-events: none;
}
/* clear 前添加距离 */
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node:not(:last-of-type) .el-cascader-node__label){
    margin-left: 10px;
}
/* 隐藏选择框对号 */
:deep(div.el-scrollbar.el-cascader-menu:nth-child(2) li.el-cascader-node .el-checkbox__input .el-checkbox__inner::after){
  border: none;
  
}
</style>