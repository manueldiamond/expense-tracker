import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import Icon from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { Dispatch, useState } from "react";
import { PieChart, PieChartPro } from 'react-native-gifted-charts'
import Card from "@/components/card";
import { useTransactions, useUserData } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { Link, useRouter, } from "expo-router";
import { getDateFromPeriod, getStartOfMonth, getStartOfWeek, getStartOfYear, rarr } from "@/utils";
import { periods, periodType, Transaction } from "@/types";
import { bottomTextS, colors } from "@/data";
import TransactionItem from "@/components/transaction-item";
import { weeksToDays } from "date-fns";
import StatsCard from "@/components/stats-card";

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


const RecentTransactions = ({ transactions }: { transactions?: (Transaction | null)[] }) => {
  const router = useRouter()
  return (
    <View className="container">
      <View className="flex-row mb-3 justify-between w-full items-center">
        <Text className="text-muted text-xl">Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/records')} >
          <View className="border rounded-full border-muted-2 gap-0.5 flex-row justify-center items-center px-4 py-2">
            <Text className="text-muted text-xl">See All</Text>
            <Icon name="chevron-right" color={'#687076'} size={18} />
          </View>
        </TouchableOpacity>
      </View>

      <View className="gap-4 mb-10">
        {transactions ? transactions.map((transaction) => (
          transaction && transaction.id && <TransactionItem key={transaction.id} {...transaction} />
        )) :
          <Text className="text-lg flex items-center justify-center gap-2"><Icon name="notifications-none" color={colors["muted-2"]} /> No Transactions yet</Text>}
      </View>
    </View >
  )
}


export default function page() {
  const db = useSQLiteContext()

  const periodState = useState<periodType>("Today")
  const [period] = periodState

  const startDate = getDateFromPeriod(period)
  const { transactions, income, spent } = useTransactions(db, startDate, 5);

  return (
    <ScrollView scrollsToTop scrollEventThrottle={100} className="h-screen bg-white">
      <View className=" flex flex-col gap-5 pt-8 pb-36">
        <Greeter />
        <PeriodSelect state={periodState} />

        <StatsCard spent={spent} income={income} period={period} showBottomText />

        <RecentTransactions transactions={transactions} />
      </View>
    </ScrollView>
  )
}  
