import { colors } from "@/data"
import { Text, View } from "react-native"
import { PieChart } from "react-native-gifted-charts"
import Animated from "react-native-reanimated"
import { ReactNode } from "react"
import Card from "./card"

type StatItem = {
  label: string
  amount: number
  color?: string
  format?: (amount: number) => string
}

const StatsCard = ({
  title,
  income,
  spent,
  items,
  topText,
  bottomText,
}: {
  title: string
  income?: number
  spent?: number
  items?: StatItem[]
  topText?: ReactNode
  bottomText?: { text: string; verse: string }
}) => {
  const defaultItems: StatItem[] = income !== undefined && spent !== undefined
    ? [
      {
        label: "Income",
        amount: income,
        color: colors.accent,
        format: (val) => `₵ ${val}`,
      },
      {
        label: "Expenses",
        amount: spent,
        color: colors.spent,
        format: (val) => `₵ ${val}`,
      },
    ]
    : []

  const displayItems = items?.length ? items : defaultItems

  const hasValues = displayItems.some((item) => item.amount)

  return (
    <Card label={title} className={`${bottomText ? "!pb-1" : ""}`}>
      <Animated.View>
        <View className="justify-between flex flex-row gap-8">
          <View className="justify-between flex-1">
            {displayItems.map((item, i) => (
              <View className="gap-0.5" key={i}>
                <View className="flex-row items-center gap-2.5">
                  <View className="w-2 h-[18px] rounded" style={{ backgroundColor: item.color ?? colors["muted-2"] }} />
                  <Text className="text-lg text-muted">{item.label}</Text>
                </View>
                <Text className="font-medium text-[24px] text-head">
                  {item.format ? item.format(item.amount) : item.amount}
                </Text>
              </View>
            ))}
          </View>

          {hasValues ? (
            <PieChart
              donut
              radius={64}
              isAnimated
              animationDuration={0.2}
              data={displayItems.map((item) => ({
                value: item.amount,
                color: item.color ?? colors["muted-2"],
              }))}
            />
          ) : (
            <View
              style={{
                borderColor: colors["muted-2"],
              }}
              className="border-[35px] rounded-full size-[128px] items-center justify-center"
            />
          )}
        </View>

        {topText && (
          <Text className="mt-2 text-lg text-muted-2 w-full text-left">
            {topText}
          </Text>
        )}

        {bottomText && (
          <Text className="mt-4 text-sm text-muted-2 w-full text-center">
            {bottomText.text} -{" "}
            <Text className="text-xs font-medium text-muted-2/80">{bottomText.verse}</Text>
          </Text>
        )}
      </Animated.View>
    </Card>
  )
}

export default StatsCard

