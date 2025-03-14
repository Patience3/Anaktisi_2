// components/admin/create-program-dialog.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "@/components/admin/program/program-form"


interface CreateProgramDialogProps {
    children: React.ReactNode;
}

export function CreateProgramDialog({ children }: CreateProgramDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [programCode, setProgramCode] = useState<string | null>(null);

    // const onSuccess = (code: string) => {
    //     setSuccess(true);
    //     setProgramCode(code);
    // };

    const handleClose = () => {
        setOpen(false);

        // If we created a program, refresh the page data after closing
        if (success) {
            router.refresh();

            // Reset the dialog state after a short delay
            setTimeout(() => {
                setSuccess(false);
                setProgramCode(null);
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {success ? "Program Created Successfully" : "Create New Program"}
                    </DialogTitle>
                </DialogHeader>

                {success && programCode ? (
                    <>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded border border-blue-200">
                                <p className="font-bold">Program Code:</p>
                                <p className="font-mono mt-1 p-2 bg-white border rounded break-all">
                                    {programCode}
                                </p>

                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleClose}>Done</Button>
                        </div>
                    </>
                ) : (
                    <ProgramForm />


            )}
            </DialogContent>
        </Dialog>
    );
}
