import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MarkAttendanceScreen = () => {
  const [steps, setSteps] = useState([
    { id: 1, label: "QR Code Scanned", status: "pending" },
    { id: 2, label: "Location Verified", status: "pending" },
    { id: 3, label: "Face Detected", status: "pending" },
    { id: 4, label: "Liveness Verified", status: "pending" },
    { id: 5, label: "Bluetooth Chain Verified", status: "pending" },
  ]);
  const [qrTimer, setQrTimer] = useState(30);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateStepStatus = (id:number, status:string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, status } : step
      )
    );
  };

  const renderStatusIcon = (status:string) => {
    if (status === "pending") return <ActivityIndicator size="small" color="gray" />;
    if (status === "success") return <Ionicons name="checkmark-circle" size={24} color="green" />;
    if (status === "error") return <Ionicons name="close-circle" size={24} color="red" />;
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Class: CS101 - John Doe | QR Valid for: {qrTimer}s
      </Text>
      {steps.map((step) => (
        <View key={step.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          {renderStatusIcon(step.status)}
          <Text style={{ marginLeft: 10 }}>{step.label}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={{ backgroundColor: "blue", padding: 10, marginTop: 20 }}
        onPress={() => updateStepStatus(1, "success")}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Simulate QR Scan Success</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarkAttendanceScreen;
