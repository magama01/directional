import {z} from 'zod';


const BANNED_WORDS = ['캄보디아','프놈펜', '불법체류', '텔레그램'];

const hasBannedWords = (text: string): boolean => {
    const lowerText = text.toLowerCase().replace(/\s/g, '');
    return BANNED_WORDS.some(word => lowerText.includes(word));
};


const PostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, '제목은 필수입니다.').max(80, '제목은 80자 이내여야 합니다.').refine(val => !hasBannedWords(val), {
        message: '금칙어가 포함되어 있습니다.'
    }),
    body: z.string().min(10, '본문은 최소 10자 이상이어야 합니다.').max(2000, '본문은 2000자 이내여야 합니다.').refine(val => !hasBannedWords(val), {
        message: '금칙어가 포함되어 있습니다.'
    }),
    category: z.enum(['NOTICE', 'QNA', 'FREE']).refine((val) => val, {
        message: '유효한 카테고리를 선택해야 합니다.',
    }),
    tags: z.array(z.string().max(24, '태그는 24자 이내여야 합니다.').refine(val => !hasBannedWords(val), {
        message: '금칙어가 포함되어 있습니다.'
    })).max(5, '태그는 최대 5개까지 가능합니다.')
});


export {PostSchema, BANNED_WORDS, hasBannedWords}
