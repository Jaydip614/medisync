"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { trpc } from "@/app/trpc/client"
import { Combobox } from "@/components/ui/combobox"

const formSchema = z.object({
  title: z.string({
    required_error: "Please enter a title",
  }),
  specializationId: z.string({
    required_error: "Please select a specialization",
  }),
  doctorId: z.string({
    required_error: "Please select a doctor",
  }),
  date: z.date({
    required_error: "Please select a date and time",
  }),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Please select severity level",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
// get default data for update form
interface BookAppointmentSheetProps {
  //defaultValues = form values + id for update
  defaultValues?: FormValues & { id: string };
  refetchAppointments?: () => void;
}
export function BookAppointmentSheet({ defaultValues, refetchAppointments }: BookAppointmentSheetProps) {
  const [open, setOpen] = useState(false)
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null)

  const { data: specializations, isLoading: loadingSpecializations } = trpc.patient.getSpecializations.useQuery()
  const { data: doctors, isLoading: loadingDoctors } = trpc.patient.getDoctorsBySpecialization.useQuery(
    { specializationId: selectedSpecialization || "" },
    { enabled: !!selectedSpecialization },
  )

  // Check if user can book appointment
  const { data: appointmentStatus, isLoading: checkingAppointmentStatus } = trpc.payment.canBookAppointment.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  // console.log(defaultValues);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specializationId: "",
      doctorId: "",
      severity: "low",
      notes: "",
      ...defaultValues,
    },
  })
  const ctx = trpc.useContext();
  const createAppointment = trpc.patient.createAppointment.useMutation({
    onSuccess: () => {
      toast.success("Appointment booked successfully")
      setOpen(false)
      form.reset()
      // Refetch the appointment status to update remaining appointments
      ctx.payment.canBookAppointment.invalidate();
    },
    onError: (error: any) => {
      if (error.message.includes("payment")) {
        toast.error("Please purchase a subscription or make a payment to book appointments")
      } else {
        toast.error("Failed to book appointment. Please try again later.");
        console.log(`Failed to book appointment: ${error.message}\n ${error.stack}`);
      }
    }
  })
  const updateAppointment = trpc.patient.updateAppointment.useMutation({
    onSuccess: () => {
      toast.success("Appointment updated successfully")
      setOpen(false)
      form.reset()
      // Refetch the appointment status to update remaining appointments
      ctx.payment.canBookAppointment.invalidate();
    },
    onError: (error: any) => {
      toast.error("Failed to update appointment. Please try again later.");
      console.log(`Failed to update appointment: ${error.message}\n ${error.stack}`);
    }
  })
  useEffect(() => {
    if (selectedSpecialization) {
      form.setValue("doctorId", ""); // Reset doctorId when specialization changes
    }
  }, [selectedSpecialization, form]);

  function onSubmit(data: FormValues) {
    if (defaultValues) {
      // indicates that this is an update
      updateAppointment.mutate({
        id: defaultValues.id, ...data,
        // check if date is changed means its a reschedule
        status: data.date === defaultValues.date ? "scheduled" : "rescheduled"
      });
      // refetch the appointment status to update remaining appointments
      ctx.payment.canBookAppointment.invalidate();
      refetchAppointments?.();
      return;
    }
    if (!appointmentStatus?.canBook) {
      toast.error("You need to make a payment to book an appointment")
      setOpen(false)
      return
    }
    createAppointment.mutate(data)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const getPaymentStatusInfo = () => {
    if (!appointmentStatus) return null;

    if (appointmentStatus.paymentType === 'subscription') {
      return (
        <Alert className="mb-4 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Active Subscription</AlertTitle>
          <AlertDescription className="text-green-700">
            You can book unlimited appointments with your active subscription.
          </AlertDescription>
        </Alert>
      );
    } else if (appointmentStatus.paymentType === 'single') {
      return (
        <Alert className="mb-4 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-600">Single Payment</AlertTitle>
          <AlertDescription className="text-blue-700">
            You can book {appointmentStatus.remainingAppointments} more appointment{appointmentStatus.remainingAppointments !== 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>{
          defaultValues ? "Edit Appointment" : "Book Appointment"
        }</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key="appointment-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1 overflow-y-auto"
          >
            <SheetHeader className="space-y-2">
              <SheetTitle>Book an Appointment</SheetTitle>
              <SheetDescription>Fill in the details below to schedule your appointment with a doctor.</SheetDescription>
            </SheetHeader>

            {checkingAppointmentStatus ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Checking payment status...</p>
              </div>
            ) : appointmentStatus ? (
              <>
                {getPaymentStatusInfo()}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <FormField
                      control={form.control}
                      name="specializationId"
                      disabled={defaultValues?.id !== undefined}
                      render={({ field }) => (
                        <FormItem className={cn("w-full", defaultValues?.id !== undefined && "hidden")}>
                          <FormLabel>Select Specialization</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value); // Update the form value
                              setSelectedSpecialization(value); // Update the selected specialization
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loadingSpecializations ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                specializations?.map((specialization) => (
                                  <SelectItem key={specialization.id} value={specialization.id}>
                                    {specialization.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={defaultValues?.id !== undefined}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem className={cn("w-full", defaultValues?.id !== undefined && "hidden")}>
                          <FormLabel>Select Doctor</FormLabel>
                          <Combobox
                            options={
                              doctors?.map((doctor) => ({
                                label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                                value: doctor.id,
                              })) || []
                            }
                            onSelect={(value) => field.onChange(value)}
                            searchPlaceholder="Search doctors..."
                            emptyMessage={loadingDoctors ? "Loading doctors..." : "No doctors found"}
                            {...field}
                            placeholder="Select a doctor"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date and Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                                  date > new Date(new Date().setMonth(new Date().getMonth() + 2)) // Disable dates beyond 2 months
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Select a date within the next 2 months</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      disabled={defaultValues?.id !== undefined}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low - Regular checkup</SelectItem>
                              <SelectItem value="medium">Medium - Minor health issues</SelectItem>
                              <SelectItem value="high">High - Serious condition</SelectItem>
                              <SelectItem value="critical">Critical - Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Choose the severity level that best describes your condition</FormDescription>
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
                              placeholder="Describe your symptoms or reason for visit"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Add any additional information that might be helpful</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </>
            ) : (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Unable to check your payment status. Please try again later.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Fixed Submit Button */}
        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createAppointment.isPending || !appointmentStatus?.canBook || updateAppointment.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {createAppointment.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {defaultValues?.id !== undefined ? "Updating..." : "Booking..."}
                </div>
              ) : (
                defaultValues?.id !== undefined ? "Update Appointment" : "Book Appointment"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}