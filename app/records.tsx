import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Dimensions } from "react-native";
import { useCategories, useObjectState, useTransactions } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import tw from 'twrnc'
import TransactionItem from "@/components/transaction-item";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { colors, transactionPaymentTypeOptions, transactionTypeOptions } from "@/data";
import Animated, { BounceIn, BounceOut, FadeIn, ZoomIn, ZoomInUp, ZoomOut } from "react-native-reanimated";
import Card from "@/components/card";
import { DateSelect } from "@/components/date-selector";
import Select from "@/components/ui/select";
import { toOptions } from "@/utils";
import RadioOptions from "@/components/radio-options";
import { MainButton } from "@/components/ui/button";
import { Transaction, TransactionsFiltersType } from "@/types";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import StatsCard from "@/components/stats-card";

const Analytics = () => {
  <View >
  </View >
}


const FilterMenu = ({ onFilter, close }: { close: () => void; onFilter: (f: TransactionsFiltersType) => void }) => {

  const [filters, setFilters] = useObjectState<TransactionsFiltersType>({
  })

  const db = useSQLiteContext()
  const [cats] = useCategories(db)

  const categoryOptions = useMemo(() => [
    {
      value: '',
      label: (
        <View className="flex-row gap-2 items-center">
          <View
            style={tw`boreder border-dashed border-[${colors["muted-2"]}] rounded-xl size-8`}
          />
          <Text className="text-xl flex-1">None</Text>
        </View >)
    },
    ...(cats ? toOptions(
      cats,
      cat => cat.name,
      cat => (
        <View className="flex-row gap-2 items-center">
          <View style={{ backgroundColor: cat.color }} className="rounded-xl size-8 " />
          <Text className="text-xl flex-1">{cat.name}</Text>
        </View >)
    ) : [])
  ], [cats?.length])


  return (
    <>
      <View className={'flex-row text-center items-center w-full border-b  border-muted-2 relative'}>
        <TouchableOpacity onPress={close} className=" z-50 elevation-[60] flex flex-row gap-0.5 absolute left-0 px-4">
          <MaterialIcons name="chevron-left" size={20} />
          <Text className="text-base">Back</Text>
        </TouchableOpacity >
        )

        <Text className="text-xl font-semibold my-2 text-center flex-1">Filter Editor</Text>
      </View>

      <View className="gap-2  w-full">
        <View className="flex-row gap-1 w-full">
          {(['start', 'end'] as const).map((item) => {
            const value = filters[item]
            return (
              <View style={tw`flex-1 flex border overflow-hidden border-[${colors["muted-2"]}] rounded-2xl pt-2`}>
                <Text className="text-muted-2 text-start text-sm px-2">{item} date</Text>
                <DateSelect
                  state={[value, (date) => setFilters({ [item]: date })]}
                  style={tw`bg-[#00000005] rounded-xl py-1 px-2 items-start text-[${colors[value ? 'head' : 'muted']}] justify-center text-start`}
                />
              </View>
            )
          })}
        </View>

        <View className="flex-row w-full gap-2">
          {(['min', 'max'] as const).map(item =>
            <View className="flex-1 flex border border-muted-2 rounded-2xl py-2 px-2">
              <Text className="text-muted-2 text-start text-sm ">{item} amount</Text>
              <View className="flex-row items-center justify-center">
                <Text className="text-head text-xl ml-4">₵</Text>
                <TextInput
                  value={String(filters[`${item}amount`] ?? 0)}
                  onChangeText={amtText => setFilters({
                    [item + 'amount']: amtText.replace(/[^0-9.]/g, "")
                  })}
                  keyboardType="numeric"
                  className="py-0 my-0 w-full text-head text-xl"
                  placeholder="0.00"
                />
              </View>
            </View >
          )}
        </View>

        <Card label="Category" className="flex flex-col !py-2">
          {categoryOptions &&
            <Select
              items={categoryOptions}
              state={[filters.category, cat => setFilters({ category: cat })]}
            />}
        </Card>

        <Text className="text-lg text-head pt-2">Transaction Type</Text>
        <RadioOptions
          items={transactionTypeOptions}
          state={[filters.type, type => setFilters({ type })]}
          className="w-full flex-row "
          itemClassName="flex-1"
        />
        <RadioOptions
          items={transactionPaymentTypeOptions}
          state={[filters.ptype, ptype => setFilters({ ptype })]}
          className="w-full flex-row "
          itemClassName="flex-1"
        />


      </View>

      <MainButton text="Filter" className="mt-6 w-full rounded-2xl" onPress={() => onFilter(filters)} />
    </>
  )
}


