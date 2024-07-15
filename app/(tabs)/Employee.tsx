import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-paper";

const Employee = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch("https://dummy.restapiexample.com/api/v1/employees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setData(json.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    const updatedData = data.filter((item: any) => item.id !== id);
    setData(updatedData);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", margin: 20 }}>
        Employee Details
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              marginVertical: 10,
              width: "90%",
              alignSelf: "center",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                padding: 10,
                backgroundColor: "#E8F2FF",
                alignItems: "center"
              }}
            >
              <Text style={{ fontWeight: "500", color: "#113C6D" }}>
                Employee ID <Text style={{ color: "#D90000" }}>{item?.id}</Text>
              </Text>
              <TouchableOpacity
                style={{ padding: 4, backgroundColor: "#FFCDCD", borderRadius: 6 }}
                onPress={() => handleDelete(item.id)}
              >
                <Icon source="trash-can-outline" size={18} color="red" />
              </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff" }}
            >
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontWeight: "500",
                    paddingBottom: 6,
                    color: "#777777",
                  }}
                >
                  Employee Name
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    paddingVertical: 6,
                    color: "#777777",
                  }}
                >
                  Employee Salary
                </Text>
                <Text
                  style={{ fontWeight: "500", paddingTop: 6, color: "#777777" }}
                >
                  Employee Age
                </Text>
              </View>
              <View style={{ padding: 10, alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: "500",
                    paddingBottom: 6,
                    color: "#113C6D",
                  }}
                >
                  {item?.employee_name}
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    paddingVertical: 6,
                    color: "#113C6D",
                  }}
                >
                  {item?.employee_salary}
                </Text>
                <Text
                  style={{ fontWeight: "500", paddingTop: 6, color: "#113C6D" }}
                >
                  {item?.employee_age}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Employee;
