import {getCategories, getPrograms } from "@/lib/actions/admin/program";
import { requireAdmin } from "@/lib/auth-utils";
import { ProgramList } from "@/components/admin/program/program-list";
import { Suspense } from "react";
import {Button} from "@/components/ui/button";
import {CreateProgramDialog} from "@/components/admin/program/create-program-dialog";

export default async function ProgramsPage() {
    await requireAdmin();

    const response = await getPrograms();
    const programs = response.success && response.data ? response.data : [];

    const categoriesResponse = await getCategories();
    const categories = categoriesResponse.success && categoriesResponse.data ? categoriesResponse.data : [];




    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Treatment Programs</h1>

                <CreateProgramDialog>
                    <Button>Add New Prograt</Button>
                </CreateProgramDialog>
            </div>

            <Suspense fallback={<div>Loading programs...</div>}>
                <ProgramList programs={programs} categories={categories} />
            </Suspense>
        </div>
    );
}