const TransactionsPage = () => {

  const db = useSQLiteContext()

  const [showingFiltersModal, setShowFilterModal] = useState(false)
  const [activeFilters, setActiveFilters] = useObjectState<TransactionsFiltersType>({})
  const { transactions, income, spent, revalidateTransactions } = useTransactions(db, activeFilters);

  const handleFilter = (filters: TransactionsFiltersType) => {
    setActiveFilters({
      ...filters,
      maxamount: Number(filters.maxamount) || undefined,
      minamount: Number(filters.minamount) || undefined,
    })

    setShowFilterModal(false)
    revalidateTransactions()
  }


  const statsProps = useMemo(() => generateStatsCardText(activeFilters, income, spent), [activeFilters, income, spent])
  const catsStatStuff = transactions && groupTransactionsByCategory(transactions?.filter(t => !!t))
  const pTypeStatStuff = transactions && groupTransactionCountsByPaymentType(transactions?.filter(t => !!t))
  return (
    <View className="bg-white container min-h-screen px-4 py-6">
      <FlatList
        data={transactions}
        scrollEnabled
        keyExtractor={(t) => `${(t && t.id)}`}
        ListFooterComponent={
          <View className=" my-10 gap-4">
            <Text className="text-lg text-muted ">Summary Statistics</Text>
            <StatsCard
              income={income}
              spent={spent}
              {...statsProps}
            />

            <StatsCard
              title="PaymentTypes"
              items={pTypeStatStuff}
            />

            {!activeFilters.category && <StatsCard
              title="Categories"
              items={catsStatStuff}
            />}
          </View>
        }
        ListHeaderComponent={
          <View>
            <View className="flex gap-2 flex-row justify-between mb-5">
              <View style={tw`h-auto border-[${colors["muted-2"]}]  border justify-between min-w-full gap-1 items-center rounded-2xl p-1 `}>
                <TouchableOpacity onPress={() => setShowFilterModal(true)} className="flex flex-col w-full">
                  <View
                    style={
                      tw.style(
                        Object.values(activeFilters).filter(v => !!v).length > 0 && 'border-b',
                        tw` border-[${colors["muted-2"]}] w-full flex-row gap-1 justify-center items-center py-2 `
                      )}
                  >
                    <MaterialCommunityIcons className='' name="filter" size={20} color={colors["muted-2"]} />
                    <Text className="text-muted text-xl">Select Filters</Text>
                  </View>
                </TouchableOpacity>
                <View style={tw`flex-row flex-wrap gap-1 min-h-max `}>
                  {Object.entries(activeFilters).map(([key, value], id) => !!value &&
                    <Animated.View
                      key={key}
                      entering={ZoomIn.delay((1 + id) * 100).duration(200)}
                      exiting={!showingFiltersModal ? ZoomOut : undefined}
                    >
                      <TouchableOpacity
                        style={tw`relative border-[${colors["muted-2"]}] border flex-row  gap-1 justify-center items-center rounded-full py-1 px-2 min-w-max`}
                        onPress={() => setActiveFilters({ [key]: undefined })}
                      >
                        <Text className="text-muted">
                          {key.includes('amount') ? key.replace('amount', '') + ": ₵" : ''}
                          {value instanceof Date ?
                            key + ": " + format(value, 'MMM d, yyyy') :
                            value
                          }</Text>

                        <View
                          style={tw`absolute right-[4px] top-[3px]`}
                        >
                          <MaterialIcons
                            name="close"
                            size={10}
                            color={colors["muted-2"]}
                          />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            </View >
          </View >
        }
        renderItem={({ item: transaction }) =>
          transaction &&
          <TransactionItem
            {...transaction}
            onCategoryPressed={cat => setActiveFilters({ category: cat })}
            controlsEnabled
          />
        }
        contentContainerStyle={{ gap: 5, paddingBottom: 200 }}
      />
      <Modal
        visible={showingFiltersModal}
        transparent
        animationType="slide"
      >
        <LinearGradient
          style={[tw`w-[${Dimensions.get('screen').width}] h-[${Dimensions.get('screen').height}] absolute top-0 left-0`,]}
          colors={['rgba(0,0,0,0.5)', '#000000']}
        />
        <KeyboardAvoidingView style={tw`min-h-full`} className="container">
          <View style={tw`h-auto mt-auto border-[${colors["muted-2"]}] border justify-between min-w-full gap-2 items-center rounded-3xl p-2 bg-white mb-4`}>
            <FilterMenu close={() => setShowFilterModal(false)} onFilter={handleFilter} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View >
  );
};

export default TransactionsPage;


function generateStatsCardText(
  filters: TransactionsFiltersType,
  income: number,
  spent: number
) {
  const { category, type, ptype, minamount, maxamount, start, end } = filters
  const isGain = income > spent
  const isLoss = income < spent
  const hasData = income || spent

  // 🔤 Short title
  let title = "transactions"
  if (category) title = `${category} ${title}`

  if (ptype) title = `${ptype} ${title}`
  if (type) title = `${type} ${title}`

  title = title[0].toUpperCase() + title.slice(1)

  // 📅 Format dates
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  let periodText = "this period"
  if (start && end) {
    const s = new Date(start)
    const e = new Date(end)
    periodText =
      s.toDateString() === e.toDateString()
        ? `on ${formatDate(s)}`
        : `from ${formatDate(s)} to ${formatDate(e)}`
  }

  // 💰 Amount range
  let amountRange = ""
  if (minamount && maxamount && minamount !== 0 && maxamount !== Infinity)
    amountRange = `between ₵${minamount} - ₵${maxamount}`
  else if (minamount && minamount !== 0)
    amountRange = `over ₵${minamount}`
  else if (maxamount && maxamount !== Infinity)
    amountRange = `below ₵${maxamount}`

  // 🧠 Top text
  let topText: React.ReactNode = undefined
  if (hasData) {
    const diff = Math.abs(income - spent)
    topText = (
      <>
        You've {isGain ? 'gained' : 'lost'}{' '}
        <Text className={isGain ? 'text-accent' : 'text-spent'}>₵{diff}</Text>{' '}
        {periodText}{amountRange ? ` (${amountRange})` : ''}
      </>
    )
  }

  return { title, topText }
}


type StatItem = {
  label: string;
  amount: number;
  color?: string;
  format?: (val: number) => string;
}

export const paymentTypeColors: Record<string, string> = {
  "momo": "#FFB74D",
  "cash": "#4FC3F7",
  "Bank": "#81C784",//All vibe's
  "Card": "#BA68C8",
}


export function groupTransactionsByCategory(transactions: Transaction[]): StatItem[] {
  const grouped: Record<string, { total: number, color: string }> = {}

  transactions.forEach(t => {
    if (typeof t.category === "object") {
      const key = t.category?.name || t.category as string
      if (!grouped[key]) {
        grouped[key] = { total: 0, color: t.category?.color || colors["muted-2"] }
      }
      grouped[key].total += Math.abs(t.amount)
    }
  })

  return Object.entries(grouped).map(([label, { total, color }]) => ({
    label,
    amount: total,
    color,
    format: (val) => `₵ ${val.toFixed(2)}`
  }))
}

export function groupTransactionCountsByPaymentType(transactions: Transaction[]): StatItem[] {
  const grouped: Record<string, number> = {}

  transactions.forEach(t => {
    const key = t.paymentType ?? "Unknown"
    grouped[key] = (grouped[key] || 0) + 1
  })

  return Object.entries(grouped).map(([label, count]) => ({
    label,
    amount: count,
    color: paymentTypeColors[label] ?? "#E0E0E0",
    format: (val) => `${val} txn${val !== 1 ? "s" : ""}`
  }))
}
