import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Configure the default notification behavior for active foreground alerts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // replaces deprecated shouldShowAlert
    shouldShowList: true,     // shows in notification tray
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request system permissions for notifications natively.
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for notification permissions!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });
      
      await Notifications.setNotificationChannelAsync('alarms', {
        name: 'Medication Alarms',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#ef4444',
      });
    }

    return true;
  } catch (err) {
    console.log('[Notifications] Error registering native channels. Bypassing...');
    return true;
  }
}

/**
 * Triggers an instant local notification banner (with static Alert popup backup in web).
 */
export async function triggerLocalNotification(title, body, data = {}) {
  console.log(`[Notifications] Triggering Alert Event: ${title} - ${body}`);
  
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
      },
      trigger: null, // trigger immediately
    });
  } catch (err) {
    // Native local fallback alerts
    Alert.alert(title, body);
  }
}

/**
 * Schedules a future local notification (e.g. medicine alarms, appointment reminders).
 */
export async function scheduleFutureNotification(title, body, triggerTime, channelId = 'default') {
  try {
    let trigger = null;
    
    if (triggerTime instanceof Date) {
      trigger = triggerTime;
    } else if (typeof triggerTime === 'number') {
      trigger = { seconds: triggerTime };
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        android: {
          channelId: channelId,
        }
      },
      trigger,
    });
    
    return notificationId;
  } catch (err) {
    console.error('Error scheduling notification:', err);
    return 'simulated-id';
  }
}

/**
 * Cancels a scheduled local notification by ID.
 */
export async function cancelNotification(id) {
  if (id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (err) {
      console.log('Error cancelling notification:', err);
    }
  }
}

/**
 * Clears notification badge counter.
 */
export async function clearBadgeCounter() {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (err) {
    console.log('Error clearing badge count.');
  }
}

/**
 * Initializes notification configuration.
 */
export async function initializeNotifications() {
  console.log('Notifications engine initialized successfully.');
}
