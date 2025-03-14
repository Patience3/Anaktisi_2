"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Edit,
    ExternalLink,
    EyeOff,
    Eye,
    Search,
    SlidersHorizontal,
    Trash2,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ProgramListProps {
    programs: TreatmentProgram[]; // Replace with proper Program type
    categories: ProgramCategory[]; // Replace with proper Category type
}

export function ProgramList({ programs, categories }: ProgramgListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Apply filters and sorting
    const filteredPrograms = useMemo(() => {
        return programs
            .filter(program => {
                // Search filter
                if (searchQuery && !program.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return false;
                }

                // Category filter
                if (categoryFilter && program.category_id !== categoryFilter) {
                    return false;
                }

                // Status filter
                if (statusFilter === "active" && !program.is_active) {
                    return false;
                }
                if (statusFilter === "inactive" && program.is_active) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                // Apply sorting
                switch (sortBy) {
                    case "newest":
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    case "oldest":
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    case "alphabetical":
                        return a.title.localeCompare(b.title);
                    case "duration":
                        return (b.duration_days || 0) - (a.duration_days || 0);
                    default:
                        return 0;
                }
            });
    }, [programs, searchQuery, categoryFilter, statusFilter, sortBy]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const findCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : "Uncategorized";
    };

    // Show "No programs found" message when filteredPrograms is empty
    if (filteredPrograms.length === 0) {
        return (
            <div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search programs..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <FiltersMenu
                            categories={categories}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />

                        <SortMenu sortBy={sortBy} setSortBy={setSortBy} />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-md p-8 text-center border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">No programs found</h3>
                    <p className="text-gray-500 mt-1">
                        Try adjusting your filters or create a new program
                    </p>
                    <Button className="mt-4" asChild>
                        <Link href="/admin/programs/new">Create Program</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search programs..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <FiltersMenu
                        categories={categories}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    <SortMenu sortBy={sortBy} setSortBy={setSortBy} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {filteredPrograms.map(program => (
                    <Card key={program.id} className={cn(
                        "transition-all hover:shadow-md",
                        program.is_active ? "border-gray-200" : "border-gray-200 bg-gray-50"
                    )}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant={program.is_self_paced ? "outline" : "default"} className="mb-1">
                                        {program.is_self_paced ? "Self-paced" : `${program.duration_days} days`}
                                    </Badge>
                                    <CardTitle className="text-lg">{program.title}</CardTitle>
                                </div>
                                <ProgramActions program={program} />
                            </div>
                        </CardHeader>

                        <CardContent className="pb-2">
                            <div className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">
                                {program.description || "No description provided."}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex items-center text-xs text-gray-600">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                    {formatDate(program.created_at)}
                                </div>



                                {program.category_id && (
                                    <div className="flex items-center text-xs">
                                        <Badge variant="secondary" className="font-normal h-5">
                                            {findCategoryName(program.category_id)}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 flex justify-between">
                            <div className="flex items-center text-xs text-gray-600">
                                {program.is_active ? (
                                    <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-gray-700 bg-gray-100">
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            <Button size="sm" variant="outline" asChild>
                                <Link href={`/admin/programs/${program.id}`}>
                                    View Details
                                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

interface FiltersMenuProps {
    categories: ProgramCategory[];
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
}

function FiltersMenu({
                         categories,
                         categoryFilter,
                         setCategoryFilter,
                         statusFilter,
                         setStatusFilter
                     }: FiltersMenuProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                    <SlidersHorizontal className="h-4 w-4 mr-1" />
                    Filters
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2 text-sm">Program Category</h4>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2 text-sm">Status</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status-all"
                                    checked={statusFilter === "all"}
                                    onCheckedChange={() => setStatusFilter("all")}
                                />
                                <label
                                    htmlFor="status-all"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    All Programs
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status-active"
                                    checked={statusFilter === "active"}
                                    onCheckedChange={() => setStatusFilter("active")}
                                />
                                <label
                                    htmlFor="status-active"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Active Programs
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status-inactive"
                                    checked={statusFilter === "inactive"}
                                    onCheckedChange={() => setStatusFilter("inactive")}
                                />
                                <label
                                    htmlFor="status-inactive"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Inactive Programs
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

interface SortMenuProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

function SortMenu({ sortBy, setSortBy }: SortMenuProps) {
    return (
        <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
        </Select>
    );
}

interface ProgramActionsProps {
    program: TreatmentProgram;
}

function ProgramActions({ program }: ProgramActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/programs/${program.id}/edit`} className="flex items-center cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Program
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={`/admin/programs/${program.id}/modules`} className="flex items-center cursor-pointer">
                        <Clock className="h-4 w-4 mr-2" />
                        Manage Modules
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex items-center cursor-pointer">
                    {program.is_active ? (
                        <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Deactivate Program
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4 mr-2" />
                            Activate Program
                        </>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Program
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}