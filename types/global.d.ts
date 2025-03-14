// app/types/global.d.ts

// Response types for server actions
interface ActionResponse<T = null> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    };
    status?: number;
}

// Auth credential types
interface AuthCredentials {
    email: string;
    password: string;
}

// Database entity types
interface User {
    id: string;
    email: string;
    role: 'admin' | 'patient';
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    profile_photo_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Define UserProfile as an alias to User for consistency
type UserProfile = User;

// Supabase Auth User
interface SupabaseUser {
    id: string;
    email?: string;
    [key: string]: unknown; // Use unknown instead of any for index signature
}
interface ProgramCategory {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}



// HTTP Error interfaces for type checking
interface RequestError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;
}

interface ValidationError extends RequestError {
    fieldErrors: Record<string, string[]>;
}

interface TreatmentProgram {
    id: string;
    category_id: string;
    title: string;
    description: string;
    duration_days?: number;
    is_self_paced: boolean;
    created_by: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface LearningModule {
    id: string;
    program_id: string;
    title: string;
    description?: string;
    sequence_number: number;
    estimated_minutes?: number;
    is_required: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface ContentItem {
    id: string;
    module_id: string;
    title: string;
    content_type: 'video' | 'text' | 'assessment';
    content?: string;
    sequence_number: number;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface PatientEnrollment {
    id: string;
    patient_id: string;
    program_id: string;
    enrolled_by: string;
    start_date: string;
    expected_end_date?: string;
    completed_date?: string;
    status: 'assigned' | 'in_progress' | 'completed' | 'dropped';
    created_at: string;
    updated_at: string;
}

interface ModuleProgress {
    id: string;
    patient_id: string;
    module_id: string;
    enrollment_id: string;
    status: 'not_started' | 'in_progress' | 'completed';
    started_at?: string;
    completed_at?: string;
    time_spent_seconds?: number;
    created_at: string;
    updated_at: string;
}

interface ContentAccessRecord {
    id: string;
    patient_id: string;
    content_item_id: string;
    started_at: string;
    ended_at?: string;
    duration_seconds?: number;
    created_at: string;
}

interface Assessment {
    id: string;
    content_item_id: string;
    title: string;
    description?: string;
    passing_score: number;
    time_limit_minutes?: number;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface AssessmentQuestion {
    id: string;
    assessment_id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'text_response';
    sequence_number: number;
    points?: number;
    created_at: string;
    updated_at: string;
}

interface QuestionOption {
    id: string;
    question_id: string;
    option_text: string;
    is_correct: boolean;
    sequence_number: number;
    created_at: string;
    updated_at: string;
}

interface PatientAssessmentAttempt {
    id: string;
    patient_id: string;
    assessment_id: string;
    started_at: string;
    completed_at?: string;
    score?: number;
    passed?: boolean;
    created_at: string;
    updated_at: string;
}

interface PatientQuestionResponse {
    id: string;
    attempt_id: string;
    question_id: string;
    selected_option_id?: string;
    text_response?: string;
    is_correct?: boolean;
    points_earned?: number;
    created_at: string;
    updated_at: string;
}

interface TextResponseReview {
    id: string;
    response_id: string;
    admin_id?: string;
    score: number;
    feedback?: string;
    reviewed_at: string;
}

interface MoodEntry {
    id: string;
    patient_id: string;
    content_item_id?: string;
    mood_type: 'happy' | 'calm' | 'neutral' | 'stressed' | 'sad' | 'angry' | 'anxious';
    mood_score: number;
    journal_entry?: string;
    entry_timestamp: string;
    created_at: string;
    updated_at: string;
}

interface PatientNote {
    id: string;
    patient_id: string;
    admin_id?: string;
    note: string;
    created_at: string;
    updated_at: string;
}

interface Notification {
    id: string;
    recipient_id: string;
    sender_id?: string;
    message: string;
    notification_type: 'reminder' | 'feedback' | 'system' | 'custom';
    is_read: boolean;
    created_at: string;
    updated_at: string;
}
