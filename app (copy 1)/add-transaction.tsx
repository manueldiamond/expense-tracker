import { Alert, KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Card from "@/components/card";
import { useCategories, useObjectState, useSqliteGet } from "@/hooks";
import { Stack, useRouter } from "expo-router";
import Select from "@/components/ui/select";
import { useSQLiteContext } from "expo-sqlite";
import { ExternalState, Option, Transaction, TransactionCategory } from "@/types";
import { toOptions } from "@/utils";
import { colors, transactionTypeOptions } from "@/data";
import { useEffect, useMemo } from "react";
import RadioOptions from "@/components/radio-options";
import BackButton from "@/components/back-button";
import { useToast } from 'expo-toast'
import { LinearGradient } from "expo-linear-gradient";
import { useRevalidator } from "@/context/revalidator";

export default function AddTrans() {
  const router = useRouter()
  const closeModal = () => router.back()
  const { show: showToast } = useToast()

  const [data, setData] = useObjectState({ amount: "", category: "Misc", type: "income" });

  const categoryState: ExternalState<string> = [data.category, (category: string) => setData({ category })]
  const typeState: ExternalState<string> = [data.type, (type: string) => setData({ type })]

  const db = useSQLiteContext()
  const [cats] = useCategories(db)

  const categoryOptions = useMemo(() => cats && toOptions(
    cats,
    cat => cat.name,
    cat => (
      <View className="flex-row gap-2 items-center">
        <View style={{ backgroundColor: cat.color }} className="rounded-xl size-8 " />
        <Text className="text-xl flex-1">{cat.name}</Text>
      </View >)
  ), [cats?.length])

  const typeOptions = useMemo(() => toOptions(
    transactionTypeOptions,
    type => type,
    type => type[0].toUpperCase() + type.slice(1)
  ), [])

  const revalidate = useRevalidator()
  useEffect(() => {
    setData({
      type: cats?.find(
        cat => cat.name === data.category)?.type
    })
  }, [data.category])

  const addTransaction = async () => {
    let msg;
    const amount = parseFloat(data.amount);
    if (!amount || amount < 0)
      msg = "Please enter a valid Amount"
    else if (!data.type)
      msg = "Please specify a Transaction Type"

    if (msg) {
      Alert.alert(msg)
      return;
    }

    const trans = {
      $category: data.category,
      $amount: amount * (data.type === 'expense' ? -1 : 1)
    }
    await db.runAsync(`
      INSERT INTO transactions(amount,category) VALUES($amount,$category)
    `, trans);

    revalidate("transactions")

    showToast("Successfully added new " + "₵" + data.amount + " " + data.type,);
    closeModal()
  }

  return (

    <KeyboardAvoidingView className="bg-accent">
      <View className="justify-between bg-white rounded-t-3xl h-full container py-8">
        <View>
          {/*ADD TRANSACTION HEADER*/}
          <View className="pb-6 flex-row flex items-center w-full justify-center">
            <BackButton className="absolute left-0 " />
            <Text className="text-xl text-head w-max p-0">Add Transaction</Text>
          </View>
          <View className="gap-2">
            <Card label="Amount" className="py-3.5">
              <View className="flex-row items-center justify-center">
                <Text className="text-head text-xl ml-4">₵</Text>
                <TextInput
                  value={data.amount}
                  onChangeText={amtText => setData({ amount: amtText.replace(/[^0-9.]/g, "") })}
                  keyboardType="numeric"
                  className="py-0 my-0 w-full text-head text-xl"
                  placeholder="0.00"
                />
              </View>
            </Card>
            <Card label="Category" className="py-3.5 gap-4 flex flex-col">
              {categoryOptions && <Select
                items={categoryOptions}
                state={categoryState}
              />}
            </Card>
            <Text className="text-head"></Text>
          </View>


          <Text className="text-xl text-head py-4">Transaction Type</Text>
          <RadioOptions
            items={typeOptions}
            state={typeState}
            className="w-full flex-row "
            itemClassName="flex-1"
          />

        </View>

        <TouchableOpacity className='overflow-hidden bg-accent relative items-center justify-center rounded-[28px] px-6 py-6' onPress={addTransaction}>
          {/*
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className=" absolute left-0 top-0 flex-1"
          />
          */}
          <Text className="text-xl text-white font-medium ">Add</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView >

  )

}
