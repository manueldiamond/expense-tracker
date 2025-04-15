import { Alert, KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Card from "@/components/card";
import { useCategories, useObjectState, useSqliteGet } from "@/hooks";
import { Stack, useRouter } from "expo-router";
import Select from "@/components/ui/select";
import { useSQLiteContext } from "expo-sqlite";
import { ExternalState, Option, Transaction, TransactionCategory } from "@/types";
import { toOptions } from "@/utils";
import { colors, transactionPaymentTypeOptions, transactionTypeOptions } from "@/data";
import { useEffect, useMemo } from "react";
import RadioOptions from "@/components/radio-options";
import BackButton from "@/components/back-button";
import { useToast } from 'expo-toast'
import { LinearGradient } from "expo-linear-gradient";
import { useRevalidator } from "@/context/revalidator";
import DateSelect from "@/components/date-selector";
import { MainButton as AccentButton, } from "@/components/ui/button";

export default function AddTrans() {
  const router = useRouter()
  const closeModal = () => router.back()
  const { show: showToast } = useToast()

  const [data, setData] = useObjectState({
    amount: "",
    date: new Date(),
    type: "income",
    category: "Misc",
    paymentType: "momo"
  });

  const categoryState: ExternalState<string> = [data.category, (category: string) => setData({ category })]
  const typeState: ExternalState<string> = [data.type, (type: string) => setData({ type })]
  const paymentTypeState: ExternalState<string> = [data.paymentType, (paymentType: string) => setData({ paymentType })]
  const dateState: ExternalState<Date> = [data.date, (date: Date) => setData({ date })]

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
    const date = data.date
    try {
      if (!amount || amount < 0)
        msg = "Please enter a valid Amount"
      else if (!data.type)
        msg = "Please specify a Transaction Type"
      else if (date > new Date())
        msg = "Invalid Date"

      if (msg) throw new Error(msg)
      const trans = {
        $category: data.category,
        $amount: amount * (data.type === 'expense' ? -1 : 1),
        $ptype: data.paymentType,
        $date: date.toISOString(),
      }
      await db.runAsync(`
      INSERT INTO transactions(amount,category,payment_type,time) VALUES($amount,$category,$ptype,$date) `, trans);

      revalidate("transactions")

      showToast(`Successfully added new ₵${data.amount} ${data.paymentType} ${data.type}`);
      closeModal()
    } catch (e) {
      console.log(e)
      Alert.alert(msg || "Please try again later")

    } finally {
      revalidate("transactions")
    }
  }

  return (

    <KeyboardAvoidingView className="bg-accent">
      <ScrollView >
        <View className="justify-between bg-white rounded-t-3xl min-h-screen container py-8">
          <View>
            {/*ADD TRANSACTION HEADER*/}
            <View className=" flex-row flex items-center w-full justify-center">
              <BackButton className="absolute left-0 " />
              <Text className="text-xl text-head w-max p-0">Add Transaction</Text>
            </View>
            <View className="gap-2 mt-6">
              <DateSelect state={dateState} />
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
                {categoryOptions &&
                  <Select
                    items={categoryOptions}
                    state={categoryState}
                  />}
              </Card>
              <Text className="text-head"></Text>
            </View>


            <Text className="text-base text-head py-1">Transaction Type</Text>
            <RadioOptions
              items={transactionTypeOptions}
              state={typeState}
              className="w-full flex-row "
              itemClassName="flex-1"
            />


            <Text className="text-base text-head py-1">Payment Method</Text>
            <RadioOptions
              items={transactionPaymentTypeOptions}
              className="w-full flex-row "
              state={paymentTypeState}
              itemClassName="flex-1"
            />

          </View>
          <AccentButton text='Add' onPress={addTransaction} className="mt-2" />
        </View>
      </ScrollView>

    </KeyboardAvoidingView >

  )

}
