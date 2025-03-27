import { useRouter } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons";

export default function BackButton({ className, onPress }: { className?: string; onPress?: () => void }) {

  const router = useRouter()
  return (
    <TouchableOpacity onPress={onPress ?? router.back} className={className} >
      <View className="size-10  justify-center border border-muted-2 items-center rounded-2xl">
        <Icon name="chevron-left" size={20} />
      </View>
    </TouchableOpacity >
  )
}


