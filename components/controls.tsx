import { colors } from "@/data";
import { Transaction } from "@/types";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { format, isToday, isYesterday, isThisWeek, isThisYear, subWeeks, getDay } from "date-fns";
import { MaterialCommunityIcons } from '@expo/vector-icons/'
import { useSQLiteContext } from "expo-sqlite";

const Controls = ({ onDelete, onEdit, noConfirmDelete }: { noConfirmDelete?: boolean, onDelete?: () => void, onEdit?: () => void }) => {
  const [viewingOptions, setViewingOptions] = useState(false)
  const closeOptions = () => setViewingOptions(false)
  const del = () => {
    Alert.alert("Confirm Delete?", "Are you sure you want to delete this file?", [
      { text: "Delete", onPress: onDelete, style: 'destructive' },
      { text: "Cancel", style: 'cancel' }
    ])
  }
  return (
    viewingOptions ?
      <View className="flex-row gap-4 border border-muted-2 px-3 h-full flex justify-center items-center rounded-xl">

        {onEdit && <TouchableOpacity onPress={onEdit} className="">
          <MaterialCommunityIcons name="file-edit" size={24} color={colors.muted} />
        </TouchableOpacity>}

        {onDelete && <TouchableOpacity onPress={noConfirmDelete ? onDelete : del} className="">
          <MaterialCommunityIcons name="delete" size={24} color={colors.muted} />
        </TouchableOpacity>}

        <TouchableOpacity onPress={closeOptions} className="">
          <MaterialCommunityIcons name="close" size={24} color={colors.muted} />
        </TouchableOpacity>

      </View>
      :
      <TouchableOpacity onPress={() => setViewingOptions(true)} className="border-muted-2 h-full flex justify-center items-center rounded-xl">
        <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.muted} />
      </TouchableOpacity>
  )
}

export default Controls
