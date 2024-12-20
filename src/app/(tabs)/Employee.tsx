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
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        // console.log("Data:: ", json);
        setData(json);
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

  const EmployeeCardDetail = ({ fieldName, fieldDetail, isLast }: any) => {
    // console.log("isLast", isLast);
    return (
      <>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontWeight: "500",
              paddingBottom: 6,
              color: "#777777",
            }}
          >
            {fieldName}
          </Text>
          <Text
            style={{
              fontWeight: "500",
              paddingBottom: 6,
              color: "#113C6D",
            }}
          >
            {fieldDetail}
          </Text>
        </View>

        {!isLast && (
          <View style={{ height: 1, backgroundColor: "#EEEEEE", marginVertical: 6 }} />
        )}
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#113C6D", width: "90%", alignSelf: "center", marginVertical: 10 }}>
        Employee Details
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          const fields = [
            { fieldName: "Employee Name", fieldDetail: item?.name },
            { fieldName: "Employee Number", fieldDetail: item?.phone },
            { fieldName: "Company Name", fieldDetail: item?.company?.name },
          ];

          return (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DDDDDD",
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
                  padding: 10,
                  backgroundColor: "#E8F2FF",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontWeight: "500", color: "#113C6D" }}>
                  Employee ID: <Text style={{ color: "#D90000" }}>{item?.id}</Text>
                </Text>
                <TouchableOpacity
                  style={{ padding: 4, backgroundColor: "#FFCDCD", borderRadius: 6 }}
                  onPress={() => handleDelete(item?.id)}
                >
                  <Icon source="trash-can-outline" size={18} color="red" />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", padding: 10, alignSelf: "center", justifyContent: "space-between" }}>
                {fields.map((field, index) => (
                  <EmployeeCardDetail
                    key={index}
                    fieldName={field.fieldName}
                    fieldDetail={field.fieldDetail}
                    isLast={index === fields.length - 1} // Pass `true` for the last element in the fields
                  />
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Employee;
