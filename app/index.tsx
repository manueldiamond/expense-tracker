import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Icon from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import IonIcons from '@expo/vector-icons/Ionicons'
import React, { Dispatch, ReactNode, useMemo, useState } from "react";
import PieChart from 'react-native-pie-chart'
import Card from "@/components/card";

const Greeter = () => {
  const profileName = "User"
  const openProfileModal = undefined;
  return (
    <View className="flex-row justify-between container">
      <View className="flex-row">
        <Text className="text-4xl text-head">Hello, </Text>
        <Text className="text-4xl font-bold text-head">{profileName}</Text>
      </View >
      <TouchableOpacity onPress={openProfileModal}>
        <View className="rounded-full border border-muted-2 justify-center items-center flex size-10">
          <FontAwesome name="user-o" size={16} className="color-muted" color={'#152144'} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const periods = ["All", "Daily", "Weekly", "Monthly"] as const
type periodType = typeof periods[number]
const PeriodSelect = ({ state }: {
  state: [periodType, Dispatch<React.SetStateAction<periodType>>]
}) => {
  const [value, setValue] = state
  const periods = ["All", "Daily", "Weekly", "Monthly"]

  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal className="min h-max w-full">
      <View className="gap-6 container flex-row h-max min-w-full ">
        {periods.map(period =>
          <TouchableOpacity key={period} onPress={() => setValue(period)}>
            <View className={`${period === value ? 'border-accent text-head opacity-100' : ' border-muted-2'} rounded-2xl border px-6 py-3`}>
              <Text className={period === value ? ' font-medium text-head' : 'text-muted/50'} >{period}</Text>
            </View>
          </TouchableOpacity>)}
      </View>
    </ScrollView >
  )
}


const StatsCard = ({ income = 0, spent = 0 }: {
  income: number,
  spent: number,
}) => {
  return (
    <View className="container">
      <Card className=" justify-between flex flex-row gap-8">
        <View className="justify-between flex-1">
          <View className="gap-0.5 ">
            <View className="flex-row items-center gap-2.5">
              <View className="w-2 h-[18px] rounded bg-accent" />
              <Text className="text-lg text-muted">Income</Text>
            </View>
            <Text className=" font-medium text-[28px] text-head">₵ {income}</Text>
          </View>

          <View className="gap-0.5 ">
            <View className="flex-row items-center gap-2.5">
              <View className="w-2 h-[18px] rounded bg-spent" />
              <Text className="text-lg text-muted">Spent</Text>
            </View>
            <Text className="font-medium text-[28px] text-head">₵ {spent}</Text>
          </View>

        </View>


        <View className="rotate-[90deg]">
          <PieChart
            widthAndHeight={128}
            series={[
              { value: income, color: '#b7d9ae' },
              { value: spent, color: '#ffb9aa' },
            ]}
            cover={0.45}
            padAngle={0.02}

          />
        </View>

      </Card>
    </View>
  )
}


const dateToTimeString = (date: Date) => date.toLocaleTimeString('en-US', { hour12: true, timeStyle: 'short' })
type TransactionType = {
  amount: number
  time: string,
  category: string,
  description: string;
}
const Transaction = ({ category, amount, time, description = "" }: TransactionType) => {
  const icon = "";
  const categoryColor = 'red';
  const timeString = useMemo(() => dateToTimeString(new Date(time)), [time])

  return (
    <View className="flex-row gpa-4">
      <View className="" style={{ backgroundColor: categoryColor }}>
        {/*CATEGORY_IMAGE*/}
      </View>
      <View>
        <View className="flex-row justify-space flex-1">
          <Text className="">{category}</Text>
          <Text className="">{amount}</Text>
        </View>
        <View className="flex-row justify-space flex-1">
          <Text className="" numberOfLines={1}>{description}</Text>
          <Text className="">{}</Text>
        </View>
      </View>
    </View>
  )
}
const RecentTransactions = ({ transactions }) => {
  const seeAllTransactions = undefined

  return (
    <View className="container">
      <View className="flex-row mb-3 justify-between w-full items-center">
        <Text className="text-muted text-xl">Recent Transactions</Text>
        <TouchableOpacity onPress={seeAllTransactions}>
          <View className="border rounded-full border-muted-2 gap-0.5 flex-row justify-center items-center px-4 py-2">
            <Text className="text-muted text-xl">See All</Text>
            <Icon name="chevron-right" color={'#687076'} size={18} />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {transactions.map(transaction => <Transaction {...transaction} />)}
      </View>
    </View>
  )
}
export default function page() {
  const periodState = useState<periodType>("All")
  return (
    <View className="flex flex-col gap-5 py-8">
      <Greeter />
      <PeriodSelect state={periodState} />
      <StatsCard spent={3620} income={8429} />
      <RecentTransactions
        transactions={[]}
      />
    </View>
  )
}  
