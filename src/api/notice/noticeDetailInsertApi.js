import axios from "axios";

export const noticeDetailInsertApi = async(detailValue, userInfo) => {
    const textData = {
        ...detailValue,
        context: detailValue.content,
        loginId: userInfo.user.loginId
    };
    await axios.post('/api/board/noticeSaveBody.do',textData);
}