import axios from "axios";

export const noticeDeleteApi = async(idx) => {
    await axios.post('/api/board/noticeDeleteBody.do',{ noticeSeq: idx });
}