import { Alert } from 'react-native';

export function notify(title, message, onOk) {
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }], {
    cancelable: false,
  });
}

export function confirmDestructive({
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
}) {
  Alert.alert(
    title,
    message,
    [
      { text: cancelText, style: 'cancel' },
      { text: confirmText, style: 'destructive', onPress: onConfirm },
    ],
    { cancelable: true }
  );
}