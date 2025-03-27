import { ExternalState, Option } from "@/types";
import { TouchableOpacity, View, Text } from "react-native";

type RadioOptionsProps<T = any> = {
  state: ExternalState<T>,
  items: Option<T>[],
  className?: string;
  itemClassName?: string;
  itemTextClassName?: string;
  iconSize?: number;
}

const RadioOptions = ({ iconSize = 20, state, items, itemClassName, className, itemTextClassName }: RadioOptionsProps) => {
  const [value, setValue] = state

  return (
    <View className={`${className}  flex-row flex flex-wrap gap-2 `}>{
      items.map(opt => (
        <TouchableOpacity
          key={opt.value}
          className={` ${itemClassName} border ${value === opt.value ? 'border-accent' : 'border-muted-2'} rounded-2xl px-6 py-4 `}
          onPress={() => setValue(opt.value)}>
          <View key={opt.value} className={` flex-row items-center justify-start gap-2 `}>
            <View
              style={{
                width: iconSize,
                height: iconSize,
              }}
              className={`flex items-center justify-center ${value === opt.value ? 'border-accent' : 'border-muted-2'} size-5 rounded-full border bg-transparent`} >
              {value === opt.value &&
                <View
                  style={{
                    width: iconSize * 2 / 5.0,
                    height: iconSize * 2 / 5.0,
                  }}
                  className={`transition-all bg-accent size-2  rounded-full `}
                />
              }
            </View>
            <Text className={`${itemTextClassName} text-lg ${value === opt.value ? 'text-accent font-medium' : 'text-muted-2'}  min-w-max `}>
              {opt.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))
    }
    </View >
  )
}



export default RadioOptions
