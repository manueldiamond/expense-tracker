import { colors } from "@/data";
import { Transaction } from "@/types";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons/'
import { useSQLiteContext } from "expo-sqlite";
import { useRevalidator } from "@/context/revalidator";
import Controls from "./controls";
import { formaFancyDate } from "@/utils";


const TransactionItem = ({ paymentType, category, amount, time, id, controlsEnabled, onCategoryPressed }: Transaction & { controlsEnabled?: boolean, onCategoryPressed?: (cat: string) => void }) => {
  const icon = "";
  const categoryColor = (category && typeof category === 'object') ? category.color : colors["muted-2"];
  const timeString = useMemo(() => formaFancyDate(new Date(time)), [time])

  const isExpense = Math.sign(amount) < 0

  const revalidate = useRevalidator()
  const db = useSQLiteContext();

  const deleteTransaction = () => {
    db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
    revalidate('transactions');
  }

  const type = !isExpense ? 'income' : 'expense'
  const categoryName = typeof category === 'string' ? category : category ? category.name : type
  return (
    <View className="flex-row gap-4 flex-1 items-center justify-center ">
      <View className="size-12 rounded-xl" style={{ backgroundColor: categoryColor }}>
        {/*CATEGORY_IMAGE*/}
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between flex-1">
          <TouchableOpacity onPress={() => onCategoryPressed && onCategoryPressed(categoryName)}>
            <Text className="text-head text-xl">{categoryName}</Text>
          </TouchableOpacity>
          <Text className="text-head text-xl">{isExpense ? '-' : ''} ₵{Math.abs(amount)}</Text>
        </View>
        <View className="flex-row justify-between flex-1">
          <View className="flex-row gap-0.5 items-center justify-center">
            <Text
              className="text-lg text-muted"
              numberOfLines={1}
            >{type}</Text>
            {paymentType && <>
              <FontAwesome
                size={5}
                name="circle"
                className="mt-[4px]"
                color={colors["muted-2"]}
              />
              <Text className="text-muted uppercase text-base">{paymentType}</Text>
            </>}
          </View>
          <Text className="text-muted text-lg">{timeString}</Text>
        </View>
      </View>
      {controlsEnabled && <Controls onDelete={deleteTransaction} />}
    </View >
  )
}

export default TransactionItem;
