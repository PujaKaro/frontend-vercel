import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export async function saveFormData(userId, formType, formData) {
  try {
    const timestamp = Timestamp.now();
    const data = {
      ...formData,
      timestamp,
      status: 'pending'
    };

    await updateDoc(doc(db, 'users', userId), {
      [`${formType}s`]: arrayUnion(data)
    });

    return true;
  } catch (error) {
    console.error('Error saving form data:', error);
    throw error;
  }
}

export async function saveOrder(userId, orderData) {
  try {
    const timestamp = Timestamp.now();
    const order = {
      ...orderData,
      timestamp,
      status: 'pending'
    };

    await updateDoc(doc(db, 'users', userId), {
      orders: arrayUnion(order)
    });

    return true;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

export async function saveAddress(userId, addressData) {
  try {
    const address = {
      ...addressData,
      isDefault: false
    };

    await updateDoc(doc(db, 'users', userId), {
      addresses: arrayUnion(address)
    });

    return true;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
}

export async function updateOrderStatus(userId, orderId, status) {
  try {
    const userDoc = doc(db, 'users', userId);
    const orders = userDoc.data().orders;
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });

    await updateDoc(userDoc, { orders: updatedOrders });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateBookingStatus(userId, bookingId, status) {
  try {
    const userDoc = doc(db, 'users', userId);
    const bookings = userDoc.data().bookings;
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, status };
      }
      return booking;
    });

    await updateDoc(userDoc, { bookings: updatedBookings });
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export async function saveLocationToBooking(bookingId, location) {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      location
    });
    return true;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
}