//Vibess.... 
import React, { Dispatch, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform, StyleProp, TextStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { isToday, isYesterday, format } from "date-fns";
import tw, { ClassInput } from 'twrnc'
import { colors } from "@/data";

type PeriodOption = 'Today' | 'Yesterday' | 'Date';

const basePeriods: PeriodOption[] = ['Today', 'Yesterday', 'Date'];



export const DateSelect = ({ state, style, }: {
  style?: ClassInput,
  state: [Date | undefined, Dispatch<React.SetStateAction<Date>>];
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
        <Text style={tw.style('text-lg', style)}>
          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'select date'}
        </Text>
      </TouchableOpacity>
      {showPicker &&
        <DateTimePicker
          mode="date"
          value={selectedDate || new Date()}
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
            <DateSelect key={label} state={[isActive && selectedDate, setSelectedDate]}
              style={tw.style(
                `px-5 py-4 rounded-2xl items-center flex justify-center flex-1 w-full text-lg border text-center`,
                isActive ?
                  `border-[${colors.accent}] bg-[${colors["accent-dark"]}1A] text-[${colors.accent}] font-semibold`
                  :
                  `text-[${colors.muted}] border-[${colors["muted-2"]}]`
              )}
            />
            :
            <TouchableOpacity className='w-max' onPress={() => handleOptionPressed(label)}>
              <View
                className={`px-5 py-4 flex-1 flex justify-center items-center rounded-2xl border ${isActive ? 'border-accent bg-accent/10' : 'border-muted-2'
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
      </View >
    </ScrollView >

  );
};

export default DateSelectOptions;

