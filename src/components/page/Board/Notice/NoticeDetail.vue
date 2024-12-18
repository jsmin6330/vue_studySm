<template>
     <div >
        <div v-if="isLoading">로딩중 입니다</div>
        <div v-else>
                <ContextBox> 공지사항 상세조회</ContextBox>
                <label> 제목 :<input type="text" v-model="detailValue.title"/> </label>
                <label>
                    내용 :
                    <input type="text" v-model="detailValue.content"/>
                </label>
                파일 :<input type="file" style="display: none" id="fileInput"/>
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div>
                    <!-- <div v-if="imageUrl" @click="fileDownload">
                        <label>미리보기</label>
                        <img :src = "imageUrl"/>
                    </div>
                    <div v-else>
                    </div> -->
                </div>

                <div>
                    <label>파일명</label>
                </div>
                <div class="button-box">
                    <button @click="params.idx ? handlerUpdateBtn() : handlerInsertBtn()">{{ params.idx? '수정' : '저장' }}</button>
                    <button @click="handlerDeleteBtn">삭제</button>
                    <button @click="$router.go(-1)">뒤로가기</button>
                </div>
        </div>    
    </div>

</template>

<script setup>
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { watchEffect } from 'vue';
import { useNoticeDetailUpdateMutation } from '../../../../hook/notice/useNoticeDetailUpdateMutation';
import { useNoticeDetailInsertMutation } from '../../../../hook/notice/useNoticeDetailInsertMutation';
import { useNoticeDeleteMutation } from '../../../../hook/notice/useNoticeDeleteMutation';
import { useUserInfo } from '../../../../stores/userInfo';

const { params } = useRoute();
const detailValue = ref({});
const userInfo = useUserInfo();
    
const searchDetail = async() => {
    const result = await axios.post("/api/board/noticeDetailBody.do", { noticeSeq: params.idx });
    return result.data;
}

const {data: noticeDetail, isLoading, isSuccess} = useQuery({
    queryKey: ['noticeDetail'],
    queryFn: searchDetail,
    enabled: !!params.idx
})

watchEffect(() => {
    if(isSuccess.value && noticeDetail.value){
        detailValue.value = toRaw(noticeDetail.value.detail);
    }
})

const {mutate: handlerUpdateBtn} = useNoticeDetailUpdateMutation(detailValue, params.idx);

const {mutate: handlerInsertBtn} = useNoticeDetailInsertMutation(detailValue, userInfo);

const {mutate: handlerDeleteBtn} = useNoticeDeleteMutation(params.idx);

</script>

<style lang="scss" scoped>
.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

label {
    display: flex;
    flex-direction: column;
}

input[type='text'] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
}

img {
    width: 100px;
    height: 100px;
}

.img-label {
    margin-top: 10px;
    padding: 6px 25px;
    background-color: #ccc;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;

    &:hover {
        background-color: #45a049;
        color: white;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

.button-box {
    text-align: right;
    margin-top: 10px;
}
button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>
