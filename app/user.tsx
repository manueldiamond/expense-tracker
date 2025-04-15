import Card from "@/components/card";
import Controls from "@/components/controls";
import { useRevalidator } from "@/context/revalidator";
import { useUserProfile } from "@/context/user";
import { colors, transactionTypeOptions } from "@/data";
import { useCategories, useHandleBack, useObjectState, useUserData } from "@/hooks";
import { ExternalState, TransactionCategory } from "@/types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "expo-toast";
import { TabActionType } from "@react-navigation/native";
import RadioOptions from "@/components/radio-options";
import { useMemo, useState } from "react";
import { toOptions } from "@/utils";
import { router, useRouter } from "expo-router";
import BackButton from "@/components/back-button";


const COLORS = [
  "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9",
  "#BBDEFB", "#B2EBF2", "#B2DFDB", "#C8E6C9", colors["accent-dark"],
  "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2",
  "#FFCCBC", "#D7CCC8", "#F5F5F5", "#CFD8DC", "#E0E0E0",
  colors.head, colors.lblue, colors.spent,
  colors.muted,
];

export const ColorPicker = ({ state }: { state: ExternalState<string> }) => {
  const [selectedColor, setSelectedColor] = state

  return (
    <View className="flex-row flex-1 flex-wrap gap-2 p-4">
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-lg ${selectedColor === color ? "border-2 border-black" : ""}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </View>
  );
};

const coreCategories = ['Food', 'Misc']
const CategoriesListItem = ({ name, type, color, deleteCategory }: TransactionCategory & { deleteCategory: () => void }) => {

  return (

    <View className="flex-row gap-4 items-center justify-between flex-1">
      <View className="flex-row gap-4 items-center justify-center">
        <View className="size-9 rounded-xl" style={{ backgroundColor: color }}>
          {/*CATEGORY_IMAGE*/}
        </View>
        <View className="">
          <View className="flex-col justify-between ">
            <Text className="text-head text-lg">{name}</Text>
            <Text className="text-base text-muted">{type || "none"}</Text>
          </View>
        </View>
      </View>
      <Controls onDelete={coreCategories.includes(name) ? undefined : deleteCategory} noConfirmDelete />
    </View>
  )
}

const AddCategoriesListItem = ({ onAdd }: { onAdd: (c: TransactionCategory) => void }) => {
  const [data, setData] = useObjectState<TransactionCategory>({
    name: "", type: "income", color: colors["muted-2"]
  })
  const { color, type, name } = data


  const addPressed = () => {
    if (!name)
      return Alert.alert("Must add category name")
    onAdd(data)
    setData({ name: "", type: "income", color: colors["muted-2"] })
  }

  const [selectingColor, setSelectingColor] = useState(false);

  return (
    <Card className="">
      <Text className="text-muted pb-2">New Category</Text>
      <View className="gap-2 items-center justify-between flex-1">
        <View className="flex-row gap-2 items-center self-stretch flex w-full">
          <TouchableOpacity
            onPress={() => setSelectingColor(selecting => !selecting)}
            className="size-9 rounded-xl" style={{ backgroundColor: color }}
          >
            {/*CATEGORY_IMAGE*/}
          </TouchableOpacity>

          {selectingColor ?
            <ColorPicker state={[color,
              (color) => {
                setData({ color })
                setSelectingColor(false)
              }]} />
            :
            <TextInput
              value={name}
              numberOfLines={1}
              multiline={false}
              maxLength={24}
              autoCapitalize="words"
              onChangeText={name => setData({ name })}
              placeholder="Category name"
              className="border-muted-2 self-stretch max-w-full bg-white/50 rounded-xl px-2 py-1 text-head text-lg flex-1"
            />}
        </View>
        <View className="flex-row justify-between items-center w-full">
          <RadioOptions
            items={transactionTypeOptions} state={[type, (type) => setData({ type })]}
            itemClassName="!px-2 !py-1"
            className="gap-1"
            itemTextClassName="!text-sm"
            iconSize={10}
          />

          <TouchableOpacity onPress={addPressed} className="w-max size-max">
            <View className="flex-row rounded-full px-3 py-1 justify-center items-center border border-muted-2">
              <MaterialIcons name="add" size={12} color={colors.muted} />
              <Text className="text-muted text-sm">Add</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </Card>
  )
}

export default function page() {
  const db = useSQLiteContext()
  const { user, setUserData, mutateUserData } = useUserData(db)
  const [categories, mutateCategories] = useCategories(db)
  const router = useRouter()
  const revalidate = useRevalidator()
  const toast = useToast()

  const deleteCategoryFromState = (name: string) => {
    db.runAsync(`DELETE FROM categories WHERE name=$name`, { $name: name })
      .then(_ => {
        toast.show(name + ' successfully deleted')
      }).catch((e) => {
        console.log(e)
        toast.show("Error: couldn't delete category")
      }).finally(() => {
        revalidate('cats');
      })
  }

  const addCategoryToState = (cat: TransactionCategory) => {
    db.runAsync(`INSERT INTO categories(name,color,type) VALUES (?,?,?)`,
      [cat.name, cat.color, cat.type]
    ).then(_ => {
      toast.show(cat.name + ' successfully added')
    }).catch((e) => {
      console.log(e)
      toast.show("Error: couldn't add category")
    }).finally(() => {
      revalidate('cats');
      revalidate('transactions');
    })
  }

  const saveName = () => {
    setUserData().catch((e) => {
      console.log(e)
      toast.show("failed to save name")
    })
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className="justify-between bg-white h-full container py-8">
          <View>
            <Text className='text-4xl font-bold text-head mb-5'>{user.name}</Text>
            {/*ADD TRANSACTION HEADER*/}
            <View className="gap-2">
              <Card label="Name" className="py-3.5">
                <View className="flex-row ml-1 items-center justify-center gap-1">
                  <FontAwesome name="user" color={colors["muted-2"]} size={20} />
                  <TextInput
                    value={user.name}
                    onBlur={saveName}
                    placeholder="User"
                    autoComplete="name"
                    autoCapitalize="words"
                    keyboardType="default"
                    submitBehavior="blurAndSubmit"
                    className="py-0 my-0 w-full text-head text-xl"
                    onChangeText={name => mutateUserData({ name })}
                  />
                </View>
              </Card>
              <Card label="Edit Categories" className="py-3.5 gap-4 flex flex-col">
                {categories?.map(cat =>
                  <CategoriesListItem
                    deleteCategory={() => deleteCategoryFromState(cat.name)}
                    key={cat.name}{...cat} />)}
              </Card>

              <AddCategoriesListItem onAdd={addCategoryToState} />
              <Text className="text-head"></Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}


