import { Tabs } from 'expo-router';
import { Icon } from 'react-native-paper';

interface TabConfig {
  name: string;
  title: string;
  iconName: string;
}

// Define the type for the CustomBottomTab component props as readonly
interface CustomBottomTabProps {
  tabConfig: TabConfig[];
}

const CustomBottomTab: React.FC<CustomBottomTabProps> = ({ tabConfig }) => {
  return (
    <Tabs>
      {tabConfig.map(({ name, title, iconName }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
            tabBarLabelStyle: {
              fontSize: 12
            },
            tabBarIcon: ({ color, size }) => (
              <Icon source={iconName} color={color} size={size} />
            ),
            tabBarActiveTintColor: "#000"
            // tabBarActiveBackgroundColor: "#000",
          }}
        />
      ))}
    </Tabs>
  );
};

export default function BottomTabLayout() {
  const tabConfig: { name: string, title: string, iconName: string }[] = [
    { name: '(home)', title: 'Home', iconName: 'home' },
    { name: '(recording)', title: 'Recording', iconName: 'microphone' },
    { name: 'Employee', title: 'Employee', iconName: 'account-group' },
    { name: 'Settings', title: 'Settings', iconName: 'zodiac-scorpio' },
  ];

  return (
    <CustomBottomTab tabConfig={tabConfig} />
  );
}
