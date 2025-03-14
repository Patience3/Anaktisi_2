"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import action from "@/lib/handlers/action";
import { handleServerError } from "@/lib/handlers/error";
import { requireAdmin } from "@/lib/auth-utils";
import { CreateProgramSchema } from "@/lib/validations";
import {CreateProgramParams} from "@/types/action";

export async function getCategories():Promise<ActionResponse<ProgramCategory[]>> {
    try {
        await requireAdmin();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("program_categories")
            .select("*")
            .order("name");

        if (error) throw error;

        return {
            success: true,
            data
        };
    } catch (error) {
        return handleServerError(error);
    }
}

export async function createProgram(params: CreateProgramParams): Promise<ActionResponse> {
    try {
        const validationResult = await action({
            params,
            schema: CreateProgramSchema,
            authorize: true,
            requiredRole: "admin"
        });

        if (validationResult instanceof Error) {
            return handleServerError(validationResult);
        }

        const { params: validatedParams, user } = validationResult;
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("treatment_programs")
            .insert({
                title: validatedParams.title,
                description: validatedParams.description,
                category_id: validatedParams.categoryId,
                duration_days: validatedParams.durationDays,
                is_self_paced: validatedParams.isSelfPaced,
                created_by: user!.id
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/programs");

        return {
            success: true,
            data
        };
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getPrograms() {
    try {
        await requireAdmin();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("treatment_programs")
            .select(`
        *,
        category:program_categories(id, name)
      `)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return {
            success: true,
            data
        };
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getProgramById(id: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("treatment_programs")
            .select(`
        *,
        category:program_categories(id, name),
        modules:learning_modules(
          *,
          content_items(*)
        )
      `)
            .eq("id", id)
            .single();

        if (error) throw error;

        // Sort modules by sequence number


        return {
            success: true,
            data
        };
    } catch (error) {
        return handleServerError(error);
    }
}