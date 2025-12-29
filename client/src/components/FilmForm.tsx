import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FilmRoll } from "@/shared/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useEffect } from "react";
import rollImage from "@assets/generated_images/generic_film_roll_canister_35mm.png";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  film_type: z.enum(["black_white", "color_negative", "color_slide"] as const),
  film_size: z.enum(["35mm", "120"] as const),
  expiry_date: z.string().optional(),
  expiry_unknown: z.boolean().default(false),
  iso_recommended: z.string(),
  iso_custom: z.string().optional(),
  notes: z.string().optional(),
  quantity: z.string().default("1"),
});

interface FilmFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: FilmRoll | null;
}

export default function FilmForm({ open, onOpenChange, onSubmit, initialData }: FilmFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      film_type: "color_negative",
      film_size: "35mm",
      expiry_date: "",
      expiry_unknown: false,
      iso_recommended: "400",
      iso_custom: "",
      notes: "",
      quantity: "1",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          manufacturer: initialData.manufacturer,
          film_type: initialData.film_type,
          film_size: initialData.film_size,
          expiry_date: initialData.expiry_date || "",
          expiry_unknown: initialData.expiry_date === null,
          iso_recommended: initialData.iso_recommended.toString(),
          iso_custom: initialData.iso_custom ? initialData.iso_custom.toString() : "",
          notes: initialData.notes || "",
          quantity: initialData.quantity.toString(),
        });
      } else {
        form.reset({
          name: "",
          manufacturer: "",
          film_type: "color_negative",
          film_size: "35mm",
          expiry_date: "",
          expiry_unknown: false,
          iso_recommended: "400",
          iso_custom: "",
          notes: "",
          quantity: "1",
        });
      }
    }
  }, [initialData, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...values,
      expiry_date: values.expiry_unknown ? null : (values.expiry_date || null),
      iso_recommended: parseInt(values.iso_recommended, 10),
      iso_custom: values.iso_custom ? parseInt(values.iso_custom, 10) : null,
      quantity: parseInt(values.quantity, 10) || 1,
      image_url: initialData?.image_url || rollImage,
      notes: values.notes || null,
    };
    onSubmit(formattedData);
    onOpenChange(false);
  };

  const watchExpiryUnknown = form.watch("expiry_unknown");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-card border-l border-border">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading text-primary">
            {initialData ? "Edit Film Roll" : "Add New Film Roll"}
          </SheetTitle>
          <SheetDescription>
            Enter the details of your film stock below.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Film Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kodak Portra 400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kodak">Kodak</SelectItem>
                        <SelectItem value="Fujifilm">Fujifilm</SelectItem>
                        <SelectItem value="Ilford">Ilford</SelectItem>
                        <SelectItem value="Cinestill">Cinestill</SelectItem>
                        <SelectItem value="Agfa">Agfa</SelectItem>
                        <SelectItem value="Lomography">Lomography</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="film_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="35mm" />
                          </FormControl>
                          <FormLabel className="font-normal">35mm</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="120" />
                          </FormControl>
                          <FormLabel className="font-normal">120</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="film_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="color_negative">Color Negative (C-41)</SelectItem>
                      <SelectItem value="black_white">Black & White</SelectItem>
                      <SelectItem value="color_slide">Color Slide (E-6)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="iso_recommended"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Speed (ISO)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ISO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[25, 50, 64, 80, 100, 125, 160, 200, 400, 800, 1600, 3200].map((iso) => (
                          <SelectItem key={iso} value={iso.toString()}>{iso}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iso_custom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rated ISO (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 320" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={watchExpiryUnknown} 
                        value={field.value || ""} 
                        className={watchExpiryUnknown ? "opacity-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_unknown"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Unknown expiry date
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 1" 
                      min="1"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Storage conditions, push/pull plans, etc." 
                      className="resize-none h-24" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {initialData ? "Save Changes" : "Add Film Roll"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
