// app/(dashboard)/admin/programs/[id]/page.tsx
import { getProgramById } from "@/lib/actions/admin/program";
import { requireAdmin } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";


export default async function ProgramDetailPage({params}: {params: {id:string}})  {
    await requireAdmin();

    const response = await getProgramById(params.id);

    if (!response.success) {
        notFound();
    }

    const program = response.data;

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link href="/admin/programs" className="text-blue-600 hover:underline mb-2 inline-block">
                        ← Back to Programs
                    </Link>
                    <h1 className="text-3xl font-bold">{program.title}</h1>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline">Edit Program</Button>
                </div>
            </div>
        </div>
    );
}