"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

import { stockItemSchema, StockItem } from "@/lib/types";
import { HsnCodeReference } from "@/lib/types";
import { formatHsnCode } from "@/lib/hsn-codes";

interface CreateStockItemDialogProps {
  trigger: React.ReactNode;
  uomOptions: { id: string; name: string; code: string }[];
  categoryOptions: { id: string; name: string; prefixCode: string }[];
  groupOptions: { id: string; name: string; code: string; categoryId: string }[];
}

export function CreateStockItemDialog({
  trigger,
  uomOptions,
  categoryOptions,
  groupOptions,
}: CreateStockItemDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<HsnCodeReference[]>([]);
  const [filteredGroups, setFilteredGroups] = useState(groupOptions);

  // Define form schema
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    description: z.string().nullable().optional(),
    specifications: z.string().nullable().optional(),
    cgstRate: z.number().int().min(0).max(100).nullable().optional(),
    sgstRate: z.number().int().min(0).max(100).nullable().optional(),
    igstRate: z.number().int().min(0).max(100).nullable().optional(),
    hsnCode: z.string().nullable().optional(),
    isActive: z.boolean(),
    stockCategoryId: z.string().uuid().nullable().optional(),
    stockGroupId: z.string().uuid().nullable().optional(),
    uomId: z.string().uuid("Unit of Measurement is required"),
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      specifications: "",
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      hsnCode: "",
      isActive: true,
      stockCategoryId: "",
      stockGroupId: "",
      uomId: "",
    },
  });

  // Get form values
  const { watch, setValue } = form;
  const materialName = watch("name");
  const categoryId = watch("stockCategoryId");

  // Filter groups based on selected category
  useEffect(() => {
    if (categoryId) {
      setFilteredGroups(groupOptions.filter(group => group.categoryId === categoryId));
    } else {
      setFilteredGroups(groupOptions);
    }
  }, [categoryId, groupOptions]);

  // Fetch HSN code suggestions when material name changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (materialName && materialName.length > 2) {
        try {
          const response = await axios.get(`/api/stock-items/suggest?materialName=${encodeURIComponent(materialName)}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [materialName]);

  // Apply suggestion to form
  const applySuggestion = (suggestion: HsnCodeReference) => {
    // Find the category that matches the prefix code
    const category = categoryOptions.find(
      (cat) => cat.prefixCode === suggestion.prefixCode
    );

    // If category found, set it
    if (category) {
      setValue("stockCategoryId", category.id);
      
      // Find the group that matches the code name and belongs to the category
      const group = groupOptions.find(
        (grp) => 
          grp.name === suggestion.codeName && 
          grp.categoryId === category.id
      );
      
      // If group found, set it
      if (group) {
        setValue("stockGroupId", group.id);
      }
    }

    // Set GST rates based on the suggestion
    setValue("cgstRate", Math.floor(suggestion.gstRate / 2));
    setValue("sgstRate", Math.floor(suggestion.gstRate / 2));
    setValue("igstRate", suggestion.gstRate);
    
    // Set HSN code
    setValue("hsnCode", formatHsnCode(
      suggestion.prefixCode,
      suggestion.codeName,
      suggestion.materialName
    ));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await axios.post("/api/stock-items", data);
      toast.success("Stock item created successfully");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to create stock item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Stock Item</DialogTitle>
          <DialogDescription>
            Add a new stock item to your inventory
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter material name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Suggested HSN Codes:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div>
                        <div className="font-medium">{suggestion.materialName}</div>
                        <div className="text-xs text-muted-foreground">
                          {suggestion.prefixCode} - {suggestion.codeName} - GST: {suggestion.gstRate}%
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="stockCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({category.prefixCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="stockGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                      disabled={!categoryId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={categoryId ? "Select group" : "Select category first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name} ({group.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="uomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measurement</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select UoM" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uomOptions.map((uom) => (
                        <SelectItem key={uom.id} value={uom.id}>
                          {uom.name} ({uom.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="hsnCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="HSN Code" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control as any}
                name="cgstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGST Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="CGST %" 
                        {...field} 
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="sgstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SGST Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="SGST %" 
                        {...field} 
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="igstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IGST Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="IGST %" 
                        {...field} 
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter specifications" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
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

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Stock Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
