import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTransactions } from "@/hooks";
import { useSQLiteContext } from "expo-sqlite";
import BackButton from "@/components/back-button";
import TransactionItem from "@/components/transaction-item";
import { useRouter } from "expo-router";

const TransactionsPage = () => {

  const db = useSQLiteContext()
  const { transactions } = useTransactions(db, new Date(1995, 0, 1));

  const router = useRouter()

  return (
    <View className="bg-white container min-h-screen px-4 py-6">
      <FlatList
        data={transactions}
        scrollEnabled
        keyExtractor={(t) => `${(t && t.id)}`}
        ListHeaderComponent={
          <View className="py-3 relative border-b-muted-2/50 mb-4 flex-row items-center w-full justify-center">
            <BackButton className="left-0 absolute" />
            <Text className="text-xl text-head w-max p-0">Records</Text>
          </View>
        }
        renderItem={({ item: transaction }) =>
          transaction && <TransactionItem {...transaction} controlsEnabled />
        }
        contentContainerStyle={{ gap: 5, paddingBottom: 100 }}

      />
    </View>
  );
};

export default TransactionsPage;
