import {BoardData} from "@/types/board-data";
import {Chip} from "@mui/material";


const categoryLabels: Record<string, string> = {
    'NOTICE': '공지',
    'QNA': 'Q&A',
    'FREE': '자유',
};


export default function CategoryChip({category} : {category :string}) {
    return <Chip
        label={categoryLabels[category]}
        size="small"
        color={category === 'NOTICE' ? 'error' : category === 'QNA' ? 'warning' : 'default'}
    />;
}
