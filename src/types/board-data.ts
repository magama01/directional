interface BoardData {
    id: string;
    userId: string;
    title: string;
    body: string;
    category: string;
    tags: string[];
    createdAt?: Date
}

interface BoardResponse {
    nextCursor?: string;
    prevCursor?: string;
    items: BoardData[]
}

export type {BoardData, BoardResponse}
