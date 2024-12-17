<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label> 제목 :<input type="text" v-model="noticeDetail.title"/> </label>
                <label>
                    내용 :
                    <input type="text" v-model="noticeDetail.content"/>
                </label>
                파일 :<input type="file" style="display: none" id="fileInput" @change="handlerFile"/>
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div>
                    <div v-if="imageUrl" @click="fileDownload">
                        <label>미리보기</label>
                        <img :src = "imageUrl"/>
                    </div>
                    <div v-else>
                    </div>
                </div>
                


                <div>
                    <label>파일명</label>
                </div>
                <div class="button-box">
                    <button @click="props.idx ? handlerUpdateBtn() : hadlerSaveBtn()">{{ props.idx? '수정' : '저장' }}</button>
                    <button v-if="props.idx" @click="handlerDeleteBtn">삭제</button>
                    <button @click="handlerModal">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import axios from 'axios';
import { useModalStore } from '../../../../stores/modalState';
import { useUserInfo } from '../../../../stores/userInfo';
import { onMounted, onUnmounted } from 'vue';
import { fi } from 'date-fns/locale';

const emit = defineEmits(['postSuccess','modalClose']);
const props = defineProps(['idx']);

const modalState = useModalStore();
const userInfo = useUserInfo();
const noticeDetail = ref({});
const imageUrl = ref('');
const fileData = ref('');

const handlerModal = (idx) => {
    // console.log(idx);
    modalState.setModalState();
}

const hadlerSaveBtn = () => {
    const textData = {
        ...noticeDetail.value,
        loginId: userInfo.user.loginId,
        context: noticeDetail.value.content
    };
    const formData = new FormData();
    if(fileData.value){
        formData.append('file', fileData.value);
    }
    formData.append(
        'text', 
        new Blob([JSON.stringify(textData)],{type: 'application/json'}))

    axios.post('/api/board/noticeFileSaveForm.do',formData).then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    })
};

const searchDetail = () => {
    axios.post("/api/board/noticeDetailBody.do", { noticeSeq: props.idx })
    .then((res) => {
        noticeDetail.value = res.data.detail;
        if(
            noticeDetail.value.fileExt === 'jpg' || 
            noticeDetail.value.fileExt === 'gif' || 
            noticeDetail.value.fileExt === 'png' ||
            noticeDetail.value.fileExt === 'webp'
        ){
            //미리보기를 위한 로직
            getFileImage();
        }
    });
}

const handlerUpdateBtn = () => {
    const textData = {
        title: noticeDetail.value.title, 
        content: noticeDetail.value.content, 
        noticeSeq: props.idx,
    };

    const formData = new FormData();
    if(fileData.value){
        formData.append('file', fileData.value);
    }
    formData.append(
        'text', 
        new Blob([JSON.stringify(textData)],{type: 'application/json'}));

    axios.post('/api/board/noticeUpdateFileForm.do',formData)
    .then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    });
};

const handlerDeleteBtn = () => {
    axios.post('/api/board/noticeDeleteBody.do', { noticeSeq: props.idx })
    .then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    })
}

const handlerFile = (e) =>{
    const fileInfo = e.target.files;
    const fileInfoSplit = fileInfo[0].name.split('.');
    const fileExtension = fileInfoSplit[1].toLowerCase();
    if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png' || fileExtension === 'webp'){
        imageUrl.value = URL.createObjectURL(fileInfo[0]);
    }
    fileData.value = fileInfo[0];
}

const getFileImage = () => {
    let param = new URLSearchParams();
    param.append('noticeSeq', props.idx);
    const postAction = {
        url: '/api/board/noticeDownload.do', 
        method: 'POST',
        data: param,
        responseType: 'blob',
    };
    axios(postAction).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        imageUrl.value = url;
    }); 
}

const fileDownload = () => {
    let param = new URLSearchParams();
    param.append('noticeSeq', props.idx);
    const postAction = {
        url: '/api/board/noticeDownload.do', 
        method: 'POST',
        data: param,
        responseType: 'blob',
    };
    axios(postAction).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', noticeDetail.value.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
};

onMounted(() => {
    console.log(props.idx);
    props.idx && searchDetail(); 
    //부모에게서 idx 값이 전달된게 있을 때만 searchDetail()을 실행
});

onUnmounted(() => {
    emit('modalClose');
});


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
