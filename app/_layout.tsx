import { Stack } from "expo-router";
import React from "react";
import { UserProvider } from "./context/UserContext";
export default function RootLayout() {
    return (
        <UserProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="signup"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="bookings"
                    options={{
                        headerShown: true,
                        title: "Book Equipments",
                        headerStyle: {
                            backgroundColor: "#4CAF50",
                        },
                        headerTintColor: "#fff",
                        presentation: "card",
                    }}
                />
            </Stack>
        </UserProvider>
    );
}
