"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    const [hours, minutes, seconds] = (document.getElementById('time-picker') as HTMLInputElement).value.split(':').map(Number);
    newDate.setHours(hours, minutes, seconds);
    onChange(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const [hours, minutes, seconds] = newTime.split(':').map(Number);
    const newDate = new Date(value.getTime());
    newDate.setHours(hours, minutes, seconds);
    onChange(newDate);
  };

  const dateValue = value ? new Date(value) : undefined;
  const timeValue = value ? value.toTimeString().split(' ')[0] : '00:00:00';

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1 text-gray-300">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-48 justify-between font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
            >
              {dateValue ? dateValue.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1 text-gray-300">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  )
}
