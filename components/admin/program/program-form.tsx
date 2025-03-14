"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProgram, getCategories } from "@/lib/actions/admin/program";
import { CreateProgramSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import {CreateProgramParams} from "@/types/action";

export function ProgramForm() {
    const [categories, setCategories] = useState<ProgramCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Initialize React Hook Form
    const form = useForm({
        resolver: zodResolver(CreateProgramSchema),
        defaultValues: {
            title: "",
            description: "",
            categoryId: "",
            durationDays: 30,
            isSelfPaced: false
        }
    });

    useEffect(() => {
        async function fetchCategories() {
            const result = await getCategories();
            if (result.success && result.data) {
                setCategories(result.data);
            }
        }

        fetchCategories();
    }, []);

    async function onSubmit(data :CreateProgramParams) {
        console.error("An unexpected error occured e.message")
        setIsLoading(true);
        setError("");

        try {
            console.log("Tada")
            const result = await createProgram(data);

            if (result.success && result.data) {
                console.log("Anhhhhhhhh unexpected error occured e.message")
                // router.push(`/admin/programs/${result.data.id}`);
            } else {
                console.error("An unexpected error occured e.message")
                setError(result.error?.message || "Failed to create program");

                // Handle validation errors
                if (result.error?.details) {
                    Object.entries(result.error.details).forEach(([field, messages]) => {
                        form.setError(field as never, {
                            type: "server",
                            message: messages[0]
                        });
                    });
                }
            }
        } catch (e) {
            console.error("An unexpected error occured e.message")
            setError("An unexpected error occured e.message");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Program Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter program title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter program description"
                                    rows={5}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="durationDays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Days)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isSelfPaced"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Self-Paced</FormLabel>
                                    <div className="text-sm text-gray-500">
                                        Let patients progress at their own pace
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Program"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}




