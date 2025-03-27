import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import Icon from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { Dispatch, useState } from "react";
import PieChart from 'react-native-pie-chart'
import Card from "@/components/card";
import { useTransactions, useUserData } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { Link, } from "expo-router";
import { getStartOfMonth, getStartOfWeek, getStartOfYear } from "@/utils";
import { Transaction } from "@/types";
import { colors } from "@/data";
import TransactionItem from "@/components/transaction-item";

const Greeter = () => {
  const sqlite = useSQLiteContext()
  const { user } = useUserData(sqlite)
  const profileName = user?.name
  return (
    <View className="flex-row justify-between container">
      <View className="flex-row">
        <Text className="text-4xl text-head">Hello, </Text>
        <Text className="text-4xl font-bold text-head">{profileName}</Text>
      </View >
      <Link href='/user'>
        <View className="rounded-full border border-muted-2 justify-center items-center flex size-10">
          <FontAwesome name="user-o" size={16} className="color-muted" color={'#152144'} />
        </View>
      </Link>
    </View>
  )
}

const periods = ["All", "Today", "Weekly", "Monthly", "Yearly"] as const
type periodType = typeof periods[number]
const PeriodSelect = ({ state }: {
  state: [periodType, Dispatch<React.SetStateAction<periodType>>]
}) => {
  const [value, setValue] = state

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


const StatsCard = ({ period, income = 0, spent = 0 }: {
  income: number,
  spent: number,
  period: periodType,
}) => {
  return (
    <View className="container">
      <Card>
        <View className=" justify-between flex flex-row gap-8">
          <View className="justify-between flex-1">
            <View className="gap-0.5 ">
              <View className="flex-row items-center gap-2.5">
                <View className="w-2 h-[18px] rounded bg-accent" />
                <Text className="text-lg text-muted">Income</Text>
              </View>
              <Text className=" font-medium text-[24px] text-head">₵ {income}</Text>
            </View>

            <View className="gap-0.5 ">
              <View className="flex-row items-center gap-2.5">
                <View className="w-2 h-[18px] rounded bg-spent" />
                <Text className="text-lg text-muted">Spent</Text>
              </View>
              <Text className="font-medium text-[24px] text-head">₵ {spent}</Text>
            </View>

          </View>

          {(income || spent) ? <View className="rotate-[90deg]">
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
            :
            <View className="border-muted-2/30 border border-[35px] rounded-full size-[128px] items-center justify-center">
              <Text className=" text-sm text-muted-2 my-0 text-center">Noting Yet!</Text>
            </View>
          }
        </View>

        {income || spent ?

          <Text className="mt-2 text-lg text-muted-2 w-full text-center">
            You've {income > spent ? 'gained' : 'lost'}
            <Text className={(income > spent ? 'text-accent' : 'text-spent') + " font-medium text-lg"} > ₵{Math.abs(income - spent)} </Text>
            {period === 'Today' ? 'Today'
              : period === 'Weekly' ? 'this Week'
                : period === 'Yearly' ? 'this Year'
                  : period === 'Monthly' ? 'this Month'
                    : 'in Total'
            }</Text>

          :
          <>
            <Text className="mt-2 text-lg text-muted-2 w-full text-center">Get to work, No food for lazy man</Text>
          </>
        }

      </Card>
    </View >
  )
}



const RecentTransactions = ({ transactions }: { transactions?: (Transaction | null)[] }) => {
  return (
    <View className="container">
      <View className="flex-row mb-3 justify-between w-full items-center">
        <Text className="text-muted text-xl">Recent Transactions</Text>
        <Link href={'/records'}>
          <View className="border rounded-full border-muted-2 gap-0.5 flex-row justify-center items-center px-4 py-2">
            <Text className="text-muted text-xl">See All</Text>
            <Icon name="chevron-right" color={'#687076'} size={18} />
          </View>
        </Link>
      </View>

      <View className="gap-4">
        {transactions ? transactions.map((transaction) => (
          transaction && transaction.id && <TransactionItem key={transaction.id} {...transaction} />
        )) :
          <Text className="text-lg flex items-center justify-center gap-2"><Icon name="notifications-none" color={colors["muted-2"]} /> No Transactions yet</Text>}
      </View>

    </View>
  )
}

export default function page() {
  const periodState = useState<periodType>("Today")
  const [period] = periodState
  const db = useSQLiteContext()
  const startDate = period === 'Today' ? new Date()
    : period === 'Weekly' ?
      getStartOfWeek()
      : period === 'Monthly' ?
        getStartOfMonth()
        : period === 'Yearly' ?
          getStartOfYear()
          : new Date(1995, 0, 1)


  const { transactions, income, spent } = useTransactions(db, startDate, 5);

  return (
    <ScrollView scrollsToTop scrollEventThrottle={100} className="h-screen bg-white">
      <View className=" flex flex-col gap-5 pt-8 pb-36">

        <Greeter />
        <PeriodSelect state={periodState} />

        <StatsCard spent={spent} income={income} period={period} />
        <RecentTransactions
          transactions={transactions}
        />
      </View>
    </ScrollView>
  )
}  
