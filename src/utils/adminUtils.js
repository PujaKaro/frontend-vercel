import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';

// User Management
export const fetchUsers = async (lastUser = null, pageSize = 10) => {
  try {
    let usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastUser) {
      usersQuery = query(usersQuery, startAfter(lastUser));
    }

    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Booking Management
export const fetchBookings = async (lastBooking = null, pageSize = 10) => {
  try {
    let bookingsQuery = query(
      collection(db, 'bookings'),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    if (lastBooking) {
      bookingsQuery = query(bookingsQuery, startAfter(lastBooking));
    }

    const snapshot = await getDocs(bookingsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Order Management
export const fetchOrders = async (lastOrder = null, pageSize = 10) => {
  try {
    let ordersQuery = query(
      collection(db, 'orders'),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    if (lastOrder) {
      ordersQuery = query(ordersQuery, startAfter(lastOrder));
    }

    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Blog Management
export const fetchBlogs = async (lastBlog = null, pageSize = 10) => {
  try {
    let blogsQuery = query(
      collection(db, 'blogs'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastBlog) {
      blogsQuery = query(blogsQuery, startAfter(lastBlog));
    }

    const snapshot = await getDocs(blogsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const updateBlogStatus = async (blogId, status) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      status,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating blog status:', error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, 'blogs', blogId));
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Analytics
export const fetchAnalytics = async () => {
  try {
    const [users, bookings, orders, blogs] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'bookings')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'blogs'))
    ]);

    return {
      totalUsers: users.size,
      totalBookings: bookings.size,
      totalOrders: orders.size,
      totalBlogs: blogs.size,
      users: users.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      bookings: bookings.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      orders: orders.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      blogs: blogs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};