import PostForm from "@/components/(board)/board-post-form";
import {BoardData} from "@/types/board-data";

export default function CreatePage() {


    const initialData: BoardData = {
        id: '',
        body: '',
        category: "NOTICE",
        tags: [],
        title: '',
        userId: '',
    }
    return <PostForm initialData={initialData}/>;
}


