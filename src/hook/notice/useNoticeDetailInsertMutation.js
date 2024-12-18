import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useRouter } from "vue-router";
import { useUserInfo } from "../../stores/userInfo";
import { noticeDetailInsertApi } from "../../api/notice/noticeDetailInsertApi";

export const useNoticeDetailInsertMutation = (detailValue, userInfo) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => noticeDetailInsertApi(detailValue.value, userInfo),
        mutationKey: ['noticeUpdate'],
        onSuccess: () => {
            router.go(-1);
            queryClient.invalidateQueries({
                queryKey: ['noticeList'],
            })
        }

    })
}
