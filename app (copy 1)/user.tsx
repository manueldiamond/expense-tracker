import Card from "@/components/card";
import Controls from "@/components/controls";
import { useRevalidator } from "@/context/revalidator";
import { useUserProfile } from "@/context/user";
import { colors, transactionTypeOptions } from "@/data";
import { useCategories, useObjectState, useUserData } from "@/hooks";
import { ExternalState, TransactionCategory } from "@/types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "expo-toast";
import { TabActionType } from "@react-navigation/native";
import RadioOptions from "@/components/radio-options";
import { useMemo, useState } from "react";
import { toOptions } from "@/utils";
import { router } from "expo-router";


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
      <Controls onDelete={deleteCategory} noConfirmDelete />
    </View>
  )
}

const AddCategoriesListItem = ({ onAdd }: { onAdd: (c: TransactionCategory) => void }) => {
  const [data, setData] = useObjectState<TransactionCategory>({
    name: "", type: "income", color: colors["muted-2"]
  })
  const { color, type, name } = data

  const typeOptions = useMemo(() => toOptions(
    transactionTypeOptions,
    type => type,
    type => type[0].toUpperCase() + type.slice(1)
  ), [])

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
            items={typeOptions}
            state={[type, (type) => setData({ type })]}
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

  const deleteCategoryFromState = (name: string) => {
    //@ts-ignore
    mutateCategories(prevCats => prevCats.filter(cat => cat.name !== name))
  }

  const addCategoryToState = (cat: TransactionCategory) => {
    //@ts-ignore
    mutateCategories(prevCats => [...prevCats, cat])
  }

  const revalidate = useRevalidator()

  const toast = useToast()
  const save = async () => {
    let msg = "Failed to save changes";
    const err = (message: string) => {
      msg = message;
      throw new Error()
    }
    try {
      if ((user.name.length || 0) < 2)
        err("Enter a valid username")

      if (!categories || ((categories?.length || 0) < 1))
        err("You must have at least 1 category")

      await setUserData();

      await db.withTransactionAsync(async () => {
        await db.runAsync(`DELETE FROM categories`);
        await db.runAsync(`INSERT INTO categories(name,color,type) VALUES
      ${categories!.map((_) => `(?,?,?)`).join(',')}; `,
          categories!.flatMap(cat => [cat.name, cat.color, cat.type]));
      });

      revalidate('cats');
      revalidate('transactions');
      toast.show("Saved successfully")
      router.back();
    } catch (e) {
      console.log(e)
      Alert.alert(msg);
    }

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
                    onChangeText={name => mutateUserData({ name })}
                    keyboardType="default"
                    autoCapitalize="words"
                    autoComplete="name"
                    className="py-0 my-0 w-full text-head text-xl"
                    placeholder="User"
                  />
                </View>
              </Card>
              <Card label="Edit Categories" className="py-3.5 gap-4 flex flex-col">
                {categories?.map(cat =>
                  <CategoriesListItem
                    deleteCategory={() => deleteCategoryFromState(cat.name)}
                    key={cat.name}{...cat} />)}
                <Text className="italic text-muted-2 text-center w-full">Herr, Eli, see, it's not perfect, but it works</Text>
              </Card>

              <AddCategoriesListItem onAdd={addCategoryToState} />
              <Text className="text-head"></Text>
            </View>
          </View>

          <View className="flex-row gap-2 w-full">
            <TouchableOpacity className='flex-1 mt-5 overflow-hidden bg-muted-2 relative items-center justify-center rounded-[28px] px-6 py-6 border-muted-2 border' onPress={router.back}>
              {/*
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className=" absolute left-0 top-0 flex-1"
          />
          */}
              <Text className="text-xl text-muted font-medium ">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className=' flex-1 mt-5 overflow-hidden bg-accent relative items-center justify-center rounded-[28px] px-6 py-6' onPress={save}>
              {/*
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className=" absolute left-0 top-0 flex-1"
          />
          */}
              <Text className="text-xl text-white font-medium ">Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}


