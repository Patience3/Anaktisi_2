// components/admin/program-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye } from "lucide-react";
import Link from "next/link";

// Define the program type with the properties we'll display in the table

export type Program = {
    id: string;
    name: string;
    code?: string;
    is_active?: boolean;
    created_at: string;
    description?: string; // Add this line
};

export const columns: ColumnDef<Program>[] = [
    // Name column
    {
        accessorKey: "name",
        header: "Program Name",
        cell: ({ row }) => {
            const program = row.original;
            return (
                <div>
                    <div className="font-medium">{program.name}</div>
                    <div className="text-sm text-muted-foreground">{program.code}</div>
                </div>
            );
        },
    },

    // Status column
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const status = !!row.getValue("is_active");
            return (
                <Badge variant={status ? "outline" : "destructive"}>
                    {status ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },

    // Created date column
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            const created = new Date(row.getValue("created_at"));
            return <div>{created.toLocaleDateString()}</div>;
        },
    },

    // Actions column
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const program = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/programs/${program.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/programs/${program.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(program.id)}
                            className="text-muted-foreground"
                        >
                            Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
