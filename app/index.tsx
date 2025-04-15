import { Button, ScrollView, Text, TouchableOpacity, useAnimatedValue, View } from "react-native"
import tw from 'twrnc'
import Icon from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { Dispatch, useState, useEffect, useRef } from "react";
import { useTransactions, useUserData } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { Link, useRouter, } from "expo-router";
import { getDateFromPeriod, getStartOfMonth, getStartOfWeek, getStartOfYear, rarr } from "@/utils";
import { periods, periodType, Transaction } from "@/types";
import { bottomTextS, colors } from "@/data";
import TransactionItem from "@/components/transaction-item";
import StatsCard from "@/components/stats-card";
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
  Easing,
  FadeInLeft,
  ZoomInRotate,
  useEvent,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AddTransation = () => {
  const pressed = useSharedValue(false);
  const style = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(pressed.value ? 0.78 : 1.0, {
        duration: 90,
        easing: Easing.inOut(Easing.cubic),
      })
    }]
  }));
  return (
    <Animated.View
      style={[style, tw`absolute right-4 bottom-16 justify-center flex-row absolute`]}
    >
      {/*ADD BUTTON*/}
      <Link
        onPressIn={() => (pressed.value = true)}
        onPressOut={() => (pressed.value = false)}
        href={'/add-transaction'}
      >
        <View
          style={[{
            backgroundColor: '#fff',
            zIndex: 9999,
            shadowOpacity: 1,
            shadowRadius: 8,
            shadowOffset: { width: 2, height: 4 },
            borderRadius: 999,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }, tw`size-[20] elevation-6`]}
        >
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className="w-full absolute h-full left-0 top-0"
          />
          <Icon name="add" size={40} color={'#fff'} />
        </View>
      </Link>
    </Animated.View >
  )
}
const Greeter = () => {
  const sqlite = useSQLiteContext()
  const { user } = useUserData(sqlite)
  const profileName = user?.name

  return (
    <Animated.View
      className="flex-row justify-between container"
      entering={FadeInDown.duration(800)}
    >
      <View className="flex-row">
        <Text className="text-4xl text-head">Hello, </Text>
        <Text className="text-4xl font-bold text-head">{profileName}</Text>
      </View >
      <Link href='/user'>
        <Animated.View
          className="rounded-full border border-muted-2 justify-center items-center flex size-10"
          entering={FadeIn.delay(300).duration(500)}
        >
          <FontAwesome name="user-o" size={16} className="color-muted" color={'#152144'} />
        </Animated.View>
      </Link>
    </Animated.View>
  )
}

const PeriodSelect = ({ state }: {
  state: [periodType, Dispatch<React.SetStateAction<periodType>>]
}) => {
  const [value, setValue] = state

  // Scale animation for period selection
  const handlePeriodChange = (period: periodType) => {
    setValue(period);
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal className="min h-max w-full">
      <View className="gap-6 container flex-row h-max min-w-full ">
        {periods.map((period, index) => (
          <Animated.View
            key={period}
            entering={FadeInDown.delay(100 + index * 50).duration(400)}
            layout={LinearTransition}
          >
            <AnimatedTouchableOpacity
              onPress={() => handlePeriodChange(period)}
            >
              <View
                className={`px-5 py-3 rounded-2xl border ${period === value ? 'border-accent bg-accent/10' : 'border-muted-2'}`}
              >
                <Text className={period === value ? ' font-medium text-head' : 'text-muted/50'} >{period}</Text>
              </View>
            </AnimatedTouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView >
  )
}

const RecentTransactions = ({ transactions }: { transactions?: (Transaction | null)[] }) => {
  const router = useRouter()

  return (
    <Animated.View
      className="container"
      entering={FadeInDown.delay(300).duration(500)}
    >
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
        {transactions && transactions?.length > 0 ? transactions.map((transaction, index) => (
          transaction && transaction.id && (
            <Animated.View
              key={transaction.id}

              entering={FadeInLeft.delay(400 + index * 100).duration(400)}
            >
              <TransactionItem {...transaction} />
            </Animated.View>
          )
        )) : (
          <Animated.View entering={FadeIn.delay(500).duration(400)}>
            <Text className="text-lg flex items-center justify-center gap-2">
              <Icon name="notifications-none" color={colors["muted-2"]} /> No Transactions yet
            </Text>
          </Animated.View>
        )}
      </View>
    </Animated.View >
  )
}


export default function page() {
  const db = useSQLiteContext()

  const periodState = useState<periodType>("Today")
  const [period] = periodState

  const startDate = getDateFromPeriod(period)
  const { transactions, income, spent } = useTransactions(db, { start: startDate }, 10);

  const hasNoData = !income && !spent
  const isLoss = income < spent
  const isGain = income > spent

  const topText =
    (income || spent) ?
      <>
        You've {isGain ? 'gained' : 'lost'} <Text className={isGain ? 'text-accent' : 'text-spent'}>₵{Math.abs(income - spent)}</Text> {period === 'Today'
          ? 'Today' : period === 'Weekly'
            ? 'this Week' : period === 'Monthly'
              ? 'this Month' : period === 'Yearly'
                ? 'this Year' : 'in Total'}
      </> : undefined


  const bottomText = (period !== 'All' && period !== 'Yearly') && hasNoData
    ? rarr(bottomTextS.nan)
    : isGain
      ? rarr(bottomTextS.afterGains)
      : isLoss
        ? rarr(bottomTextS.afterLosses)
        : undefined


  return (

    <View>
      <ScrollView scrollsToTop scrollEventThrottle={100} className="h-screen bg-white">
        <Animated.View className="flex flex-col gap-5 pt-8 pb-36">
          <Greeter />
          <PeriodSelect state={periodState} />

          <Animated.View
            entering={FadeInDown.delay(200).duration(700)}
            className={'container'}
          >
            <StatsCard
              title={period}
              income={income}
              spent={spent}
              topText={topText}
              bottomText={bottomText}
            />
          </Animated.View>

          <RecentTransactions transactions={transactions} />
        </Animated.View>

      </ScrollView>
      <AddTransation />
    </View >
  )
}  
