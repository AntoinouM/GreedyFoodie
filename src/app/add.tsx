import { ThemedText } from '@/components/themed-text';
import { GlobalClasses } from '@/constants/classes';
import { FoodProduct, searchByBarcode } from '@/services/barcode';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState('');
  const [scannedType, setScannedType] = useState('');
  const [foodProduct, setFoodProduct] = useState<FoodProduct | null>(null);
  const [loadingFood, setLoadingFood] = useState(false);
  const [foodError, setFoodError] = useState<string | null>(null);

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({
    data,
    type,
  }: {
    data: string;
    type: string;
  }) => {
    if (!scanned) {
      setScanned(true);
      setScanning(false);
      setScannedData(data);
      setScannedType(type);
      setFoodProduct(null);
      setFoodError(null);
      setLoadingFood(true);
      searchByBarcode(data)
        .then((product) => {
          setFoodProduct(product);
          if (!product) setFoodError('No product found for this barcode.');
        })
        .catch(() => setFoodError('Failed to fetch product info. Try again.'))
        .finally(() => setLoadingFood(false));
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScanning(true);
    setScannedData('');
    setScannedType('');
    setFoodProduct(null);
    setFoodError(null);
    setLoadingFood(false);
  };

  if (permission === null) {
    return (
      <View>
        <MaterialIcons name="camera-alt" size={64} color="#6366f1" />
        <ThemedText type="title" style={styles.title}>
          Requesting camera permission...
        </ThemedText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <MaterialIcons name="camera-enhance" size={80} color="#ef4444" />
        <Text>Camera Access Denied</Text>
        <Text>Please enable camera permissions in your device settings.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={GlobalClasses.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8'],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <ScannerOverlay scanning={scanning && !scanned} />
      {scanned && scannedData && (
        <ScannedDataCard
          data={scannedData}
          type={scannedType}
          product={foodProduct}
          loading={loadingFood}
          error={foodError}
          onScanAgain={handleScanAgain}
        />
      )}
    </View>
  );
}

const ScannerOverlay = ({ scanning }: { scanning: boolean }) => {
  return (
    <View style={styles.overlay}>
      {scanning && (
        <View style={styles.scannerBox}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      )}
    </View>
  );
};

const ScannedDataCard = ({
  data,
  product,
  loading,
  error,
  onScanAgain,
}: {
  data: string;
  type: string;
  product: FoodProduct | null;
  loading: boolean;
  error: string | null;
  onScanAgain: () => void;
}) => {
  const n = product?.nutriments;
  const kcal = n
    ? (n as Record<string, number | undefined>)['energy-kcal_100g']
    : undefined;

  return (
    <View style={styles.card}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.cardType}>Looking up product...</Text>
        </View>
      ) : error ? (
        <>
          <Text style={styles.cardTitle}>Not found</Text>
          <Text style={styles.cardType}>{error}</Text>
          <Text style={styles.cardData}>{data}</Text>
        </>
      ) : product ? (
        <>
          <Text style={styles.cardTitle}>{product.product_name}</Text>
          {product.brands ? (
            <Text style={styles.cardType}>
              {product.brands}
              {product.quantity ? ` · ${product.quantity}` : ''}
            </Text>
          ) : null}
          {n ? (
            <View style={styles.nutritionGrid}>
              <NutrientCell
                label="Calories"
                value={Math.round(kcal ?? 0).toString()}
                unit="kcal"
              />
              <NutrientCell
                label="Protein"
                value={(n.proteins_100g ?? 0).toFixed(1)}
                unit="g"
              />
              <NutrientCell
                label="Carbs"
                value={(n.carbohydrates_100g ?? 0).toFixed(1)}
                unit="g"
              />
              <NutrientCell
                label="Fat"
                value={(n.fat_100g ?? 0).toFixed(1)}
                unit="g"
              />
            </View>
          ) : null}
          {n ? <Text style={styles.cardType}>Per 100g</Text> : null}
        </>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={onScanAgain}>
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const NutrientCell = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.nutrientCell}>
    <Text style={styles.nutrientValue}>
      {value}
      {unit}
    </Text>
    <Text style={styles.nutrientLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00ff00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00ff00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00ff00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00ff00',
  },
  card: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardData: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  cardType: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 8,
  },
  nutrientCell: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nutrientLabel: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
