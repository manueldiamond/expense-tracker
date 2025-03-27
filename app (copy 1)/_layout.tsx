import { Stack } from "expo-router"
import "../globals.css"
import { SQLiteProvider } from "expo-sqlite"
import { setupDB } from "@/services/db"
import { colors } from "@/data"
import { ToastProvider } from "expo-toast"
import { RevalidatorProvider } from "@/context/revalidator"
import { UserProfileProvider } from "@/context/user"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"

export default function RootLayout() {
  return (
    <Suspense fallback={<ActivityIndicator size={'large'} />}>
      <UserProfileProvider>
        <RevalidatorProvider>
          <ToastProvider>
            <SQLiteProvider databaseName="local.db" onInit={setupDB}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="add-transaction" options={{
                  presentation: 'modal',
                  headerShown: false,
                  statusBarBackgroundColor: colors.accent

                }} />
                <Stack.Screen name="user" options={{ title: "User Settings" }} />
              </Stack>
            </SQLiteProvider>
          </ToastProvider>
        </RevalidatorProvider>
      </UserProfileProvider>
    </Suspense>
  )
}
