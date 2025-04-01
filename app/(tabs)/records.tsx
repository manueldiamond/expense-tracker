import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTransactions } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import BackButton from "@/components/back-button";
import TransactionItem from "@/components/transaction-item";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

const TransactionsPage = () => {

  const db = useSQLiteContext()
  const { transactions } = useTransactions(db, new Date(1995, 0, 1));

  const router = useRouter()

  const filters = []

  const [showingFiltersModal, setShowFilterModal] = useState(false)



  return (
    <View className="bg-white container min-h-screen px-4 py-6">
      <FlatList
        data={transactions}
        scrollEnabled
        keyExtractor={(t) => `${(t && t.id)}`}
        ListHeaderComponent={
          <View className="">
            <View className="py-3 relative border-b-muted-2/50 mb-4 flex-row items-center w-full justify-center">
              <BackButton className="left-0 absolute" />
              <Text className="text-xl text-head w-max p-0">Records</Text>
            </View>
            <View className="flex gap-2">
              <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                <View className="border-muted-2 border flex justify-center items-center rounded-full px-2 py-1">
                  <MaterialCommunityIcons name="filter" />
                  <Text className="border-muted">Filters</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item: transaction }) =>
          transaction && <TransactionItem {...transaction} controlsEnabled />
        }
        contentContainerStyle={{ gap: 5, paddingBottom: 200 }}

      />
    </View>
  );
};

export default TransactionsPage;
