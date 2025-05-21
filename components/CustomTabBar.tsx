import { colors } from "@/constants/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text } from "@react-navigation/elements";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const icons: { [key: string]: { component: any; icon: string } } = {
    Clients: {
      component: FontAwesome5Icon,
      icon: "users",
    },
    Suppliers: {
      component: FontAwesome5Icon,
      icon: "cubes",
    },
    Distributors: {
      component: FontAwesome5Icon,
      icon: "shuttle-van",
    },
    Analytics: {
      component: MaterialCommunityIcon,
      icon: "chart-timeline-variant-shimmer",
    },
  };

  const getIcon = (label: string, isFocused: boolean) => {
    const icon = icons[label] || icons["Clients"];
    const IconComponent = icon.component;
    return (
      <IconComponent
        name={icon.icon}
        size={20}
        color={isFocused ? colors.blue[800] : colors.neutral[200]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused
                  ? colors.neutral[50]
                  : colors.blue[600],
              },
            ]}
            className={`flex items-center justify-center gap-1 flex-row ${
              isFocused ? "flex-1" : "w-[50px]"
            }`}
          >
            {getIcon(label as string, isFocused)}
            {isFocused && (
              <Text
                style={{
                  color: isFocused ? colors.blue[800] : colors.neutral[900],
                  fontWeight: isFocused ? "bold" : "normal",
                }}
              >
                {label as string}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    paddingHorizontal: 5,
    backgroundColor: colors.blue[800],
    position: "absolute",
    bottom: 30,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
