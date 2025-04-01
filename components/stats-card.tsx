import { bottomTextS, colors } from "@/data"
import { periodType } from "@/types"
import { rarr } from "@/utils"
import Card from "./card"
import { Text, View } from "react-native"
import { PieChartPro } from "react-native-gifted-charts"

const StatsCard = ({ showBottomText, period, income = 0, spent = 0 }: {
  income: number,
  spent: number,
  period: periodType,
  showBottomText?: boolean
}) => {
  const timeOfDay = new Date().getUTCHours()

  const bottomText = showBottomText && (period !== 'All' && period !== 'Yearly') &&//no bottom text for these durations.
    !income && !spent
    ? rarr(bottomTextS.nan)
    : income > spent
      ? rarr(bottomTextS.afterGains)
      : income < spent
      && rarr(bottomTextS.afterLosses)

  return (
    <View className="container">
      <Card>
        <View className=" justify-between flex flex-row gap-8">
          <View className="justify-between flex-1">
            <View className="gap-0.5 ">
              <View className="flex-row items-center gap-2.5">
                <View className="w-2 h-[18px] rounded bg-accent" />
                <Text className="text-lg text-muted">Income</Text>
              </View>
              <Text className=" font-medium text-[24px] text-head">₵ {income}</Text>
            </View>

            <View className="gap-0.5 ">
              <View className="flex-row items-center gap-2.5">
                <View className="w-2 h-[18px] rounded bg-spent" />
                <Text className="text-lg text-muted">Spent</Text>
              </View>
              <Text className="font-medium text-[24px] text-head">₵ {spent}</Text>
            </View>

          </View>

          {(income && spent) ?
            <PieChartPro
              donut
              data={[
                { value: income || 0, color: colors.accent },
                { value: spent || 0, color: colors.spent },
              ]}
              radius={64}
              pieInnerComponent={
                () => <Text className=" text-sm text-muted-2 my-0 text-center">Noting Yet!</Text>
              }
              isAnimated
              animationDuration={.2}
            />
            :
            <View
              style={{
                borderColor: income ? colors.accent : spent ? colors.spent : colors["muted-2"]
              }}
              className="border-[35px] rounded-full size-[128px] items-center justify-center"
            />
          }
        </View>

        {
          income || spent &&

          <Text className="mt-2 text-lg text-muted-2 w-full text-center">
            You've {income > spent ? 'gained' : 'lost'}
            <Text className={(income > spent ? 'text-accent' : 'text-spent') + " font-medium text-lg"} > ₵{Math.abs(income - spent)} </Text>
            {period === 'Today' ? 'Today'
              : period === 'Weekly' ? 'this Week'
                : period === 'Yearly' ? 'this Year'
                  : period === 'Monthly' ? 'this Month'
                    : 'in Total'
            }</Text>

        }

        {bottomText && <Text className="mt-4 text-sm text-muted-2 w-full text-center">{bottomText.text} - <Text className="text-xs font-medium text-muted-2/80">{bottomText.verse}</Text> </Text>}
      </Card >
    </View >
  )
}

export default StatsCard
