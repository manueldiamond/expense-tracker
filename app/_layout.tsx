import "../globals.css"
import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Card from "@/components/card";
import Select from "@/components/ui/select";
import { colors } from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { useObjectState } from "@/hooks";
import { getCategories } from "@/services/db";

//array for all the listed tabs
const pages = [
  {
    link: "/",
    icon: "home",
    activeIcon: "home",
    label: "Home",
    name: 'index',
  },
  {
    link: "/records",
    icon: "list",
    activeIcon: "list-alt",
    label: "Records",
    name: 'records'
  },
];
const CategoriesSelect = ({ state }) => {
  const [cats, setCats] = useState()
  useEffect(() => {
    const fetchFromDB = async () => {
      console.log("ATOM", "ATOM")
      const cats = await getCategories()
      console.log("ATOM", "ATOM")
      console.log(cats)
      setCats(cats)
    }
    fetchFromDB();
  }, [])

  return (
    cats && <Select
      items={cats}
      state={state}
    />
  )
}

const AddTransation = () => {
  const [adding, setAdding] = useState(true);
  const openModal = () => setAdding(true)
  const closeModal = () => setAdding(false)
  const [data, setData] = useObjectState({ amount: 0, category: "Default", type: "Income" });

  const categoryState = [data.category, (category: string) => setData({ category })]
  return (
    <View className="z-50 absolute bottom-10 w-screen justify-center flex-row ">
      {/*ADD BUTTON*/}
      <TouchableOpacity onPress={openModal} >
        <View className="bg-accent rounded-full size-20 items-center justify-center shadow-[0px_10px_10px] shadow-accent-dark/50 overflow-hidden">
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className="w-full absolute h-full left-0 top-0"
          />
          <Icon name="add" size={30} color={'#fff'} />
        </View>
      </TouchableOpacity>
      {/*ADD TRANSACTION MODAL*/}
      <Modal visible={adding} onRequestClose={closeModal} className="">
        <KeyboardAvoidingView className="container">
          {/*ADD TRANSACTION HEADER*/}
          <View className="py-6 flex-row items-center w-full justify-center">
            {/*BACK BUTTON*/}
            <TouchableOpacity onPress={closeModal} className="left-0 absolute ">
              <View className="size-10  justify-center border border-muted-2 items-center rounded-2xl">
                <Icon name="chevron-left" size={20} />
              </View>
            </TouchableOpacity>

            <Text className="text-xl text-head w-max p-0">Add Transaction</Text>
            <View className="size-10 justify-center " />
          </View>
          <View className="gap-2">
            <Card label="Amount" className="py-3.5">
              <View className="flex-row items-center justify-center">
                <Text className="text-head text-xl ml-4">₵</Text>
                <TextInput className="py-0 my-0 w-full text-head text-xl" placeholder="0.00" />
              </View>
            </Card>
            <Card label="Category" className="py-3.5">
              <CategoriesSelect state={categoryState} />
            </Card>
            <Text className="text-head"></Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View >
  )
}


export default function RootLayout() {

  const currentPath = usePathname();
  const isCurrentPath = (path: string) => (
    path === '/'
      ? path === currentPath
      : currentPath.includes(path)
  )

  return (
    <Tabs>
      {/* Customize how `< TabSlot /> ` is rendered. */}
      <TabSlot />

      <TabList className="w-full absolute bottom-0 bg-white shadow-[0px_-50px_20px] shadow-head justify-between flex flex-row px-5">
        <AddTransation />
        {pages.map(({ link, icon, activeIcon, label, name }) => {
          const active = isCurrentPath(link)
          return (
            <TabTrigger
              //@ts-ignore
              href={link}
              key={link}
              name={name}
            >
              <View
                className={`flex-col flex justify-center items-center gap-0.5 py-3 px-3 ${!active && 'opacity-50'}`}
              >
                <Icon
                  size={24}
                  color={active ? '#b6d7ad' : ''}
                  //@ts-ignore
                  name={active ? activeIcon : icon}
                />
                <Text
                  className={`${active ? 'text-accent' : ''}`}
                >{label}</Text>
              </View>
            </TabTrigger>
          )
        })}
      </TabList>

    </Tabs >
  )
}
