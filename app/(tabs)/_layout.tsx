import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Link, usePathname, } from "expo-router";
import { colors } from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";


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
    link: "/user",
    icon: 'settings',
    activeIcon: 'settings',
    label: "Settings",
    name: 'user'
  },
];


const AddTransation = () => (
  <View className="z-50 absolute bottom-10 left-[50%] translate-x-[-25%] justify-center flex-row ">
    {/*ADD BUTTON*/}
    <Link href={'/add-transaction'}>
      <View className="bg-accent rounded-full size-20 items-center justify-center shadow-[0px_10px_10px] shadow-accent-dark/50 overflow-hidden">
        <LinearGradient
          colors={[colors.accent, colors["accent-dark"]]}
          start={[0.5, 0.2]} end={[1.0, 1.0]}
          className="w-full absolute h-full left-0 top-0"
        />
        <Icon name="add" size={30} color={'#fff'} />
      </View>
    </Link>
  </View >
)
export default function Layout() {

  const currentPath = usePathname();
  const isCurrentPath = (path: string) => (
    path === '/'
      ? path === currentPath
      : currentPath.includes(path)
  )


  return (
    <Tabs>

      {/* Customize how `< TabSlot /> ` is rendered. */}

      <TabSlot className="bg-white" />
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
