import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { noticeDeleteApi } from "../../api/notice/noticeDeleteApi"
import { useRouter } from "vue-router"

export const useNoticeDeleteMutation = (idx) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => noticeDeleteApi(idx),
        mutationKey: ['noticeDelete'],
        onSuccess: () => {
            router.go(-1);
            queryClient.invalidateQueries({
                queryKey: ['noticeList'],
            })
        }
    })
}