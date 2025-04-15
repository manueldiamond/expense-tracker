import Card from "@/components/card";
import Controls from "@/components/controls";
import { useRevalidator } from "@/context/revalidator";
import { useUserProfile } from "@/context/user";
import { colors, transactionTypeOptions } from "@/data";
import { useCategories, useHandleBack, useObjectState, useSqliteGet, useUserData } from "@/hooks";
import { ExternalState, TransactionCategory } from "@/types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, Dimensions, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "expo-toast";
import RadioOptions from "@/components/radio-options";
import { useMemo, useState } from "react";
import { router, useRouter } from "expo-router";
import tw from 'twrnc'
import { LinearGradient } from "expo-linear-gradient";
import { MainButton } from "@/components/ui/button";

const COLORS = [
  "#D32F2F", // Red
  "#C2185B", // Pink
  "#7B1FA2", // Purple
  "#512DA8", // Deep Purple
  "#303F9F", // Indigo
  "#1976D2", // Blue
  "#0288D1", // Light Blue
  "#0097A7", // Cyan
  "#00796B", // Teal
  "#388E3C", // Green
  "#689F38", // Light Green
  "#AFB42B", // Lime
  "#FBC02D", // Yellow
  "#FFA000", // Amber
  "#F57C00", // Orange
  "#E64A19", // Deep Orange
  "#5D4037", // Brown
  "#616161", // Gray
  "#455A64", // Blue Gray
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

const AddCategory = ({ onAdd, close }: { close: () => void; onAdd: (c: TransactionCategory) => void }) => {
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
    <KeyboardAvoidingView className="container min-h-full" >
      <View style={tw`bg-white mt-auto mb-5 elevation-6 rounded-3xl shadow-radius-5 p-[1rem] `}>
        <Text className="text-muted text-xl pb-4 text-center">New Category</Text>
        <View className="gap-3 items-center justify-between ">
          <View className=" flex-row gap-3 items-center self-stretch flex w-full">
            <TouchableOpacity
              onPress={() => setSelectingColor(selecting => !selecting)}
              style={tw`w-12 h-12 rounded-xl bg-[${color}]`}
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
                className="border-muted-2 border self-stretch max-w-full rounded-xl px-2 py-1 text-head text-xl flex-1"
              />}
          </View>
          <RadioOptions
            items={transactionTypeOptions}
            state={[type, (type) => setData({ type })]}
            className="gap-3 flex-row w-full"
            itemClassName="w-full flex-1"
          />

          <View style={tw`w-full gap-3.5 flex-row `}>
            <MainButton className='flex-1' onPress={close} ghost>Cancel</MainButton>
            <MainButton className='flex-1' onPress={addPressed}>Add</MainButton>
          </View>
        </View>

      </View>
    </KeyboardAvoidingView>
  )
}

const UserData = () => {
  const db = useSQLiteContext()
  const { user, setUserData, mutateUserData } = useUserData(db)

  const saveName = () => {
    setUserData().catch((e) => {
      console.log(e)
      toast.show("failed to save name")
    })
  }
  const toast = useToast()
  return (
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
  )
}

const Categories = () => {
  const db = useSQLiteContext()
  const [categories,] = useCategories(db)
  const revalidate = useRevalidator()
  const toast = useToast()

  const [addingCategory, setAddingCategory] = useState(false)

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

  const addCategory = (cat: TransactionCategory) => {
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

    setAddingCategory(false)
  }

  return (
    <>
      <Card label="Edit Categories" className=" pb-[140px] py-3.5 gap-4 flex flex-col">
        {categories?.map(cat =>
          <CategoriesListItem
            deleteCategory={() => deleteCategoryFromState(cat.name)}
            key={cat.name}{...cat} />)}
        <TouchableOpacity
          onPress={() => setAddingCategory(true)}
          style={tw`border border-[${colors["muted-2"]}] justify-between flex flex-row items-center gap-4 py-4 px-4 border-dashed rounded-2xl`}>
          <MaterialIcons name="add" size={30} color={colors["muted-2"]} />
          <Text style={tw`text-lg text-[${colors.muted}]`}>New Category</Text>
          <MaterialIcons name="add" size={30} color={colors["muted-2"]} />
        </TouchableOpacity>
      </Card>
      <Modal
        visible={addingCategory}
        transparent
        animationType="slide"
      >
        <Pressable onPress={() => setAddingCategory(false)}>
          <LinearGradient
            style={[tw`w-[${Dimensions.get('screen').width}] h-[${Dimensions.get('screen').height}] absolute top-0 left-0`,]}
            colors={['rgba(0,0,0,0.5)', '#000000']}
          />
        </Pressable>
        <AddCategory close={() => setAddingCategory(false)} onAdd={addCategory} />
      </Modal>

    </>
  )

}
export default function page() {
  const { user, } = useUserData(useSQLiteContext())

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className='container' style={tw`justify-between bg-white h-full container py-8 `}>
          <View style={tw`pb-[20px]`}>
            <Text style={tw`text-4xl font-bold text-head mb-5`}>{user.name}</Text>
            {/*ADD TRANSACTION HEADER*/}
            <View className="gap-2">
              <UserData />
              <Categories />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  )
}


