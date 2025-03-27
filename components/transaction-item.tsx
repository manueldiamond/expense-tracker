import { colors } from "@/data";
import { Transaction } from "@/types";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { format, isToday, isYesterday, isThisWeek, isThisYear, subWeeks, getDay } from "date-fns";
import { MaterialCommunityIcons } from '@expo/vector-icons/'
import { useSQLiteContext } from "expo-sqlite";
import { useRevalidator } from "@/context/revalidator";
import Controls from "./controls";
const formatDate = (date: Date) => {
  if (isToday(date)) return date.toLocaleTimeString('en-US', { hour12: true, timeStyle: 'short' });
  else if (isYesterday(date)) return "Yesterday";
  else if (isThisWeek(date)) return getDay(date);
  else if (date >= subWeeks(new Date(), 1)) return "Last week";
  else if (isThisYear(date)) return format(date, "MMMM d"); // e.g., "March 22"
  return format(date, "MMMM d, yyyy"); // e.g., "March 22, 2022"
};

const TransactionItem = ({ category, amount, time, id, controlsEnabled }: Transaction & { controlsEnabled?: boolean }) => {
  const icon = "";
  const categoryColor = (category && typeof category === 'object') ? category.color : colors["muted-2"];
  const timeString = useMemo(() => formatDate(new Date(time)), [time])

  const isExpense = Math.sign(amount) < 0

  const revalidate = useRevalidator()
  const db = useSQLiteContext();

  const deleteTransaction = () => {
    db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
    revalidate('transactions');
  }

  const type = !isExpense ? 'income' : 'expense'

  return (
    <View className="flex-row gap-4 flex-1 items-center justify-center ">
      <View className="size-12 rounded-xl" style={{ backgroundColor: categoryColor }}>
        {/*CATEGORY_IMAGE*/}
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between flex-1">
          <Text className="text-head text-xl">{typeof category === 'string' ? category : category ? category.name : type}</Text>
          <Text className="text-head text-xl">{isExpense ? '-' : ''} ₵{Math.abs(amount)}</Text>
        </View>
        <View className="flex-row justify-between flex-1">
          <Text className="text-lg text-muted" numberOfLines={1}>{type}</Text>
          <Text className="text-muted text-lg">{timeString}</Text>
        </View>
      </View>
      {controlsEnabled && <Controls onDelete={deleteTransaction} />}
    </View>
  )
}

export default TransactionItem;
