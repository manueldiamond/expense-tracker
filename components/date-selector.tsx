//Vibess.... 
import React, { Dispatch, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { isToday, isYesterday, format } from "date-fns";
import { tags } from "react-native-svg/lib/typescript/xmlTags";

type PeriodOption = 'Today' | 'Yesterday' | 'Date';

const basePeriods: PeriodOption[] = ['Today', 'Yesterday', 'Date'];



export const DateSelect = ({ state, className, }: {
  className?: string;
  state: [Date, Dispatch<React.SetStateAction<Date>>];
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = state;

  const handleDateSelect = (event: any, date?: Date) => {
    setShowPicker(false)
    setSelectedDate(date || new Date())
  }

  return (
    <>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text className={` text-lg ${className}`}>
          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'select date'}
        </Text>
      </TouchableOpacity>
      {showPicker &&
        <DateTimePicker
          mode="date"
          value={selectedDate}
          display="default"
          onChange={handleDateSelect}
        />}
    </>
  )

}
const DateSelectOptions = ({ state, }: {
  state: [Date, Dispatch<React.SetStateAction<Date>>];
}) => {
  const options = ['Today', 'Yesterday', 'custom'] as const
  const [selectedDate, setSelectedDate] = state;

  const currentOption: typeof options[number] = isToday(selectedDate) ?
    'Today' : isYesterday(selectedDate) ? 'Yesterday' : 'custom'

  const handleOptionPressed = (label: typeof currentOption) => {
    const today = new Date()
    if (label === 'Today')
      return setSelectedDate(today)

    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (label === 'Yesterday')
      return setSelectedDate(yesterday)
  }
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full ">
      <View className="flex-row gap-4 items-center min-w-full ">
        {options.map((label, index) => {
          const isActive = label === currentOption

          return (label === 'custom' ?
            <DateSelect key={label} state={state}
              className={`px-5 py-4 rounded-2xl items-center flex justify-center flex-1 w-full text-lg border text-center ${isActive ? 'border-accent bg-accent/10 text-accent font-semibold' : 'text-muted border-muted-2'}`}
            />
            :
            <TouchableOpacity className='w-max' onPress={() => handleOptionPressed(label)}>
              <View
                className={`px-5 py-4 flex-1 rounded-2xl border ${isActive ? 'border-accent bg-accent/10' : 'border-muted-2'
                  }`}
              >
                <Text className={` text-lg text-center ${isActive ? 'text-accent font-semibold' : 'text-muted'}`}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
        )}
      </View>
    </ScrollView>

  );
};

export default DateSelectOptions;

