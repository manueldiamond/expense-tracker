import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useCategories, useObjectState, useTransactions } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import BackButton from "@/components/back-button";
import TransactionItem from "@/components/transaction-item";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { colors, transactionPaymentTypeOptions, transactionTypeOptions } from "@/data";
import Animated, { BounceIn, BounceOut, FadeIn, ZoomIn, ZoomInUp, ZoomOut } from "react-native-reanimated";
import Card from "@/components/card";
import DateSelectOptions, { DateSelect } from "@/components/date-selector";
import Select from "@/components/ui/select";
import { toOptions } from "@/utils";
import RadioOptions from "@/components/radio-options";
import { MainButton } from "@/components/ui/button";
import { Option, TransactionsFiltersType } from "@/types";
import { format } from "date-fns";

const Analytics = () => {
  <View >
  </View >
}


const FilterMenu = ({ onFilter, close }: { close: () => void; onFilter: (f: TransactionsFiltersType) => void }) => {

  const [filters, setFilters] = useObjectState<TransactionsFiltersType>({
    start: new Date(1995, 0, 1),
    end: new Date(),
    category: '',
  })

  const db = useSQLiteContext()
  const [cats] = useCategories(db)

  const categoryOptions = useMemo(() => [
    {
      value: '',
      label: (
        <View className="flex-row gap-2 items-center">
          <View style={{ backgroundColor: 'black' }} className="rounded-xl size-8 " />
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
          <Text>Back</Text>
        </TouchableOpacity >
        )

        <Text className="text-xl font-semibold my-2 text-center flex-1">Filter Editor</Text>
      </View>

      <View className="gap-2  w-full">
        <View className="flex-row gap-1 w-full">
          {['start', 'end'].map(item =>
            <View className=" flex-1 border border-muted-2 rounded-2xl h-max">
              <Text className="text-muted-2 pl-4 text-sm ">{item} date</Text>
              <DateSelect
                state={[filters[item], (date) => setFilters({ [item]: date })]} className={`rounded-full flex-1 px-3 py-1 text-lg text-muted h-max text-center`}
              />
            </View>
          )}
        </View>

        <View className="flex-row w-full gap-2">
          {(['min', 'max'] as const).map(item =>
            <Card label={item + ' amount'} className="flex-1 !py-2">
              <View className="flex-row items-center justify-center">
                <Text className="text-head text-xl ml-4">₵</Text>
                <TextInput
                  value={filters[item + 'amount']}
                  onChangeText={amtText => setFilters({
                    [item + 'amount']: amtText.replace(/[^0-9.]/g, "")
                  })}
                  keyboardType="numeric"
                  className="py-0 my-0 w-full text-head text-xl"
                  placeholder="0.00"
                />
              </View>
            </Card>
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
  const { transactions, revalidateTransactions } = useTransactions(db, activeFilters);
  const handleFilter = (filters: TransactionsFiltersType) => {
    setActiveFilters(filters)
    setShowFilterModal(false)
    revalidateTransactions()
  }

  return (
    <View className="bg-white container min-h-screen px-4 py-6">
      <FlatList
        data={!showingFiltersModal ? transactions : []}
        scrollEnabled
        keyExtractor={(t) => `${(t && t.id)}`}
        ListHeaderComponent={
          <View>
            <View className="flex gap-2 flex-row justify-between mb-5">
              <View className={`transition-all h-auto border-muted-2 border justify-between min-w-full gap-1 items-center rounded-3xl p-1 `}>
                {!showingFiltersModal ?
                  <>
                    <TouchableOpacity onPress={() => setShowFilterModal(true)} className="flex flex-col w-full">
                      <View className={`
                      ${Object.values(activeFilters).filter(v => !!v).length > 0 && 'border-b'}
                      border-b-muted-2 w-full flex-row gap-1 justify-center items-center
                    ` }>
                        <MaterialCommunityIcons className='' name="filter" size={20} color={colors["muted-2"]} />
                        <Text className="text-muted text-lg">Select Filters</Text>
                      </View>
                    </TouchableOpacity>
                    <View className="flex-row flex-wrap gap-1 h-max">
                      {Object.entries(activeFilters).map(([key, value], id) => !!value &&
                        <Animated.View
                          key={key}
                          entering={ZoomIn.delay((1 + id) * 100).duration(200)}
                          exiting={!showingFiltersModal && ZoomOut}
                        >
                          <TouchableOpacity
                            className=" flex-1 relative border-muted-2 border flex-row  gap-1 justify-center items-center rounded-full px-[10px] min-w-max min-h-[24px]"
                            onPress={() => setActiveFilters({ [key]: undefined })}
                          >
                            <Text className="text-muted">
                              {key.includes('amount') ? key.replace('amount', '') + ": ₵" : ''}
                              {value instanceof Date ?
                                key + ": " + format(value, ' d-M-yy') :
                                value
                              }</Text>

                            <View
                              className='absolute right-[4px] top-[3px]'
                            >
                              <MaterialIcons
                                name="close"
                                size={8}
                                color={colors["muted-2"]}
                              />
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </View>
                  </>
                  :
                  <FilterMenu close={() => setShowFilterModal(false)} onFilter={handleFilter} />
                }
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
    </View >
  );
};

export default TransactionsPage;
