"use client";

import React, {ChangeEvent, startTransition, useActionState, useState} from 'react';
import {useFormStatus} from 'react-dom';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {Add as AddIcon, Edit as EditIcon} from '@mui/icons-material';
import {upsertPostAction} from "@/libs/actions/post";
import {hasBannedWords, PostSchema} from "@/libs/actions/post-schema";


const CATEGORIES = [
    { value: 'NOTICE', label: '공지사항' },
    { value: 'QNA', label: '질문/답변' },
    { value: 'FREE', label: '자유 게시판' },
];

interface PostData {
    id?: string;
    title: string;
    body: string;
    category: string;
    tags: string[];
}

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    const buttonText = isEditMode ? '게시글 수정' : '게시글 등록';
    const Icon = isEditMode ? EditIcon : AddIcon;

    return (
        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            disabled={pending}
            startIcon={pending ? <CircularProgress size={20} color="inherit" /> : <Icon />}
        >
            {pending ? (isEditMode ? '수정 중...' : '작성 중...') : buttonText}
        </Button>
    );
}

interface TagsInputProps {
    errors?: string[];
    tags: string[];
    onTagsChange: (newTags: string[]) => void;
}

function TagsInput({ errors, tags, onTagsChange }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const saveTag = (value: string) => {
        const tagText = value.replace(/,/g, '').trim();

        if(hasBannedWords(inputValue)){
            alert('금칙어가 포함되어있습니다.');
            setInputValue('');
            return;
        }

        if (tagText && tags.length < 5 && !tags.includes(tagText)) {
            onTagsChange([...tags, tagText]);
            setInputValue('');
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (newValue.includes(',')) {
            saveTag(newValue);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            saveTag(inputValue);
        }
    };

    const handleDelete = (tagToDelete: string) => () => {
        onTagsChange(tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <TextField
                fullWidth
                label="태그 (최대 5개, Enter 또는 콤마로 입력)"
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                error={!!errors && errors.length > 0}
                helperText={errors && errors.length > 0 ? errors[0] : '쉼표 또는 Enter 키로 태그를 입력하세요.'}
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={handleDelete(tag)}
                        color="secondary"
                        size="small"
                    />
                ))}
            </Box>
            <input type="hidden" name="tags" value={tags.join(', ')} />
        </Box>
    );
}


type FormState = {
    message: string;
    errors?: Record<string, string[] | undefined>;
};

export default function PostForm({ initialData }: { initialData: PostData }) {
    const isEditMode = !!initialData.id;
    const initialState: FormState = { message: '', errors: {} };

    const [fields, setFields] = useState({
        title: initialData.title,
        body: initialData.body,
        category: initialData.category || CATEGORIES[0].value,
        tags: initialData.tags,
    });

    const [clientErrors, setClientErrors] = useState<Record<string, string[] | undefined>>({});

    const [state, dispatch] = useActionState(upsertPostAction as (
        state: FormState,
        formData: FormData
    ) => Promise<FormState>, initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const name = e.target.name;
        const value = e.target.value as string;

        if (name) {
            setFields((prevFields) => ({
                ...prevFields,
                [name]: value,
            }));

            setClientErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined,
            }));
        }
    };

    const handleTagsChange = (newTags: string[]) => {
        setFields((prevFields) => ({
            ...prevFields,
            tags: newTags,
        }));

        setClientErrors((prevErrors) => ({
            ...prevErrors,
            tags: undefined,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const currentData = {
            title: fields.title,
            body: fields.body,
            category: fields.category,
            tags: fields.tags,
            id: initialData.id,
        };

        const parseResult = PostSchema.safeParse(currentData);

        if (!parseResult.success) {
            const newErrors: Record<string, string[] | undefined> = {};

            parseResult.error.issues.forEach(issue => {
                const path = issue.path.join('.');
                if (!newErrors[path]) {
                    newErrors[path] = [];
                }
                newErrors[path]?.push(issue.message);
            });

            setClientErrors(newErrors);
            return;
        }

        const formData = new FormData(event.currentTarget);
        formData.set('tags', fields.tags.join(','));

        startTransition(() => {
            dispatch(formData);
        });
    };

    const displayErrors = { ...clientErrors, ...state.errors };


    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    {isEditMode ? '게시글 수정' : '새 게시글 작성'}
                </Typography>

                {state.message && state.message.includes('성공') && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {state.message}
                    </Alert>
                )}

                {state.message && state.message.includes('오류') && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {state.message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    {isEditMode && (
                        <input type="hidden" name="id" value={initialData.id} />
                    )}

                    <TextField
                        select
                        fullWidth
                        label="카테고리"
                        name="category"
                        variant="outlined"
                        margin="normal"
                        value={fields.category}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                        error={!!displayErrors?.category}
                        helperText={displayErrors?.category ? displayErrors.category[0] : ''}
                    >

                        {CATEGORIES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        fullWidth
                        label="제목 (최대 80자)"
                        name="title"
                        variant="outlined"
                        margin="normal"
                        value={fields.title}
                        onChange={handleChange}
                        error={!!displayErrors?.title}
                        helperText={displayErrors?.title ? displayErrors.title[0] : ''}
                    />

                    <TextField
                        fullWidth
                        label="본문 (최대 2000자)"
                        name="body"
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={6}
                        sx={{ mt: 2 }}
                        value={fields.body}
                        onChange={handleChange}
                        error={!!displayErrors?.body}
                        helperText={displayErrors?.body ? displayErrors.body[0] : ''}
                    />

                    <TagsInput
                        errors={displayErrors?.tags}
                        tags={fields.tags}
                        onTagsChange={handleTagsChange}
                    />

                    <SubmitButton isEditMode={isEditMode} />
                </Box>
            </Paper>
        </Container>
    );
}
